using SafeShare.CORE.Entities;
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
        private readonly IProtectedLinkRepository _protectedLinkRepository;
        public ProtectedLinkService(IProtectedLinkRepository protectedLinkRepository)
        {
            _protectedLinkRepository = protectedLinkRepository;
        }
        public Task<int> DecipherProtectedLinkAsync(string link, string passwordhash)
        {
            return _protectedLinkRepository.DecipherProtectedLinkAsync(link, passwordhash);
        }

        public Task<string> GenerateProtectedLinkAsync(int fileId, string passwordhash, bool isOneTimeUse, int? downloadLimit, int userId)
        {
            return _protectedLinkRepository.GenerateProtectedLinkAsync(fileId, passwordhash, isOneTimeUse, downloadLimit, userId);
        }

        public Task<IEnumerable<ProtectedLink>> GetProtectedLinksByFileIdAsync(int fileId)
        {
            return _protectedLinkRepository.GetProtectedLinksByFileIdAsync(fileId);
        }
    }
}
