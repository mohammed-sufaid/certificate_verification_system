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
    private readonly IPkiService _pkiService;

    public VerificationController(IApplicationDbContext context, IPkiService pkiService)
    {
        _context = context;
        _pkiService = pkiService;
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

        // Verify Digital Signature
        bool isSignatureValid = false;
        if (!string.IsNullOrEmpty(certificate.DigitalSignature) && !string.IsNullOrEmpty(certificate.Organization.PublicKey))
        {
            isSignatureValid = _pkiService.VerifySignature(certificate.CurrentHash, certificate.DigitalSignature, certificate.Organization.PublicKey);
        }

        return Ok(new 
        { 
            Authentic = true, 
            Message = "Certificate is valid and untampered.",
            SecurityProofs = new
            {
                InternalHashVerified = true,
                DigitalSignatureVerified = isSignatureValid,
                IpfsStorage = certificate.IpfsCid != null ? $"ipfs://{certificate.IpfsCid}" : "N/A",
                BlockchainAnchor = certificate.BlockchainTxHash != null ? $"https://polygonscan.com/tx/{certificate.BlockchainTxHash}" : "Pending",
                BlockchainStatus = certificate.BlockchainStatus
            },
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
