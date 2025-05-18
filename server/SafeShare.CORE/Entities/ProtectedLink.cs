using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.CORE.Entities
{
    [Table("protected_link")]  // שם הטבלה במסד הנתונים

    public class ProtectedLink
    {
        [Key]
        [Column("link_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int LinkId { get; set; }
        // קשר לקובץ
        [Column("file_id")]

        public int FileId { get; set; }
        public FileToUpload File { get; set; }
        // קשר למשתמש
        [Column("user_id")]

        public int UserId { get; set; }
        public User User { get; set; }
        [Column("creation_date")]

        public DateTime CreationDate { get; set;}
        [Column("password_hash")]

        public string PasswordHash { get; set;}
        [Column("expiration_date")]

        public DateTime? ExpirationDate { get; set;}
        [Column("is_one_time_use")]

        public bool IsOneTimeUse { get; set; }
        [Column("download_limit")]

        public int? DownloadLimit { get; set; }
        [Column("current_download_count")]

        public int CurrentDownloadCount { get; set; }
    }
}
