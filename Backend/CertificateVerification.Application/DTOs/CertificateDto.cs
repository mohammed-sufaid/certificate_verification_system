namespace CertificateVerification.Application.DTOs;

public class CreateCertificateDto
{
    public string CertificateNumber { get; set; } = string.Empty;
    public string CandidateName { get; set; } = string.Empty;
    public string CourseName { get; set; } = string.Empty;
    public string? Grade { get; set; }
    public DateTime IssueDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public int OrganizationId { get; set; }
}

public class CertificateResponseDto : CreateCertificateDto
{
    public int Id { get; set; }
    public string? FilePath { get; set; }
    public string PreviousHash { get; set; } = string.Empty;
    public string CurrentHash { get; set; } = string.Empty;
    public string? QRCodePath { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public string OrganizationName { get; set; } = string.Empty;
}
