using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SafeShare.API.Models;
using SafeShare.CORE.DTO_s;
using SafeShare.CORE.Entities;
using SafeShare.CORE.Services;
using SafeShare.SERVICE;
using System.Security.Claims;
namespace SafeShare.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class ProtectedLinkController : ControllerBase
    {
        private readonly IProtectedLinkService _protectedLinkService;
        private readonly IMapper _mapper;  // הוספת המ mapper
        private readonly IlogService _logService;
        public ProtectedLinkController(IProtectedLinkService protectedLinkService, IMapper mapper,IlogService logService)
        {
            _protectedLinkService = protectedLinkService;
            _mapper = mapper;
            _logService = logService;
        }


        [HttpPost("generate")]
        public async Task<IActionResult> GenerateProtectedLink([FromBody] protectedLinkGenerate linkToGenerate)
        {
            var idClaim = User.FindFirst("id")?.Value;
            try
            {
                var usernameClaim = User.FindFirst("name")?.Value;
                string link = await _protectedLinkService.GenerateProtectedLinkAsync(linkToGenerate.fileId, linkToGenerate.password, linkToGenerate.isOneTimeUse, linkToGenerate.downloadLimit, int.Parse(idClaim));
                // _logger.LogInformation("User {UserId} generated a protected link for file {FileId}",
                //     idClaim, linkToGenerate.fileId);
                await _logService.LogAsync(new LogMessage()
                {
                    Action = "generate protected link",
                    UserName = usernameClaim,
                    IsSuccess = true,
                    UserId = int.Parse(idClaim),
                    CreatedAt = DateTime.UtcNow
                });
                return Ok(new { link });
            }
            catch (Exception ex)
            {
                //_logger.LogError(ex, "Error while generating protected link for file {FileId} by user {UserId}",
                //    linkToGenerate.fileId, idClaim);
                await _logService.LogAsync(new LogMessage()
                {
                    Action = "generate protected link",
                    UserName = User.FindFirst("name")?.Value,
                    IsSuccess = false,
                    ErrorMessage = ex.Message,
                    UserId = int.Parse(idClaim),
                    CreatedAt = DateTime.UtcNow
                });
                return BadRequest(new { message = ex.Message });
            }
        }
        [AllowAnonymous]
        [HttpPost("download")]
        public async Task<IActionResult> DownloadFile([FromBody] ProtectedLinkDownloadModel link)
        {
            try
            {
                int fileId = await _protectedLinkService.DecipherProtectedLinkAsync(link.LinkIdDecoded, link.Password);
                return Ok(fileId);
            }
            catch (UnauthorizedAccessException)
            {
                // _logger.LogWarning("Unauthorized access attempt with link {LinkId} {UserId}", link.LinkIdDecoded, 0);
                await _logService.LogAsync(new LogMessage()
                {
                    Action = "Update User",
                    UserName = "Anonymous",
                    IsSuccess = false,
                    ErrorMessage = "nauthorized access attempt to the link",
                    UserId = 0,
                    CreatedAt = DateTime.UtcNow
                });
                return Unauthorized("worng password");
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
        [HttpGet("file/{fileId}")]
        public async Task<IActionResult> GetProtectedLinksByFileIdAsync(int fileId)
        {
            try
            {
                var protectedLinks = await _protectedLinkService.GetProtectedLinksByFileIdAsync(fileId);

                if (protectedLinks == null || !protectedLinks.Any())
                {
                    return NotFound("No protected links were found for this file..");
                }

                // אם מצאנו לינקים מוגנים, נמפה אותם ל-DTO ותחזיר אותם
                var protectedLinksDto = _mapper.Map<IEnumerable<ProtectedLinkDTO>>(protectedLinks);
                return Ok(protectedLinksDto);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpDelete("delete/{linkId}")]
        public async Task<IActionResult> DeleteProtectedLink(int linkId)
        {
            var idClaim = User.FindFirst("id")?.Value;

            try
            {

                await _protectedLinkService.DeleteProtectedLinkAsync(linkId, int.Parse(idClaim));
                //_logger.LogInformation("User {UserId} deleted protected link {LinkId}",
                //    idClaim, linkId);
                await _logService.LogAsync(new LogMessage()
                {
                    Action = "delete protected link",
                    UserName = User.FindFirst("name")?.Value,
                    IsSuccess = true,
                    UserId = int.Parse(idClaim),
                    CreatedAt = DateTime.UtcNow
                });
                return Ok("your link deleted successfully");
            }
            catch (Exception ex)
            {
               // _logger.LogError(ex, "Error while deleting protected link {LinkId} by user {UserId}",
               //     linkId, idClaim);
                await _logService.LogAsync(new LogMessage()
                {
                    Action = "delete protected link",
                    UserName = User.FindFirst("name")?.Value,
                    IsSuccess = false,
                    ErrorMessage = ex.Message,
                    UserId = int.Parse(idClaim),
                    CreatedAt = DateTime.UtcNow
                });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("update/{linkId}")]
        public async Task<IActionResult> UpdateProtectedLink(int linkId, [FromBody] ProtectedLinkPutModel linkToUpdate)
        {
            try
            {
                var idClaim = User.FindFirst("id")?.Value;
                await _protectedLinkService.UpdateProtectedLinkAsync(linkId, linkToUpdate.FileId, linkToUpdate.IsOneTimeUse, linkToUpdate.DownloadLimit,linkToUpdate.ExpirationDate, int.Parse(idClaim));
                //_logger.LogInformation("User {UserId} updated protected link {LinkId}",
                //    idClaim, linkId);
                await _logService.LogAsync(new LogMessage()
                {
                    Action = "update protected link",
                    UserName = User.FindFirst("name")?.Value,
                    IsSuccess = true,
                    UserId = int.Parse(idClaim),
                    CreatedAt = DateTime.UtcNow
                });
                return Ok("your link updated successfully");
            }
            catch (Exception ex)
            {
                //_logger.LogError(ex, "Error while updating protected link {LinkId} by user {UserId}",
                //    linkId, User.FindFirst("id")?.Value);
                await _logService.LogAsync(new LogMessage()
                {
                    Action = "update protected link",
                    UserName = User.FindFirst("name")?.Value,
                    IsSuccess = false,
                    ErrorMessage = ex.Message,
                    UserId = int.Parse(User.FindFirst("id")?.Value),
                    CreatedAt = DateTime.UtcNow
                });
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
