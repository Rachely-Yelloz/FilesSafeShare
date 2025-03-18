using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.CORE.Entities
{
    public class ProtectedLink
    {
        [Key]
        public int LinkId { get; set; }
        // קשר לקובץ
        public int FileId { get; set; }
        public FileToUpload File { get; set; }
        // קשר למשתמש
        public int UserId { get; set; }
        public User User { get; set; }
        public DateTime CreationDate { get; set;}
        public string PasswordHash { get; set;}  
        public DateTime? ExpirationDate { get; set;}
        public bool IsOneTimeUse { get; set; }
        public int? DownloadLimit { get; set; }
        public int CurrentDownloadCount { get; set; }
    }
}
