namespace CertificateVerification.Domain.Entities;

public class Certificate
{
    public int Id { get; set; }
    public string CertificateNumber { get; set; } = string.Empty;
    public string CandidateName { get; set; } = string.Empty;
    public string CourseName { get; set; } = string.Empty;
    public string? Grade { get; set; }
    public DateTime IssueDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public int OrganizationId { get; set; }
    public Organization Organization { get; set; } = null!;
    public string? FilePath { get; set; }
    public string PreviousHash { get; set; } = string.Empty;
    public string CurrentHash { get; set; } = string.Empty;
    public string? QRCodePath { get; set; }
    public string Status { get; set; } = "Active"; // Active / Revoked
    public string? IpfsCid { get; set; }
    public string? DigitalSignature { get; set; }
    public string? BlockchainTxHash { get; set; }
    public string? BlockchainStatus { get; set; } = "Pending";
    public int CreatedBy { get; set; }
    
    [System.ComponentModel.DataAnnotations.Schema.ForeignKey("CreatedBy")]
    public User Creator { get; set; } = null!;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}
