namespace SafeShare.API.Models
{
    public class FilePostModel
    {
        public string FileName { get; set; }
        public string StoragePath { get; set; }
        public byte[] EncryptionKey { get; set; }  // מפתח ההצפנה (בינארי)
        public byte[] Nonce { get; set; }  // nonce (בינארי)

    }
}
