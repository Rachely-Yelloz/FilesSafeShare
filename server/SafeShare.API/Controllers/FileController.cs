using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SafeShare.API.Models;
using SafeShare.CORE.DTO_s;
using SafeShare.CORE.Entities;
using SafeShare.CORE.Services;
using System.Data.SqlTypes;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SafeShare.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class FileController : ControllerBase
    {
        private readonly IFileService _fileService;
        private readonly IMapper _mapper;  // הוספת המ mapper
        private readonly ILogger<FileController> _logger;


        public FileController(IFileService fileService, IMapper mapper, ILogger<FileController> logger)
        {
            _fileService = fileService;
            _mapper = mapper;
            _logger = logger;
        }
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFileAsync([FromBody] FilePostModel file)
        {

            var idClaim = User.FindFirst("id")?.Value;
            try
            {
                _logger.LogInformation("User {UserId} uploaded file {FileName}",
        idClaim ?? "Anonymous", file.FileName);

                var result = await _fileService.UploadFileAsync(
                file.StoragePath,
                file.FileName,
                int.Parse(idClaim),
                file.GetEncryptionKey(),  // שימוש בפונקציה להמרת Base64 ל-byte[]
                file.GetNonce()           // שימוש בפונקציה להמרת Base64 ל-byte[]
            );
                if (result > 0)
                {
                    //_logger.LogInformation("User {UserId} successfully uploaded file {FileName} with ID {FileId}",
                    //    idClaim, file.FileName, result);//TODO: maybe add it to the table
                    return Ok(result);
                }
                else
                {
                    _logger.LogWarning("User {UserId} failed to upload file {FileName}. Service returned {Result}",
                        idClaim, file.FileName, result);
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while uploading file {FileName} by user {UserId}",
                    file.FileName, idClaim);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while uploading the file.");
            }
        }

        // Get file details by fileId
        [HttpGet("{fileId}")]
        public async Task<IActionResult> GetFileAsync(int fileId)
        {
            var file = await _fileService.GetFileAsync(fileId);
            if (file == null)
            {
                return NotFound();
            }
            var fileDto = _mapper.Map<FileDTO>(file);  // שימוש ב AutoMapper למיפוי אוטומטי
            return Ok(fileDto);
        }

        [AllowAnonymous]
        // Get encrypted file for download
        [HttpPost("download/{fileId}")]
        public async Task<IActionResult> DownloadFileAsync(int fileId)
        {
            var file = await _fileService.GetFileForDownloadAsync(fileId);

            if (file == null)
            {
                // רישום שגיאה בלוג
                _logger.LogError("Download failed: file with ID {FileId} not found. {UserId}", fileId, "anonymous");

                return NotFound(new { message = $"File with ID {fileId} does not exist." });
            }
            return Ok(file);

        }

        // Update file metadata (e.g. file name)
        [HttpPut("{fileId}")]
        public async Task<IActionResult> UpdateFileAsync(int fileId, [FromBody] FileToUpload file)
        {
            var result = await _fileService.UpdateFileAsync(fileId, file);
            if (result)
            {
                _logger.LogInformation(
                "File details with ID {FileId} successfully updated by userid {UserId}. FileName: {FileName}",
                fileId, file.UserId, file.FileName);
                return Ok(result);
            }
            _logger.LogWarning(
              "user id {UserId} Failed to update file details with ID {FileId}. Service returned false.",
             file.UserId, fileId
          );
            return BadRequest(result);
        }
        [AllowAnonymous]
        [HttpPut("{fileId}/countdownload")]
        public async Task<IActionResult> UpdateFileCountAsync(int fileId)
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
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetFilesByUserIdAsync(int userId)
        {
            var files = await _fileService.GetFilesByUserIdAsync(userId);
            if (files != null && files.Any())
            {
                var fileDto = _mapper.Map<IEnumerable<FileDTO>>(files);  // שימוש ב AutoMapper למיפוי אוטומטי
                return Ok(fileDto);
            }
            return NotFound(); // מחזיר 404 אם לא נמצאו קבצים
        }

    }
}
