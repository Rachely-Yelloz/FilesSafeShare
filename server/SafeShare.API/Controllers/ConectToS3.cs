using Microsoft.AspNetCore.Mvc;
using Amazon.S3;
using Amazon.S3.Model;
using System.Threading.Tasks;

namespace SafeShare.API.Controllers
{
    [Route("api/UploadFile")]
    [ApiController]
    public class ConectToS3 : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public ConectToS3(IAmazonS3 s3Client, IConfiguration configuration)
        {
            _s3Client = s3Client;
            _bucketName = configuration["AWS:BucketName"];
        }

        [HttpGet("presigned-url")]
        public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
                return BadRequest("שם הקובץ נדרש");

            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = $"Images/{fileName}", // קבצים נשמרים בתיקיית Images
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(10),
                ContentType = "image/jpeg"
            };

            // הוספת כותרת ACL כדי לוודא שהבאקט הוא הבעלים
            request.Headers["x-amz-acl"] = "bucket-owner-full-control";

            try
            {
                string url = _s3Client.GetPreSignedURL(request);
                string fileUrl = $"https://{_bucketName}.s3.amazonaws.com/Images/{fileName}"; // URL להורדת התמונה

                return Ok(new { uploadUrl = url, fileUrl = fileUrl }); // החזרת ה-URL להעלאה וה-URL של התמונה
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode(500, $"שגיאה ביצירת URL עם הרשאות: {ex.Message}");
            }
        }
    }
}
