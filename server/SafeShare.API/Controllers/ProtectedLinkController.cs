using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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

    public class ProtectedLinkController : ControllerBase
    {
        private readonly IProtectedLinkService _protectedLinkService;
        private readonly IMapper _mapper;  // הוספת המ mapper

        public ProtectedLinkController(IProtectedLinkService protectedLinkService, IMapper mapper)
        {
            _protectedLinkService = protectedLinkService;
            _mapper = mapper;
        }


        [HttpPost("generate")]
        public async Task<IActionResult> GenerateProtectedLink([FromQuery] int fileId, [FromQuery] string password, [FromQuery] bool isOneTimeUse, [FromQuery] int? downloadLimit)
        {
            var idClaim = User.FindFirst("id")?.Value;
            try
            {
                string link = await _protectedLinkService.GenerateProtectedLinkAsync(fileId, password, isOneTimeUse, downloadLimit,int.Parse(idClaim));
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
        [HttpGet("file/{fileId}")]
        public async Task<IActionResult> GetProtectedLinksByFileIdAsync(int fileId)
        {
            try
            {
                var protectedLinks = await _protectedLinkService.GetProtectedLinksByFileIdAsync(fileId);

                if (protectedLinks == null || !protectedLinks.Any())
                {
                    return NotFound("לא נמצאו לינקים מוגנים עבור הקובץ הזה.");
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

    }
}
