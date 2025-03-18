using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.CORE.Entities
{
   public class FileToUpload
    {
        [Key]
        public int FileId { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public string FileName { get; set; }
        public DateTime UploadDate { get; set; }
        public int DownloadCount { get; set; }
        public string FileType { get; set; }
        public string StoragePath { get; set; }


    }
}
