using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SafeShare.CORE.Entities;
using SafeShare.CORE.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SafeShare.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class FileController : ControllerBase
    {
        private readonly IFileService _fileService;
        public FileController(IFileService fileService)
        {
            _fileService = fileService;
        }
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFileAsync([FromQuery] string pathInS3, [FromQuery] string fileName, [FromQuery] string passwordHash)
        {
            var idClaim = User.FindFirst("id")?.Value;
            var result = await _fileService.UploadFileAsync(pathInS3, fileName, passwordHash,int.Parse(idClaim));
            if (result > 0)
                return Ok(result);
            return BadRequest(result);
        }

        // Get file details by fileId
        [HttpGet("{fileId}")]
        public async Task<IActionResult> GetFileAsync(int fileId)
        {
            var file = await _fileService.GetFileAsync(fileId);
            if (file != null)
                return Ok(file);
            return NotFound();
        }

        // Get encrypted file for download
        [HttpGet("download/{fileId}")]
        public async Task<IActionResult> DownloadFileAsync(int fileId)
        {
            var file = await _fileService.GetFileForDownloadAsync(fileId);
            if (file != null)
                return Ok(file);
            return NotFound();
        }

        // Update file metadata (e.g. file name)
        [HttpPut("{fileId}")]
        public async Task<IActionResult> UpdateFileAsync(int fileId, [FromBody] FileToUpload file)
        {
            var result = await _fileService.UpdateFileAsync(fileId, file);
            if (result)
                return Ok(result);
            return BadRequest(result);
        }
        [HttpPut("{fileId}/countdownload")]
        public async Task<IActionResult> UpdateFileCountAsync(int fileId )
        {
            var result = await _fileService.UpdateFileCountAsync(fileId);
            if (result)
                return Ok(result);
            return BadRequest(result);
        }
        [HttpDelete]
        public async Task<IActionResult> DeleteFileAsync(int fileId)
        {
            var result = await _fileService.DeleteFileAsync(fileId);
            if (result) return Ok(result);
            return BadRequest(result);
        }


    }
}
