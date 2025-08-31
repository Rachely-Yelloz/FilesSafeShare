using SafeShare.CORE.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.CORE.Repositories
{
    public interface ILogRepository
    {
        
            Task AddLogAsync(LogMessage log);
            Task<IEnumerable<LogMessage>> GetAllLogsAsync();
        
    }
}
