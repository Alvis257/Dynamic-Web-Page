using Microsoft.AspNetCore.Mvc;
using WebApplication1.Classes;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        // This is a mock user for demonstration purposes
        private User mockUser = new User { Username = "test", Password = "test" };

        [HttpPost("login")]
        public IActionResult Login(User user)
        {
            if (user.Username == mockUser.Username && user.Password == mockUser.Password)
            {
                // If user is authenticated, return a success response
                return Ok(new { message = "Login successful" });
            }
            else
            {
                // If authentication fails, return a bad request response
                return BadRequest(new { message = "Username or password is incorrect" });
            }
        }
    }
}
