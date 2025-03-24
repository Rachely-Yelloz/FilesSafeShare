using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SafeShare.CORE.Entities
{
    [Table("users")]  // שם הטבלה במסד הנתונים

    public class User
    {
        [Key]
        [Column("user_id")]  // כאן אנחנו מציינים את השם בטבלה
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int UserId { get; set; }
        [Column("username")]

        public string Username { get; set; }
        [Column("email")]

        public string Email { get; set; }
        [Column("password_hash")]

        public string PasswordHash { get; set; }
        [Column("is_admin")]

        public bool IsAdmin { get; set; }
        [JsonIgnore]

        public ICollection<FileToUpload> Files { get; set; } = new List<FileToUpload>();
        [JsonIgnore]

        public ICollection<ProtectedLink> ProtectedLinks { get; set; } = new List<ProtectedLink>();

    }
}
