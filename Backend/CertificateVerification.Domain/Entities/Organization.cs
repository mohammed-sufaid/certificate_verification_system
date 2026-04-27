namespace CertificateVerification.Domain.Entities;

public class Organization
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? LogoPath { get; set; }
    public string? PublicKey { get; set; }
    public string? PrivateKeyEncrypted { get; set; }
    public bool IsActive { get; set; } = true;
}
