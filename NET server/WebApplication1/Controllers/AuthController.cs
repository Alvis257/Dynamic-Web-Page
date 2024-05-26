using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Classes;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using static Azure.Core.HttpHeader;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLogin user)
        {
            var authenticatedUser = await _context.Users.FirstOrDefaultAsync(u => u.userName == user.userName && u.password == user.password);
            if (authenticatedUser != null)
            {
                var userRights = new
                {
                    Admin = authenticatedUser.admin || false,
                    Read = authenticatedUser.read || false,
                    Write = authenticatedUser.write || false,
                    Delete = authenticatedUser.delete || false,
                    Share = authenticatedUser.share || false
                };

                var userWithoutPassword = new
                {
                    authenticatedUser.userId,
                    authenticatedUser.name,
                    authenticatedUser.surname,
                    authenticatedUser.createdDate,
                    authenticatedUser.lastUpdatedDate,
                    authenticatedUser.userName,
                    authenticatedUser.role,
                    authenticatedUser.email,
                    authenticatedUser.resetCode,
                    Rights = userRights
                };

                return Ok(userWithoutPassword);
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpGet("getByEmail/{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.email == email);
            if (user != null)
            {
                var userRights = new
                {
                    Admin = user.admin,
                    Read = user.read,
                    Write = user.write,
                    Delete = user.delete,
                    Share = user.share
                };

                var userWithoutPassword = new
                {
                    user.userId,
                    user.name,
                    user.surname,
                    user.createdDate,
                    user.lastUpdatedDate,
                    user.userName,
                    user.role,
                    user.email,
                    user.resetCode,
                    Rights = userRights
                };

                return Ok(userWithoutPassword);
            }
            else
            {
                return NotFound();
            }
        }


        [HttpPost("resetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.userName == model.userName);
            if (user != null && await CheckResetCodeFunction(user.email, model.resetCode))
            {
                user.password = model.newPassword;
                await _context.SaveChangesAsync();
                return Ok();
            }
            return NotFound();
        }

        [HttpPost("sendResetCode")]
        public async Task<IActionResult> SendResetCode([FromBody] request request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.email == request.email);
            if (user != null)
            {
                var resetCode = Guid.NewGuid().ToString();
                user.resetCode = resetCode;
                await _context.SaveChangesAsync();

                var emailSent = await SendEmail(user.name + user.surname, user.email, resetCode);
                if (emailSent)
                {
                    return Ok();
                }
            }
            return NotFound();
        }

        [HttpPost("checkResetCode")]
        public async Task<IActionResult> CheckResetCode(CheckCode checkCode)
        {
            if (await CheckResetCodeFunction(checkCode.email, checkCode.resetCode) )
            {
                return Ok();
            }
            return NotFound() ;
        }

        private async Task<bool> CheckResetCodeFunction(string email, string resetCode)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.email == email);
            if (user != null && user.resetCode == resetCode)
            {
                return true;
            }
            return false;
        }

        private async Task<bool> SendEmail(string name, string to, string resetCode)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(new MailboxAddress("DGS", "automateddgs@gmail.com"));
                email.To.Add(new MailboxAddress(name, to));
                email.Subject = "Reset Code";
                email.Body = new TextPart("plain") { Text = $"Your reset code is {resetCode}" };

                using (var client = new MailKit.Net.Smtp.SmtpClient())
                {
                    await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync("automatdgs@gmail.com", "rgfnwhjaurnbbifz").ConfigureAwait(false);
                    await client.SendAsync(email);
                    await client.DisconnectAsync(true);
                }

                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}