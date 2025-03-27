using SafeShare.CORE.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.CORE.Services
{
    public interface IProtectedLinkService
    {
        Task<string> GenerateProtectedLinkAsync(int fileId, string passwordhash, bool isOneTimeUse, int? downloadLimit, int userId);
        Task<int> DecipherProtectedLinkAsync(string link, string passwordhash);
        Task<IEnumerable<ProtectedLink>> GetProtectedLinksByFileIdAsync(int fileId);
    }
}
