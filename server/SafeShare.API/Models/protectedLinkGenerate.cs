using Microsoft.AspNetCore.Mvc;

namespace SafeShare.API.Models
{
    public class protectedLinkGenerate
    {
        public int fileId { get; set; }
        public string password { get; set; }
        public bool isOneTimeUse { get; set; }
        public int? downloadLimit { get; set; }
        public DateTime? expirationDate { get; set; }
    }
}
