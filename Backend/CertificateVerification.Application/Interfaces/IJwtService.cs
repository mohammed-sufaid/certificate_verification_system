using CertificateVerification.Domain.Entities;

namespace CertificateVerification.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user, string roleName);
}
