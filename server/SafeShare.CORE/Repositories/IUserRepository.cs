using SafeShare.CORE.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.CORE.Repositories
{
    public interface IUserRepository
    {
        Task<bool> DeleteUserAsync(int userId);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(int v, int userId);
        Task<User?> GetUserByIdAsync(int userId);

        Task<User?> UpdateUserAsync(int userId, User user);
    }
}
