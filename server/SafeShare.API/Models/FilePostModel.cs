namespace SafeShare.API.Models
{
    public class FilePostModel
    {
        public string FileName { get; set; }
        public string StoragePath { get; set; }

        // קליטה כ-Base64 (כדי למנוע בעיות המרה)
        public string EncryptionKey { get; set; }
        public string Nonce { get; set; }
        public string FileType { get; set; }
        // המרת Base64 ל-byte[]
        public byte[] GetEncryptionKey() => Convert.FromBase64String(EncryptionKey);
        public byte[] GetNonce() => Convert.FromBase64String(Nonce);

    }
}
