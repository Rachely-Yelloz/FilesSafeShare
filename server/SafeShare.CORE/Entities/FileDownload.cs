using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.CORE.Entities
{
    public class FileDownload
    {
        public string pathInS3 { get; set; }  // הנתונים הבינאריים של הקובץ
        public string FileName { get; set; }  // שם הקובץ
        public string FileType { get; set; }  // פורמט הקובץ (MIME Type)
    }
}
