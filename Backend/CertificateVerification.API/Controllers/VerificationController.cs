using CertificateVerification.Application.Helpers;
using CertificateVerification.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CertificateVerification.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VerificationController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public VerificationController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("{certificateNumber}")]
    public async Task<IActionResult> Verify(string certificateNumber)
    {
        var certificate = await _context.Certificates
            .Include(c => c.Organization)
            .FirstOrDefaultAsync(c => c.CertificateNumber == certificateNumber);

        if (certificate == null)
        {
            return NotFound(new { Authentic = false, Message = "Certificate not found." });
        }

        if (certificate.Status == "Revoked")
        {
            return BadRequest(new { Authentic = false, Message = "Certificate has been revoked." });
        }

        // Recalculate Hash to verify integrity
        string expectedHash = BlockchainHashHelper.GenerateHash(
            certificate.CertificateNumber,
            certificate.CandidateName,
            certificate.CourseName,
            certificate.IssueDate,
            certificate.PreviousHash);

        if (expectedHash != certificate.CurrentHash)
        {
            return BadRequest(new { Authentic = false, Message = "Certificate integrity compromised! Tampering detected." });
        }

        return Ok(new 
        { 
            Authentic = true, 
            Message = "Certificate is valid and untampered.",
            Data = new
            {
                certificate.CertificateNumber,
                certificate.CandidateName,
                certificate.CourseName,
                certificate.Grade,
                certificate.IssueDate,
                certificate.ExpiryDate,
                OrganizationName = certificate.Organization.Name,
                OrganizationLogo = certificate.Organization.LogoPath
            }
        });
    }
}
