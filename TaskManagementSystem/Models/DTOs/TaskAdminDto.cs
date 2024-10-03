namespace TaskManagementSystem.Models.DTOs
{
    public class TaskAdminDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string AssignedToUsername { get; set; }
        public string CreatedByUsername { get; set; }
        public string Status { get; set; }
        public int AssignedTo { get; set; }  // Add AssignedTo
        public int CreatedBy { get; set; }   // Add CreatedBy
        public DateTime CreatedAt { get; set; } // Add CreatedAt
    }
}
