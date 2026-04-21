using CertificateVerification.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CertificateVerification.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Role> Roles { get; }
    DbSet<Organization> Organizations { get; }
    DbSet<Certificate> Certificates { get; }
    DbSet<AuditLog> AuditLogs { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
