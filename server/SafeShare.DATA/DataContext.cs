using Microsoft.EntityFrameworkCore;
using SafeShare.CORE.Entities;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.DATA
{

    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                Debug.WriteLine("DbContext options were not configured properly.");
            }
            optionsBuilder.LogTo(message => Debug.WriteLine(message));
        }

        public DbSet<User> users { get; set; }
        public DbSet<ProtectedLink> protectedLinks { get; set; }
        public DbSet<FileToUpload> filesToUpload { get; set; }
    }
}
