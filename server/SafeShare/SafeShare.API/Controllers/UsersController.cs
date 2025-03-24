using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using SafeShare.API.Models;
using SafeShare.CORE.Entities;
using SafeShare.CORE.Services;


namespace SafeShare.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

  

        // עדכון משתמש
        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUserAsync(int userId, [FromBody] UserPostModel user)
        {
            var isAdminClaim = User.FindFirst("isAdmin")?.Value;
            var idClaim = User.FindFirst("id")?.Value;
            if (isAdminClaim == "false" || userId.ToString() != idClaim)
                return Unauthorized();
            var userSend = new User() { Email = user.Email, PasswordHash = user.PasswordHash, IsAdmin = user.IsAdmin, Username = user.Username };
            var result = await _userService.UpdateUserAsync(userId, userSend);
            if (result != null)  // אם העדכון הצליח
                return Ok(result);
            return BadRequest(new { message = "User update failed", errors = "Error during the update process" });
        }

        // קבלת כל המשתמשים
        [HttpGet]
        public async Task<IActionResult> GetAllUsersAsync()
        {
            var isAdminClaim = User.FindFirst("isAdmin")?.Value;
            if(isAdminClaim == "false")
                return Unauthorized();
            var users = await _userService.GetAllUsersAsync();
            if (users != null && users.Any())
                return Ok(users);
            return NotFound(new { message = "No users found" });
        }

        // קבלת משתמש לפי ID
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserByIdAsync(int userId)
        {
            var isAdminClaim = User.FindFirst("isAdmin")?.Value;
            var idClaim = User.FindFirst("id")?.Value;
            if (isAdminClaim == "false"||userId.ToString()!=idClaim)
                return Unauthorized();
            var user = await _userService.GetUserByIdAsync(userId);
            if (user != null)
                return Ok(user);
            return NotFound(new { message = "User not found" });
        }

        // מחיקת משתמש
        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUserAsync(int userId)
        {
            var isAdminClaim = User.FindFirst("isAdmin")?.Value;
            var idClaim = User.FindFirst("id")?.Value;
            if (isAdminClaim == "false" || userId.ToString() != idClaim)
                return Unauthorized();
            var result = await _userService.DeleteUserAsync(userId);
            if (result)  // אם המחיקה הצליחה
                return Ok(new { message = "User deleted successfully" });
            return NotFound(new { message = "User not found" });
        }
    }
}

