using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Classes;

namespace DGSService.Controllers
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

        [HttpPost("user")]
        public async Task<ActionResult<bool>> AddUser(AddUser user)
        {

            var userfromTable = new UserfromTable
            {
                userId = _context.Users.Max(u => u.userId) + 1,
                name = user.name,
                surname = user.surname,
                createdDate = DateTime.UtcNow,
                lastUpdatedDate = DateTime.UtcNow,
                userName = user.userName,
                password = user.password,
                role = user.role,
                email = user.email,
                resetCode = "",
                admin = user.rights.admin,
                read = user.rights.read,
                write = user.rights.write,
                delete = user.rights.delete,
                share = user.rights.share
            };

            _context.Users.Add(userfromTable);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("ChangePassword")]
        public async Task<ActionResult<bool>> ChangePassword(string username, string newPassword)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.userName == username);
            if (user == null)
            {
                return NotFound();
            }

            user.password = newPassword;
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return true;
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.userId)
            {
                return BadRequest();
            }

            user.lastUpdatedDate = DateTime.UtcNow;
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }

}

