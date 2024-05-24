using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Classes;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
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

        [HttpPost("updateResetCode")]
        public async Task<IActionResult> UpdateResetCode([FromBody] UpdateResetCodeModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.userName == model.userName);
            if (user != null)
            {
                user.resetCode = model.resetCode;
                await _context.SaveChangesAsync();
                return Ok();
            }
            return NotFound();
        }

        [HttpPost("resetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.userName == model.userName);
            if (user != null && await CheckResetCode(user.email, model.resetCode))
            {
                user.password = model.newPassword;
                await _context.SaveChangesAsync();
                return Ok();
            }
            return NotFound();
        }

        private async Task<bool> CheckResetCode(string email, string resetCode)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.email == email);
            if (user != null && user.resetCode == resetCode)
            {
                return true;
            }
            return false;
        }
    }
}