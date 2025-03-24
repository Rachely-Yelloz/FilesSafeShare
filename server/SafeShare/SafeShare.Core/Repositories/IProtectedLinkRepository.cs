using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.CORE.Repositories
{
    public interface IProtectedLinkRepository
    {
        Task<string> GenerateProtectedLinkAsync(int fileId, string passwordhash, bool isOneTimeUse, int? downloadLimit, int userId);
        Task<int> DecipherProtectedLinkAsync(string link, string passwordhash);
    }
}
