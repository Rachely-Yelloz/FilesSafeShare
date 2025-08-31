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
    public class LogService : IlogService
    {
        private readonly ILogRepository _logRepository;
        public Task LogAsync(LogMessage log)
        {
            return _logRepository.AddLogAsync(log);
        }
        public Task<IEnumerable<LogMessage>> GetAllLogsAsync()
        {
            return _logRepository.GetAllLogsAsync();
        }
    }
}
