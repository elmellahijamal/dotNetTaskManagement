using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TaskManagementSystem.Data;
using TaskManagementSystem.Models;
using TaskManagementSystem.Models.DTOs;

namespace TaskManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TasksController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/tasks
        [HttpPost]
        public async Task<ActionResult<Models.Task>> CreateTask(Models.Task task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(CreateTask), new { id = task.Id }, task);
        }

        // GET: api/tasks
        /*[HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            var tasks = await _context.Tasks
                .Include(t => t.AssignedUser)
                .Include(t => t.CreatedByUser)
                .ToListAsync();

            return Ok(tasks);
        }*/

        /*[HttpGet]
        [Authorize("Admin")]
        public async Task<IActionResult> GetTasks()
        {
            var currentUser = HttpContext.User;
            var userRole = currentUser.FindFirst(ClaimTypes.Role)?.Value;
            var userId = currentUser.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Debugging output
            Console.WriteLine($"User Role: {userRole}");
            Console.WriteLine($"User ID: {userId}");

            if (userRole == "User")
            {
                if (string.IsNullOrEmpty(userId))
                {
                    return BadRequest("User ID is null or empty.");
                }

                var userTasks = await _context.Tasks
                    .Where(t => t.AssignedTo == int.Parse(userId))
                    .ToListAsync();
                return Ok(userTasks);
            }

            // Admin can see all tasks
            var allTasks = await _context.Tasks.ToListAsync();
            return Ok(allTasks);
        }*/

        /*[HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetTasks()
        {
            var allTasks = await _context.Tasks.ToListAsync();
            return Ok(allTasks);
        }

        //endpoint to get only tasks that are assigned to the user id
        [HttpGet("user-tasks")]
        [Authorize]
        public async Task<IActionResult> GetUserTasks()
        {
            var currentUser = HttpContext.User;
            var userIdClaim = currentUser.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return BadRequest("Invalid user ID.");
            }

            var userTasks = await _context.Tasks
            .Where(t => t.AssignedTo == userId)
            .ToListAsync();

            return Ok(userTasks);
        }*/


        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetTasks()
        {
            var currentUserId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (HttpContext.User.IsInRole("Admin"))
            {
                // Fetch all tasks for Admin
                var allTasks = await _context.Tasks
                    .Include(t => t.AssignedUser)
                    .Include(t => t.CreatedByUser)
                    .Select(task => new TaskAdminDto
                    {
                        Id = task.Id,
                        Title = task.Title,
                        Description = task.Description,
                        AssignedToUsername = task.AssignedUser.Username, // Access the navigation property
                        CreatedByUsername = task.CreatedByUser.Username,
                        Status = task.Status.ToString()
                    })
                    .ToListAsync();
                return Ok(allTasks);
            }
            else
            {
                // Fetch only tasks assigned to the user
                var userTasks = await _context.Tasks
                    .Where(t => t.AssignedTo == int.Parse(currentUserId))
                    .Select(task => new TaskUserDto
                    {
                        Id = task.Id,
                        Title = task.Title,
                        Description = task.Description,
                        Status = task.Status.ToString(),
                        CreatedByUsername = task.CreatedByUser.Username
                    })
                    .ToListAsync();
                return Ok(userTasks);
            }
        }





        [HttpGet("{id}")]
        public async Task<IActionResult> GetTask(int id)
        {
            var task = await _context.Tasks
                .Include(t => t.AssignedUser)
                .Include(t => t.CreatedByUser)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (task == null)
            {
                return NotFound();
            }
            return Ok(task);
        }

        // PUT: api/tasks/{id}
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, Models.Task updatedTask)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingTask = await _context.Tasks.FindAsync(id);
            if (existingTask == null)
            {
                return NotFound();
            }

            // Update only the fields that you want to change
            existingTask.Title = updatedTask.Title;
            existingTask.Description = updatedTask.Description;
            existingTask.AssignedTo = updatedTask.AssignedTo;
            existingTask.Status = updatedTask.Status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        private bool TaskExists(int id)
        {
            return _context.Tasks.Any(e => e.Id == id);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
