using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SafeShare.API.Models;
using SafeShare.CORE.DTO_s;
using SafeShare.CORE.Entities;
using SafeShare.CORE.Services;
using SafeShare.SERVICE;
using System.Data.SqlTypes;
using System.Security.Claims;

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
        private readonly IlogService _logService;


        public FileController(IFileService fileService, IMapper mapper, IlogService ilogService)
        {
            _fileService = fileService;
            _mapper = mapper;
            _logService = ilogService;
        }
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFileAsync([FromBody] FilePostModel file)
        {
            var userNameClaim = User.FindFirst("name")?.Value;
            var idClaim = User.FindFirst("id")?.Value;
            try
            {
                //        _logger.LogInformation("User {UserId} uploaded file {FileName}",
                //idClaim ?? "Anonymous", file.FileName);
                var result = await _fileService.UploadFileAsync(
                file.StoragePath,
                file.FileName,
                int.Parse(idClaim),
                file.GetEncryptionKey(),  // שימוש בפונקציה להמרת Base64 ל-byte[]
                file.GetNonce(),
                file.FileType// שימוש בפונקציה להמרת Base64 ל-byte[]
            );
                if (result > 0)
                {
                    //_logger.LogInformation("User {UserId} successfully uploaded file {FileName} with ID {FileId}",
                    //    idClaim, file.FileName, result);//TODO: maybe add it to the table
                    return Ok(result);
                }
                else
                {
                    await _logService.LogAsync(new LogMessage()
                    {
                        Action = "UploadFile",
                        UserId = int.Parse(idClaim),
                        UserName = userNameClaim,
                        CreatedAt = DateTime.UtcNow,
                        IsSuccess = false
                    });

                    // _logger.LogWarning("User {UserId} failed to upload file {FileName}. Service returned {Result}",
                    // idClaim, file.FileName, result);
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                await _logService.LogAsync(new LogMessage()
                {
                    Action = "UploadFile",
                    UserId = int.Parse(idClaim),
                    UserName = userNameClaim,
                    CreatedAt = DateTime.UtcNow,
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                });

                //_logger.LogError(ex, "Error while uploading file {FileName} by user {UserId}",
                // file.FileName, idClaim);
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
                // _logger.LogError("Download failed: file with ID {FileId} not found. {UserId}", fileId, "anonymous");
                await _logService.LogAsync(new LogMessage()
                {
                    Action = "try to get file",
                    UserId = 0,
                    UserName = "Anonymous",
                    CreatedAt = DateTime.UtcNow,
                    IsSuccess = false,
                    ErrorMessage = "File not found"
                });
                return NotFound(new { message = $"File with ID {fileId} does not exist." });
            }
            return Ok(file);
        }

        // Update file metadata (e.g. file name)
        [HttpPut("{fileId}")]
        public async Task<IActionResult> UpdateFileAsync(int fileId, [FromBody] string file)
        {
            var userNameClaim = User.FindFirst("name")?.Value;
            var idClaim = User.FindFirst("id")?.Value;
            var result = await _fileService.UpdateFileAsync(fileId, file);
            if (result)
            {
                //_logger.LogInformation(
                //"File details with ID {FileId} successfully updated by userid {UserId}. FileName: {FileName}",
                //fileId, file.UserId, file.FileName);
                await _logService.LogAsync(new LogMessage()
                {
                    Action = "update file details",
                    UserId = int.Parse(idClaim),
                    UserName = userNameClaim,
                    CreatedAt = DateTime.UtcNow,
                    IsSuccess = true
                });
                return Ok(result);
                //  }
                //  _logger.LogWarning(
                //    "user id {UserId} Failed to update file details with ID {FileId}. Service returned false.",
                //   file.UserId, fileId
                //);

            }
            await _logService.LogAsync(new LogMessage()
            {
                Action = "update file details",
                UserId = int.Parse(idClaim),
                UserName = userNameClaim,
                CreatedAt = DateTime.UtcNow,
                IsSuccess = false
            });
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
