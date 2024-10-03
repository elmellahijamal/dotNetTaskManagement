namespace TaskManagementSystem.Models.DTOs
{
    public class TaskUserDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string CreatedByUsername { get; set; }

    }
}
