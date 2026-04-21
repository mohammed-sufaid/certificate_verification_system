namespace CertificateVerification.Application.DTOs;

public class CreateOrganizationDto
{
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? LogoPath { get; set; }
}

public class UpdateOrganizationDto
{
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? LogoPath { get; set; }
    public bool IsActive { get; set; }
}

public class OrganizationResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? LogoPath { get; set; }
    public bool IsActive { get; set; }
}
