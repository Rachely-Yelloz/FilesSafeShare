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
    public class ProtectedLinkRepository : IProtectedLinkRepository
    {
        private readonly DataContext _dataContext;
        public ProtectedLinkRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public async Task<string> GenerateProtectedLinkAsync(int fileId, string passwordhash, bool isOneTimeUse, int? downloadLimit, int userId)
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
                CurrentDownloadCount = 0,
                UserId = userId
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
            // כתובת תקנית של השרת (ללא קידוד)
            var url = "https://yourapp.com/download/";

            // פענוח הכתובת המקודדת
            string decodedLink = Uri.UnescapeDataString(link);

            // בדיקה אם הקישור באמת מתחיל בכתובת הרצויה
            if (!decodedLink.StartsWith(url))
                throw new InvalidOperationException("הקישור אינו תקין.");

            // חיתוך החלק של ה-ID המוצפן
            var changeLink = decodedLink.Substring(url.Length);

            if (!int.TryParse(EncryptionHelper.Decrypt(changeLink), out int linkId))
                throw new InvalidOperationException("הקישור המוצפן לא מכיל מזהה תקין.");

            ProtectedLink protectedLink = await _dataContext.protectedLinks.FindAsync(linkId);
            if (protectedLink == null)
                throw new FileNotFoundException("הקישור לא נמצא במסד הנתונים.");

            // השוואת סיסמה מאובטחת
            if (!CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(protectedLink.PasswordHash),
                Encoding.UTF8.GetBytes(passwordhash)))
            {
                throw new UnauthorizedAccessException("הסיסמה שהוזנה אינה תואמת.");
            }

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


        public async Task<IEnumerable<ProtectedLink>> GetProtectedLinksByFileIdAsync(int fileId)
        {
            // חיפוש כל הלינקים המוגנים הקשורים ל- fileId
            var protectedLinks = await _dataContext.protectedLinks
                .Where(link => link.FileId == fileId)
                .ToListAsync();

            return protectedLinks;
        }
    }
}



