namespace CertificateVerification.Domain.Entities;

public class AuditLog
{
    public int Id { get; set; }
    public string Action { get; set; } = string.Empty;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public string TableName { get; set; } = string.Empty;
    public int RecordId { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}
