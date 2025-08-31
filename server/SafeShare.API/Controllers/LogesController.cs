using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SafeShare.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogesController : ControllerBase
    {
        private readonly ILogger<LogesController> _logger;

        public LogesController(ILogger<LogesController> logger)
        {
            _logger = logger;
        }
        [HttpPost]
        public IActionResult LogMessage()
        {
            Log.Information("This is a log message from LogesController.");

            _logger.LogInformation("This is a log message from LogesController.");
            return Ok("Log message recorded.");
        }
    }
}
