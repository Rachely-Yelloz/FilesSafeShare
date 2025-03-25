using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.CORE.Entities
{
    [Table("files")]  // שם הטבלה במסד הנתונים

    public class FileToUpload
    {
        [Key]
        [Column("file_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int FileId { get; set; }
        [Column("user_id")]

        public int UserId { get; set; }
        public User User { get; set; }
        [Column("file_name")]

        public string FileName { get; set; }
        [Column("upload_date")]

        public DateTime UploadDate { get; set; }
        [Column("download_count")]

        public int DownloadCount { get; set; }
        [Column("file_type")]

        public string FileType { get; set; }
        [Column("storage_path")]

        public string StoragePath { get; set; }
        public ICollection<ProtectedLink> ProtectedLinks { get; set; } = new List<ProtectedLink>();


    }
}
