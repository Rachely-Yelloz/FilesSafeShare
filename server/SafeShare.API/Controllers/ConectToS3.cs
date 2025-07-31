using Microsoft.AspNetCore.Mvc;
using Amazon.S3;
using Amazon.S3.Model;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace SafeShare.API.Controllers
{
    [Route("api/UploadFile")]
    [ApiController]
    public class ConectToS3 : ControllerBase
    {
   
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly string _region;
        private readonly string _accessKey;
        private readonly string _secretKey;

        public ConectToS3(IAmazonS3 s3Client, IConfiguration configuration)
        {
            _s3Client = s3Client;
            _bucketName = configuration["AWS:BucketName"];
            _region = configuration["AWS:Region"];
            _accessKey = configuration["AWS:AccessKey"];
            _secretKey = configuration["AWS:SecretKey"];
        }

        // 🟢 יצירת קישור PreSigned URL להעלאה ישירה
        [HttpGet("presigned-url")]
        public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
                return BadRequest("חובה לספק שם קובץ.");

            // חילוץ מזהה המשתמש מתוך ה-JWT
            var userId = User.FindFirstValue("id");
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("משתמש לא מזוהה.");

            var fileId = Guid.NewGuid().ToString(); // מזהה ייחודי לקובץ
            var key = $"uploads/{userId}/{fileId}_{fileName}"; // נתיב שמור

            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = key,
                Verb = HttpVerb.PUT, // העלאה
                Expires = DateTime.UtcNow.AddMinutes(10),
                ContentType = "application/octet-stream" // תמיכה בכל סוגי הקבצים
            };

            try
            {
                string uploadUrl = _s3Client.GetPreSignedURL(request);
                string fileUrl = $"https://{_bucketName}.s3.amazonaws.com/{key}";

                return Ok(new { uploadUrl, fileUrl, fileKey = key });
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode(500, $"שגיאה ביצירת קישור העלאה: {ex.Message}");
            }
        }
        
        // 🔽 יצירת קישור להורדה ישירה
        [HttpGet("download-url")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDownloadUrl([FromQuery] string fileKey)
        {
            if (string.IsNullOrEmpty(fileKey))
                return BadRequest("File ID must be provided.");

            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileKey,
                Verb = HttpVerb.GET, // הורדה
                Expires = DateTime.UtcNow.AddMinutes(5)
            };

            try
            {
                string downloadUrl = _s3Client.GetPreSignedURL(request);
                return Ok(new { downloadUrl });
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode(500, $"Error creating download link: {ex.Message}");
            }
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteFile([FromQuery] string fileKey)
        {
            if (string.IsNullOrEmpty(fileKey))
                return BadRequest("Must provide fileKey.");

            try
            {
                var deleteRequest = new DeleteObjectRequest
                {
                    BucketName = _bucketName,
                    Key = fileKey
                };

                var response = await _s3Client.DeleteObjectAsync(deleteRequest);

                return Ok(new { message = $"The file {fileKey} was deleted successfully." });
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode(500, $"Error deleting file: {ex.Message}");
            }
        }
    }
}

