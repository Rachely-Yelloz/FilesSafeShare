﻿using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SafeShare.API.Models;
using SafeShare.CORE.DTO_s;
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
        public async Task<IActionResult> GenerateProtectedLink([FromBody] protectedLinkGenerate linkToGenerate)
        {
            var idClaim = User.FindFirst("id")?.Value;
            try
            {
                string link = await _protectedLinkService.GenerateProtectedLinkAsync(linkToGenerate.fileId, linkToGenerate.password, linkToGenerate.isOneTimeUse, linkToGenerate.downloadLimit, int.Parse(idClaim));
                return Ok(new { link });
            }
            catch (Exception ex)
            {
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
        [HttpDelete("delete/{linkId}")]
        public async Task<IActionResult> DeleteProtectedLink(int linkId)
        {
            try
            {
                var idClaim = User.FindFirst("id")?.Value;

                await _protectedLinkService.DeleteProtectedLinkAsync(linkId, int.Parse(idClaim));
                return Ok("your link deleted successfully");
            }
            catch (Exception ex)
            {
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
                return Ok("your link updated successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
