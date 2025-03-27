using SafeShare.CORE.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.CORE.Services
{
    public interface IUserService
    {
        
        // פונקציה לעדכון משתמש
        Task<User?> UpdateUserAsync(int userId, User user);

        // פונקציה לקבלת כל המשתמשים
        Task<IEnumerable<User>> GetAllUsersAsync();

        // פונקציה לקבלת משתמש לפי ID
        Task<User?> GetUserByIdAsync(int userId);

        // פונקציה למחיקת משתמש
        Task<bool> DeleteUserAsync(int userId);
    }
}
