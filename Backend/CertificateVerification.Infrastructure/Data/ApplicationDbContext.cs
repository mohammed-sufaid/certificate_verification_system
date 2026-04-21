using CertificateVerification.Application.Interfaces;
using CertificateVerification.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CertificateVerification.Infrastructure.Data;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Organization> Organizations => Set<Organization>();
    public DbSet<Certificate> Certificates => Set<Certificate>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Certificate>()
            .HasIndex(c => c.CertificateNumber)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
    }
}
