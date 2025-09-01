using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.CORE.Entities
{
    [Table("logs")]  // שם הטבלה במסד הנתונים

    public class LogMessage
    {
            
        [Key]
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? Id { get; set; }
        [Column("user_id")]

        public int UserId { get; set; }
        [Column("created_at")]

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [Column("action")]

        public string Action { get; set; } = string.Empty;
        [Column("user_name")]

        public string UserName { get; set; } = string.Empty;
        [Column("is_succes")]

        public bool IsSuccess { get; set; }
        [Column("error_message")]

        public string? ErrorMessage { get; set; }
    }
}
