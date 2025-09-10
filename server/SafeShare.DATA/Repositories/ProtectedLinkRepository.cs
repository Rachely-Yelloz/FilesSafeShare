using Microsoft.EntityFrameworkCore;
using SafeShare.CORE.Entities;
using SafeShare.CORE.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
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
        public async Task<string> GenerateProtectedLinkAsync(int fileId, string passwordhash, bool isOneTimeUse, int? downloadLimit, int userId, DateTime? expirationDate)
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
                ExpirationDate = expirationDate, // תקף לשבוע
                IsOneTimeUse = isOneTimeUse,
                DownloadLimit = downloadLimit,
                CurrentDownloadCount = 0,
                UserId = userId
            };

            await _dataContext.protectedLinks.AddAsync(protectedLink);
            await _dataContext.SaveChangesAsync();

            // הצפנת ה- fileId לייצור קישור מוגן
            string encryptedId = EncryptionHelper.Encrypt(protectedLink.LinkId.ToString());
            protectedLink.linkid_hash = encryptedId; // שמירת ה- hash בקישור המוגן
            await _dataContext.SaveChangesAsync();


            return encryptedId;
        }

        public async Task<int> DecipherProtectedLinkAsync(string fileId, string passwordhash)
        {
           

            if (!int.TryParse(EncryptionHelper.Decrypt(fileId), out int linkId))
                throw new InvalidOperationException("invalid link "+fileId);

            ProtectedLink protectedLink = await _dataContext.protectedLinks.FindAsync(linkId);
            if (protectedLink == null)
                throw new FileNotFoundException("there isnt link with this id "+fileId);

            // השוואת סיסמה מאובטחת
            if (!CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(protectedLink.PasswordHash),
                Encoding.UTF8.GetBytes(passwordhash)))
            {
                throw new UnauthorizedAccessException("invalid password ");
            }

            // בדיקה אם הגעת למגבלת ההורדות
            if ((protectedLink.IsOneTimeUse && protectedLink.CurrentDownloadCount >= 1) ||
                (protectedLink.DownloadLimit.HasValue && protectedLink.DownloadLimit == protectedLink.CurrentDownloadCount))
            {
                throw new InvalidOperationException("you cant dawnload more");
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

        //    public async Task<bool> DeleteProtectedLinkAsync(int linkId, int userId)
        //    {
        //        var link = await _dataContext.protectedLinks.FindAsync(linkId);
        //        if (link == null)
        //        {
        //            throw new FileNotFoundException($"קישור עם מזהה {linkId} לא נמצא.");
        //        }
        //        if (link.UserId == userId)
        //        {
        //            _dataContext.protectedLinks.Remove(link);
        //            int changes = await _dataContext.SaveChangesAsync();
        //            return changes > 0;
        //        }
        //        else
        //        {
        //            throw new UnauthorizedAccessException("you not alllowd to delete the link.");
        //        }
        //    }

        //    public async Task<bool> UpdateProtectedLinkAsync(int linkId, int fileId, bool isOneTimeUse, int downloadLimit, int userId)
        //    {
        //        var link =await _dataContext.protectedLinks.FindAsync(linkId);
        //        if (link == null)
        //        {
        //            throw new FileNotFoundException($"קישור עם מזהה {linkId} לא נמצא.");
        //        }
        //        if (link.UserId == userId)
        //        {
        //            link.FileId = fileId;
        //            link.IsOneTimeUse = isOneTimeUse;
        //            link.DownloadLimit = downloadLimit;
        //            _dataContext.protectedLinks.Update(link);
        //            int changes = await _dataContext.SaveChangesAsync();
        //            return changes > 0;
        //        }
        //        else
        //        {
        //            throw new UnauthorizedAccessException("you not alllowd to update the link.");
        //        }
        //    }
        //}
        public async Task<bool> DeleteProtectedLinkAsync(int linkId, int userId)
        {
            var link = await _dataContext.protectedLinks.FindAsync(linkId);
            if (link == null)
                throw new FileNotFoundException($"linkId {linkId} not found.");

            if (link.UserId != userId)
                throw new UnauthorizedAccessException("You are not allowed to delete the link.");

            _dataContext.protectedLinks.Remove(link);
            int changes = await _dataContext.SaveChangesAsync();
            return changes > 0;
        }

        public async Task<bool> UpdateProtectedLinkAsync(int linkId, int fileId, bool isOneTimeUse, int? downloadLimit, DateTime? ExpirationDate , int userId)
        {
            var link = await _dataContext.protectedLinks.FindAsync(linkId);
            if (link == null)
                throw new FileNotFoundException($"linkId {linkId} not found.");

            if (link.UserId != userId)
                throw new UnauthorizedAccessException("You are not allowed to update the link.");

            link.FileId = fileId;
            link.IsOneTimeUse = isOneTimeUse;
            link.DownloadLimit = downloadLimit;
            link.ExpirationDate = ExpirationDate;
            link.CurrentDownloadCount=link.CurrentDownloadCount; // לא לשנות את מספר ההורדות הנוכחי

            // אין צורך לקרוא ל-Update כי EF עוקב אחרי האובייקט
            int changes = await _dataContext.SaveChangesAsync();
            return changes > 0;
        }
    }
    }



