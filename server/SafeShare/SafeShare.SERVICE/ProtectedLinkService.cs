using SafeShare.CORE.Repositories;
using SafeShare.CORE.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.SERVICE
{
    public class ProtectedLinkService : IProtectedLinkService
    {
        private readonly IProtectedLinkService _protectedLinkService;
        public ProtectedLinkService(IProtectedLinkService protectedLinkService)
        {
            _protectedLinkService = protectedLinkService;
        }
        public Task<int> DecipherProtectedLinkAsync(string link, string passwordhash)
        {
            return _protectedLinkService.DecipherProtectedLinkAsync(link, passwordhash);
        }

        public Task<string> GenerateProtectedLinkAsync(int fileId, string passwordhash, bool isOneTimeUse, int? downloadLimit)
        {
            return _protectedLinkService.GenerateProtectedLinkAsync(fileId, passwordhash, isOneTimeUse, downloadLimit);
        }
    }
}
