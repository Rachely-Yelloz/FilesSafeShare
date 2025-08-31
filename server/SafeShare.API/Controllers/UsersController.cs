using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using SafeShare.API.Models;
using SafeShare.CORE.DTO_s;
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
        private readonly IMapper _mapper;
        private readonly IlogService _logService;

        public UsersController(IUserService userService, IMapper mapper, IlogService logService)
        {
            _userService = userService;
            _mapper = mapper;
            _logService = logService;
        }



        // עדכון משתמש
        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUserAsync(int userId, [FromBody] UserPostModel user)
        {
            var isAdminClaim = User.FindFirst("isAdmin")?.Value;
            var usernameClaim = User.FindFirst("name")?.Value;
            var idClaim = User.FindFirst("id")?.Value;
            if (isAdminClaim == "false" || userId.ToString() != idClaim)
                return Unauthorized();
            var userSend = new User() { Email = user.Email, PasswordHash = user.PasswordHash, IsAdmin = user.IsAdmin, Username = user.Username };
            var result = await _userService.UpdateUserAsync(userId, userSend);
            if (result == null)
            {
                //_logger.LogWarning("Failed to update user with ID {UserId}. Service returned null.", userId);
                await _logService.LogAsync(new LogMessage()
                {
                    Action = "Update User",
                    UserName = usernameClaim,
                    IsSuccess = false,
                    ErrorMessage = "Error during the update process service returend null",
                    UserId = int.Parse(idClaim),
                    CreatedAt = DateTime.UtcNow
                });

                return BadRequest(new { message = "User update failed", errors = "Error during the update process" });
            }
            var resultDTO = _mapper.Map<UserDTO>(result);
            //   _logger.LogInformation("User with ID {UserId} successfully updated.", userId);
            await _logService.LogAsync(new LogMessage()
            {
                Action = "Update User",
                UserName = usernameClaim,
                IsSuccess = true,
                UserId = int.Parse(idClaim),
                CreatedAt = DateTime.UtcNow
            });
            return Ok(resultDTO);

        }

        // קבלת כל המשתמשים
        [HttpGet]
        public async Task<IActionResult> GetAllUsersAsync()
        {
            var isAdminClaim = User.FindFirst("isAdmin")?.Value;
            if (isAdminClaim == "false")
                return Unauthorized();
            var users = await _userService.GetAllUsersAsync();
            if (users != null && users.Any())
            {
                var resultDTO = _mapper.Map<IEnumerable<UserDTO>>(users);
                return Ok(resultDTO);
            }
            return NotFound(new { message = "No users found" });
        }

        // קבלת משתמש לפי ID
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserByIdAsync(int userId)
        {
            var isAdminClaim = User.FindFirst("isAdmin")?.Value;
            var idClaim = User.FindFirst("id")?.Value;
            if (isAdminClaim == "false" || userId.ToString() != idClaim)
                return Unauthorized();
            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found" });
            var resultDTO = _mapper.Map<UserDTO>(user);

            return Ok(resultDTO);

        }

        // מחיקת משתמש
        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUserAsync(int userId)
        {
            var isAdminClaim = User.FindFirst("isAdmin")?.Value;
            var idClaim = User.FindFirst("id")?.Value;
            var usernameClaim = User.FindFirst("name")?.Value;
            if (isAdminClaim == "false" || userId.ToString() != idClaim)
                return Unauthorized();
            var result = await _userService.DeleteUserAsync(userId);
            if (result)  // אם המחיקה הצליחה
            {
                await _logService.LogAsync(new LogMessage()
                {
                    Action = "delete User",
                    UserName = usernameClaim,
                    IsSuccess = true,
                    UserId = int.Parse(idClaim),
                    CreatedAt = DateTime.UtcNow
                }); return Ok(new { message = "User deleted successfully" });
            }
            //_logger.LogWarning("Failed to delete user with ID {UserId}. User not found.", userId);
            await _logService.LogAsync(new LogMessage()
            {
                Action = "delete User",
                UserName = usernameClaim,
                IsSuccess = false,
                ErrorMessage = "Error during the delete process service returend null",
                UserId = int.Parse(idClaim),
                CreatedAt = DateTime.UtcNow
            });
            return NotFound(new { message = "User not found" });
        }
    }
}

