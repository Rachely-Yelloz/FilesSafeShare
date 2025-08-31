using SafeShare.CORE.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.CORE.Services
{
    public interface IlogService
    {
        public  Task LogAsync(LogMessage log);
        public  Task<IEnumerable<LogMessage>> GetAllLogsAsync();

    }
}
