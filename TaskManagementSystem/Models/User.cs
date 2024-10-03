using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TaskManagementSystem.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Username { get; set; }
        [Required]
        public string PasswordHash { get; set; }
        [Required]
        [RegularExpression("User|Admin", ErrorMessage = "Role must be either 'User' or 'Admin'.")]
        public string Role { get; set; } // "Admin" or "User"

        // Navigation property for tasks
        [JsonIgnore]
        public ICollection<Models.Task>? Tasks { get; set; } = new List<Models.Task>();
    }
}
