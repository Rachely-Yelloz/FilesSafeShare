namespace SafeShare.API.Models
{
    public class ProtectedLinkPutModel
    {
        public int FileId { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public bool IsOneTimeUse { get; set; }
        public int? DownloadLimit { get; set; }
    }
}
