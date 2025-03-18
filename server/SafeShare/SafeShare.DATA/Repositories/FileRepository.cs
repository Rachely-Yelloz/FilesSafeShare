using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SafeShare.CORE.Entities;
using SafeShare.CORE.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.DATA.Repositories
{
    public class FileRepository : IFileRepository
    {
        private readonly DataContext _dataContext;
        public FileRepository(DataContext dataContext)
        {
            _dataContext = dataContext;

        }
        public async Task<bool> DeleteFileAsync(int fileId)
        {
            var file = await _dataContext.filesToUpload.FindAsync(fileId);
            if (file == null)
            {
                return false;
            }
            _dataContext.filesToUpload.Remove(file);
            await _dataContext.SaveChangesAsync();
            return true;
        }

        public async Task<FileToUpload?> GetFileAsync(int fileId)
        {

            var file = await _dataContext.filesToUpload
                .FirstOrDefaultAsync(file => file.FileId == fileId);  // השוואה בין userId של המשתמש לעומת המשתנה שנשלח
            if (file != null)
                file.StoragePath = null;
            return file;

        }

        public async Task<FileDownload> GetFileForDownloadAsync(int fileId)
        {
            var fileRecord = await _dataContext.filesToUpload.FindAsync(fileId);
            if (fileRecord == null)
            {
                throw new FileNotFoundException("הקובץ לא נמצא במערכת");
            }
           

            string storagePath = fileRecord.StoragePath;
            if (string.IsNullOrEmpty(storagePath))
            {
                throw new Exception("לא נמצא נתיב אחסון לקובץ");
            }
            //שליפה מהענן!!
            FileDownload fileDownload = new FileDownload()
            {
                FileContent = new byte[100],//forom the cloud
                FileName = fileRecord.FileName,
                FileType = fileRecord.FileType
            };
            fileRecord.DownloadCount++;
            await _dataContext.SaveChangesAsync();

            return fileDownload;

        }


        public async Task<bool> UpdateFileAsync(int fileId, FileToUpload file)
        {
            var fileFromDB = await _dataContext.filesToUpload.FindAsync(fileId);
            if (fileFromDB == null || file == null)
            {
                return false;
            }

            fileFromDB.FileName = file.FileName;
            fileFromDB.UploadDate = file.UploadDate;
            fileFromDB.DownloadCount = file.DownloadCount;
            fileFromDB.FileType = file.FileType;
            fileFromDB.StoragePath = file.StoragePath;

            // שמירה למסד הנתונים
            await _dataContext.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateFileCountAsync(int fileId)
        {
            var fileFromDB = await _dataContext.filesToUpload.FindAsync(fileId);
            if (fileFromDB == null)
            {
                return false;
            }
            fileFromDB.DownloadCount++;
            await _dataContext.SaveChangesAsync();
            return true;

        }

        public async Task<int> UploadFileAsync(IFormFile file, string fileName, string passwordHash)
        {
            if (file == null || file.Length == 0)
                return 0;

            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                byte[] fileBytes = memoryStream.ToArray(); // קובץ מוצפן בפורמט בינארי

                // העלאה לענן  TODO
                FileToUpload fileToUpload = new FileToUpload()
                {
                    FileName = file.FileName,
                    DownloadCount = 0,
                    StoragePath = "",//לשלוף מהענן
                    UploadDate = DateTime.Now,
                    FileType = Path.GetExtension(file.FileName),
                    User = null// לשלוף מהטוקן


                };
                await _dataContext.filesToUpload.AddAsync(fileToUpload);

                await _dataContext.SaveChangesAsync();

                // 3. החזרת ה-ID של הקובץ כדי שנוכל להשתמש בו ליצירת קישור מוגן
                return fileToUpload.FileId;

            }
        }


    }
}
