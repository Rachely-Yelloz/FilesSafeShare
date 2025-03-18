using Microsoft.AspNetCore.Http;
using SafeShare.CORE.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.CORE.Services
{
    public interface IFileService
    {
        Task<int> UploadFileAsync(IFormFile file, string fileName, string passwordHash);

        // Get file details by fileId
        Task<FileToUpload> GetFileAsync(int fileId);

        // Get file for download (decrypt if necessary)
        Task<FileDownload> GetFileForDownloadAsync(int fileId);

        // Update file details (not content, just metadata)
        Task<bool> UpdateFileAsync(int fileId, FileToUpload file);
        Task<bool> DeleteFileAsync(int fileId);
        Task<bool> UpdateFileCountAsync(int fileId);
    }
}
