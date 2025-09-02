using Microsoft.EntityFrameworkCore;
using SafeShare.CORE.Entities;
using SafeShare.CORE.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using static System.Net.WebRequestMethods;

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
            var fileRecord = await _dataContext.filesToUpload.FirstOrDefaultAsync(f => f.FileId == fileId);
            if (fileRecord == null)
            {
                throw new FileNotFoundException("The file is not found in the system.");
            }


            string storagePath = fileRecord.StoragePath;
            if (string.IsNullOrEmpty(storagePath))
            {
                throw new InvalidOperationException("No storage path found for the file.");
            }
            //שליפה מהענן!!
            FileDownload fileDownload = new FileDownload()
            {
                FileName = fileRecord.FileName,
                FileType = fileRecord.FileType,
                pathInS3 = storagePath,
                EncryptionKey = fileRecord.EncryptionKey,
                Nonce = fileRecord.Nonce
            };
            fileRecord.DownloadCount++;
            await _dataContext.SaveChangesAsync();

            return fileDownload;

        }

        public async Task<IEnumerable<FileToUpload>> GetFilesByUserIdAsync(int userId)
        {
            var files = await _dataContext.filesToUpload
                .Where(file => file.UserId == userId) // הנחה שיש שדה UserId ב-FileToUpload
                .ToListAsync(); // מחזיר רשימה של קבצים
            return files;
        }

        public async Task<bool> UpdateFileAsync(int fileId, FileToUpload file)
        {
            var fileFromDB = await _dataContext.filesToUpload.FirstOrDefaultAsync(f => f.FileId == fileId); ;
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

        public async Task<int> UploadFileAsync(string pathInS3, string fileName, int userId, byte[] EncryptionKey1, byte[] Nonce1, string fileType)
        {
            if (string.IsNullOrWhiteSpace(fileName))
                throw new ArgumentException("שם הקובץ והסיסמה חובה!");

            // יצירת אובייקט ושמירה במסד נתונים
            var fileToUpload = new FileToUpload
            {
                FileName = fileName,
                DownloadCount = 0,
                StoragePath = pathInS3, // נתיב מהאחסון
                UploadDate = DateTime.Now,
                FileType =  fileType,
                UserId = userId,
                EncryptionKey = EncryptionKey1,
                Nonce = Nonce1

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

