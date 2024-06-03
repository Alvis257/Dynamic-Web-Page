using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Classes;
using MimeKit;
using MailKit.Security;
using DGSService.Service;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(ApplicationDbContext context, EmailService emailService, ILogger<AuthController> logger)
        {
            _context = context;
            _logger = logger;
            _emailService = emailService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLogin user)
        {
            try
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while loging in.");
                return StatusCode(500, "An error occurred while loging in.");
            }
        }

        [HttpGet("getByEmail/{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            try
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while geting user data.");
                return StatusCode(500, "An error occurred while geting user data.");
            }
        }


        [HttpPost("resetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            try
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while reseting password.");
                return StatusCode(500, "An error occurred while reseting password.");
            }
        }

        [HttpPost("sendResetCode")]
        public async Task<IActionResult> SendResetCode([FromBody] request request)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.email == request.email);
                if (user != null)
                {
                    var resetCode = Guid.NewGuid().ToString();
                    user.resetCode = resetCode;
                    await _context.SaveChangesAsync();

                    var emailSent = await _emailService.SendEmailAsync(user.name + " " + user.surname, user.email, resetCode);
                    if (emailSent)
                    {
                        return Ok();
                    }
                }
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while sending reset code.");
                return StatusCode(500, "An error occurred while sending reset code.");
            }
        }

        [HttpPost("checkResetCode")]
        public async Task<IActionResult> CheckResetCode(CheckCode checkCode)
        {
            try
            {

                if (await CheckResetCodeFunction(checkCode.email, checkCode.resetCode))
                {
                    return Ok();
                }
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while checking reset code.");
                return StatusCode(500, "An error occurred while checking reset code.");
            }
        }

        private async Task<bool> CheckResetCodeFunction(string email, string resetCode)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.email == email);
                if (user != null && user.resetCode == resetCode)
                {
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while checking reset code.");
                throw;
            }
        }

        //private async Task<bool> SendEmail(string name, string to, string resetCode)
        //{
        //    try
        //    {
        //        var email = new MimeMessage();
        //        email.From.Add(new MailboxAddress("DGS", "automateddgs@gmail.com"));
        //        email.To.Add(new MailboxAddress(name, to));
        //        email.Subject = "Reset Code";
        //        email.Body = new TextPart("plain") { Text = $"Your reset code is {resetCode}" };

        //        using (var client = new MailKit.Net.Smtp.SmtpClient())
        //        {
        //            await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
        //            await client.AuthenticateAsync("automatdgs@gmail.com", "rgfnwhjaurnbbifz").ConfigureAwait(false);
        //            await client.SendAsync(email);
        //            await client.DisconnectAsync(true);
        //        }

        //        return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "An error occurred while sending email.");
        //        throw;
        //    }
        //}
    }
}