using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.CORE.Entities
{
    public class LogMessage
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string Action { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;

        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
