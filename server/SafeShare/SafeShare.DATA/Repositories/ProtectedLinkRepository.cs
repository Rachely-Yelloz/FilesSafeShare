using SafeShare.CORE.Entities;
using SafeShare.CORE.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.DATA.Repositories
{
    public class ProtectedLinkRepository:IProtectedLinkRepository
    {
        private readonly DataContext _dataContext;
        public ProtectedLinkRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        //public async Task<string> GenerateProtectedLinkAsync(int fileId, string passwordhash, bool isOneTimeUse, int? downloadLimit)
        //{
        //    var file = await _dataContext.filesToUpload.FindAsync(fileId);
        //    if (file == null)
        //        throw new FileNotFoundException("קובץ לא נמצא");


        //    // 3. יצירת רשומת קישור מוגן
        //    var protectedLink = new ProtectedLink
        //    {
        //        FileId = fileId,
        //        PasswordHash = passwordhash,
        //        CreationDate = DateTime.Now,
        //        ExpirationDate = DateTime.Now.AddDays(7), // תקף לשבוע
        //        IsOneTimeUse = isOneTimeUse,
        //        DownloadLimit = downloadLimit,
        //        CurrentDownloadCount = 0
        //    };

        //    await _dataContext.protectedLinks.AddAsync(protectedLink);
        //    await _dataContext.SaveChangesAsync();

        //    // 4. הצפנת ה- fileId כדי לייצר קישור מוגן
        //    string encryptedId = EncryptionHelper.Encrypt(protectedLink.LinkId.ToString());
        //    string downloadLink = $"https://yourapp.com/download/{encryptedId}";// TODO: change the link

        //    return downloadLink;
        //}
        //public async Task<int> decipherProtectedLinkAsync(string link, string passwordhash)
        //{
        //    int linkId = int.Parse(EncryptionHelper.Decrypt(link));
        //    ProtectedLink protectedLink = await _dataContext.protectedLinks.FindAsync(linkId);
        //    if (protectedLink == null)
        //        throw new FileNotFoundException("file not found");
        //    if (protectedLink.PasswordHash != passwordhash)
        //        throw new UnauthorizedAccessException("invalid password");

        //    if (protectedLink.IsOneTimeUse && protectedLink.CurrentDownloadCount == 1
        //        || (protectedLink.DownloadLimit != null && protectedLink.DownloadLimit == protectedLink.CurrentDownloadCount))
        //        throw new InvalidOperationException("You have reached the download limit of the link.");

        //    protectedLink.CurrentDownloadCount++;
        //    await _dataContext.SaveChangesAsync();
        //    return protectedLink.FileId;
        //}
        public async Task<string> GenerateProtectedLinkAsync(int fileId, string passwordhash, bool isOneTimeUse, int? downloadLimit)
        {
            var file = await _dataContext.filesToUpload.FindAsync(fileId);
            if (file == null)
                throw new FileNotFoundException($"קובץ עם מזהה {fileId} לא נמצא.");

            // יצירת רשומת קישור מוגן
            var protectedLink = new ProtectedLink
            {
                FileId = fileId,
                PasswordHash = passwordhash,
                CreationDate = DateTime.Now,
                ExpirationDate = DateTime.Now.AddDays(7), // תקף לשבוע
                IsOneTimeUse = isOneTimeUse,
                DownloadLimit = downloadLimit,
                CurrentDownloadCount = 0
            };

            await _dataContext.protectedLinks.AddAsync(protectedLink);
            await _dataContext.SaveChangesAsync();

            // הצפנת ה- fileId לייצור קישור מוגן
            string encryptedId = EncryptionHelper.Encrypt(protectedLink.LinkId.ToString());

            // זה יכול להיות מוגדר בפרופרטי או בקובץ קונפיגורציה
            string downloadLink = $"https://yourapp.com/download/{encryptedId}";  // TODO: לשנות את ה-URL

            return downloadLink;
        }

        public async Task<int> DecipherProtectedLinkAsync(string link, string passwordhash)
        {
            int linkId;
            try
            {
                linkId = int.Parse(EncryptionHelper.Decrypt(link));
            }
            catch (FormatException)
            {
                throw new InvalidOperationException("הקישור המוצפן לא תקין.");
            }

            ProtectedLink protectedLink = await _dataContext.protectedLinks.FindAsync(linkId);
            if (protectedLink == null)
                throw new FileNotFoundException("הקישור לא נמצא במסד הנתונים.");

            if (protectedLink.PasswordHash != passwordhash)
                throw new UnauthorizedAccessException("הסיסמה שהוזנה אינה תואמת.");

            // בדיקה אם הגעת למגבלת ההורדות
            if ((protectedLink.IsOneTimeUse && protectedLink.CurrentDownloadCount >= 1) ||
                (protectedLink.DownloadLimit.HasValue && protectedLink.DownloadLimit == protectedLink.CurrentDownloadCount))
            {
                throw new InvalidOperationException("הגעת למגבלת ההורדות של הקישור.");
            }

            // עדכון מספר ההורדות
            protectedLink.CurrentDownloadCount++;
            await _dataContext.SaveChangesAsync();

            return protectedLink.FileId;
        }
    }

}

