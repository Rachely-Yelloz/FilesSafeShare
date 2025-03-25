using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SafeShare.API.Models;
using SafeShare.CORE.Entities;
using SafeShare.CORE.Services;
using SafeShare.DATA;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace SafeShare.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DataContext _dataContext;

        public AuthController(IConfiguration configuration, DataContext dataContext)
        {
            _configuration = configuration;
            _dataContext = dataContext;
        }


        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginModel loginModel)
        {
            var user = await _dataContext.users.FirstOrDefaultAsync(u => u.Email == loginModel.Email && u.PasswordHash == loginModel.PasswordHash);
            if (user is not null)
            {
                var jwt = CreateJWT(user);
                return Ok(jwt);
            }
            return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel registerModel)
        {

            var newUser = new User { Username = registerModel.Username, Email = registerModel.Email, PasswordHash = registerModel.PasswordHash, IsAdmin = false};
            var existingUser = await _dataContext.users
                .FirstOrDefaultAsync(u => u.Email == newUser.Email);
            if (existingUser != null)
                return Conflict(new { message = "User already exists." });


            _dataContext.users.Add(newUser);
            await _dataContext.SaveChangesAsync();

            var jwt = CreateJWT(newUser);
            return Ok(jwt);
        }

        private object CreateJWT(User user)
        {
            var claims = new List<Claim>()
                {
                    new Claim("id", user.UserId.ToString()),
                    new Claim("name", user.Username),
                    new Claim("email", user.Email),
                    new Claim("isAdmin", user.IsAdmin.ToString())
                };

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetValue<string>("JWT:Key")));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokeOptions = new JwtSecurityToken(
                issuer: _configuration.GetValue<string>("JWT:Issuer"),
                audience: _configuration.GetValue<string>("JWT:Audience"),
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: signinCredentials
            );
            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
            return new { Token = tokenString };
        }


    }
}



