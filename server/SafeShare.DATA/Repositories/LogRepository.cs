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
    public class LogRepository : ILogRepository
    {
        private readonly DataContext _dataContext;
        public LogRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        public async Task AddLogAsync(LogMessage log)
        {
            await _dataContext.logs.AddAsync(log);
            await _dataContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<LogMessage>> GetAllLogsAsync()
        {
            return await _dataContext.logs.ToListAsync();
        }
    }
}
