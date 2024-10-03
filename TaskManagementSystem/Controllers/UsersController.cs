using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using TaskManagementSystem.Data;
using TaskManagementSystem.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TaskManagementSystem.Models.dtos;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;


namespace TaskManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public object BCrypt { get; private set; }

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/users/register
        /*[HttpPost("register")]
        public async Task<IActionResult> Register(User user)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    await _context.Users.AddAsync(user);
                    await _context.SaveChangesAsync();
                    return Ok(user);
                }
                return BadRequest(ModelState);
            }
            catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("UNIQUE constraint failed") == true)
            {
                return Conflict(new { message = "Username already exists. Please choose a different username." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }
        */

        // GET: api/users
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDTO userDto)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    // Check if the username already exists
                    var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == userDto.Username);
                    if (existingUser != null)
                    {
                        return Conflict(new { message = "Username already exists. Please choose a different username." });
                    }

                    // Hash the password
                    string hashedPassword = HashPassword(userDto.Password);

                    // Create a new user entity
                    var user = new User
                    {
                        Username = userDto.Username,
                        PasswordHash = hashedPassword,
                        Role = userDto.Role
                    };

                    await _context.Users.AddAsync(user);
                    await _context.SaveChangesAsync();

                    // Generate JWT token
                    var token = GenerateJwtToken(user);

                    return Ok(new { message = "User registered successfully.", token });
                }
                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }

        // Method to generate JWT token
        /*private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("iurehf7843fhironf0439fu3409jfde09jf3409fj4309fj4309fj43f4ie4jf98ufhdjhcf2938"); // Same key as in appsettings.json

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = "YourIssuer",
                Audience = "YourAudience"
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }*/
        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("iurehf7843fhironf0439fu3409jfde09jf3409fj4309fj4309fj43f4ie4jf98ufhdjhcf2938"); // Make sure this matches your secret key

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // Add NameIdentifier claim
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = "YourIssuer",
                Audience = "YourAudience"
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        /*[HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);

            if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash)) {
                return Unauthorized();
            }

            var token = GenerateJwtToken(user);
            return Ok(new { Token = token });
        }*/

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (loginDto == null || string.IsNullOrWhiteSpace(loginDto.Username) || string.IsNullOrWhiteSpace(loginDto.Password))
            {
                return BadRequest("Invalid client request");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);

            if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
            {
                return Unauthorized(); // Respond with 401 Unauthorized if user is null or password is incorrect
            }

            var token = GenerateJwtToken(user);
            return Ok(new { Token = token, Role = user.Role , Username = user.Username }); // Include role in the response

        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes); // Or return a hex string, as per your implementation
            }
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            using (var sha256 = SHA256.Create())
            {
                // Hash the incoming password
                var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                var hash = Convert.ToBase64String(hashBytes);

                // Compare the hashed password with the stored hash
                return hash == storedHash;
            }
        }



    }
}
