namespace SafeShare.API.Models
{
    public class UserPostModel
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public bool IsAdmin { get; set; }
    }
}
