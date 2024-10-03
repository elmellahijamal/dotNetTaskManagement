using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TaskManagementSystem.Models
{
    public class Task
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int AssignedTo { get; set; }  // Foreign Key to User
        public int CreatedBy { get; set; }   // Foreign Key to User

        // Navigation properties made optional
        [JsonIgnore]
        public User? AssignedUser { get; set; }
        [JsonIgnore]
        public User? CreatedByUser { get; set; }

        [Required]
        [EnumDataType(typeof(TaskStatus))]
        public TaskStatus Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public enum TaskStatus
    {
        Pending = 0,
        OnProgress = 1,
        Completed = 2
    }
}
