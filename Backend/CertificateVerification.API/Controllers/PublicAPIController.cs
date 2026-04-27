using CertificateVerification.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CertificateVerification.API.Controllers;

[Route("api/public")]
[ApiController]
public class PublicAPIController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public PublicAPIController(IApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Programmatic verification endpoint for third-party systems.
    /// </summary>
    [HttpGet("verify/{certificateNumber}")]
    public async Task<IActionResult> VerifyProgrammatically(string certificateNumber)
    {
        var certificate = await _context.Certificates
            .Include(c => c.Organization)
            .FirstOrDefaultAsync(c => c.CertificateNumber == certificateNumber);

        if (certificate == null)
        {
            return NotFound(new { status = "invalid", reason = "not_found" });
        }

        return Ok(new 
        { 
            status = certificate.Status == "Active" ? "valid" : "revoked",
            verification_id = certificate.CurrentHash,
            issued_to = certificate.CandidateName,
            issued_by = certificate.Organization.Name,
            issue_date = certificate.IssueDate,
            blockchain_proof = certificate.BlockchainTxHash != null ? $"https://polygonscan.com/tx/{certificate.BlockchainTxHash}" : null,
            ipfs_cid = certificate.IpfsCid,
            signature_verified = !string.IsNullOrEmpty(certificate.DigitalSignature)
        });
    }
}
