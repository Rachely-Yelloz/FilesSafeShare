using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.CORE.DTO_s
{
    public class FileDTO
    {
        public int FileId { get; set; }
        public int UserId { get; set; }
        public string FileName { get; set; }
        public int DownloadCount { get; set; }

    }
}
