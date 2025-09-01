using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SafeShare.CORE.Entities;
using SafeShare.CORE.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SafeShare.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogesController : ControllerBase
    {
        private readonly IlogService _logService;
        public LogesController(IlogService logService)
        {
            _logService = logService;
        }
        [HttpPost("log")]
        public async Task<IActionResult> LogAsync([FromBody] LogMessage logMessage)
        {
            try
            {
                await _logService.LogAsync(logMessage);
                return Ok(new { message = "Log saved successfully." });
            }
            catch (Exception ex)
            {
                //Log.Error(ex, "Error saving log");
                return StatusCode(500, new { message = "An error occurred while saving the log." });
            }
        }
        [HttpGet("logs")]
        public async Task<IActionResult> GetAllLogsAsync()
        {
            try
            {
                var logs = await _logService.GetAllLogsAsync();
                return Ok(logs);
            }
            catch (Exception ex)
            {
                //Log.Error(ex, "Error retrieving logs");
                return StatusCode(500, new { message = "An error occurred while retrieving the logs." });
            }
        }

    }
}
