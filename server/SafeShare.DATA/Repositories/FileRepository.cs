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
                return null;
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
                FileName = fileRecord.FileName,
                FileType = fileRecord.FileType,
                pathInS3=storagePath
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

        public async Task<int> UploadFileAsync(string pathInS3, string fileName, string passwordHash, int userId)
        {
            if (string.IsNullOrWhiteSpace(fileName) || string.IsNullOrWhiteSpace(passwordHash))
                throw new ArgumentException("שם הקובץ והסיסמה חובה!");
            var fileExtension = Path.GetExtension(fileName).ToLower();

            // יצירת אובייקט ושמירה במסד נתונים
            var fileToUpload = new FileToUpload
            {
                FileName = fileName,
                DownloadCount = 0,
                StoragePath = pathInS3, // נתיב מהאחסון
                UploadDate = DateTime.Now,
                FileType = fileExtension,
                UserId=userId
            };

            await _dataContext.filesToUpload.AddAsync(fileToUpload);
            try
            {
                await _dataContext.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Error: {ex.InnerException?.Message}");
                throw;
            }

            return fileToUpload.FileId; // החזרת מזהה הקובץ
        }

    }




}

