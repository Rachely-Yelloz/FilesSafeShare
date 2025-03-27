using Microsoft.EntityFrameworkCore;
using SafeShare.CORE.Entities;
using SafeShare.CORE.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.DATA.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _dataContext;
        public UserRepository(DataContext dataContext)
        {
            _dataContext = dataContext;

        }
        public async Task<bool> DeleteUserAsync(int userId)
        {
            var user = await _dataContext.users.FindAsync(userId);
            if (user == null)
            {
                return false;
            }
            _dataContext.users.Remove(user);
            await _dataContext.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _dataContext.users.ToListAsync();
        }

        public async Task<User?> GetUserByIdAsync(int v, int userId)
        {
            return await _dataContext.users.FindAsync(userId);
        }

        public async Task<User?> GetUserByIdAsync(int userId)
        {
            return await _dataContext.users
                .FirstOrDefaultAsync(user => user.UserId == userId);  // השוואה בין userId של המשתמש לעומת המשתנה שנשלח
        }


   

        public async Task<User?> UpdateUserAsync(int userId, User user)
        {
            var existingUser = await _dataContext.users.FindAsync(userId);
            if (existingUser == null) return null;

            // Update user details
            existingUser.Email = user.Email;
            existingUser.PasswordHash = user.PasswordHash;
            existingUser.IsAdmin = user.IsAdmin;
            existingUser.Username = user.Username;

            _dataContext.users.Update(existingUser);
            await _dataContext.SaveChangesAsync();

            return existingUser;
        }
    }
}
