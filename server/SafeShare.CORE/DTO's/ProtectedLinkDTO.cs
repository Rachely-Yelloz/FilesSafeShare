using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.CORE.DTO_s
{
    public class ProtectedLinkDTO
    {
        public int LinkId { get; set; }
        public int FileId { get; set; }
        public int UserId { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public bool IsOneTimeUse { get; set; }
        public int? DownloadLimit { get; set; }
        public int CurrentDownloadCount { get; set; }

    }
}
