using Microsoft.AspNetCore.Mvc;
using SafeShare.API.Models;
using SafeShare.CORE.Entities;
using SafeShare.CORE.Services;
namespace SafeShare.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProtectedLinkController : ControllerBase
    {
        private readonly IProtectedLinkService _protectedLinkService;

        public ProtectedLinkController(IProtectedLinkService protectedLinkService)
        {
            _protectedLinkService = protectedLinkService;
        }


        [HttpPost("generate")]
        public async Task<IActionResult> GenerateProtectedLink([FromQuery] int fileId, [FromQuery] string password, [FromQuery] bool isOneTimeUse, [FromQuery] int? downloadLimit)
        {
            try
            {
                string link = await _protectedLinkService.GenerateProtectedLinkAsync(fileId, password, isOneTimeUse, downloadLimit);
                return Ok(new { link });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("download/{encryptedLink}")]
        public async Task<IActionResult> DownloadFile(string encryptedLink, [FromQuery] string password)
        {
            try
            {
                int fileId = await _protectedLinkService.DecipherProtectedLinkAsync(encryptedLink,password);
                return Ok(fileId); 
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("הסיסמה אינה נכונה");
            }
            catch (FileNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

    }
}
