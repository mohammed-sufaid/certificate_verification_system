using CertificateVerification.Application.DTOs;
using CertificateVerification.Application.Helpers;
using CertificateVerification.Application.Interfaces;
using CertificateVerification.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CertificateVerification.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class CertificateController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public CertificateController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Organization")]
    public async Task<IActionResult> CreateCertificate([FromBody] CreateCertificateDto request)
    {
        if (await _context.Certificates.AnyAsync(c => c.CertificateNumber == request.CertificateNumber))
        {
            return BadRequest("Certificate number already exists.");
        }

        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // Get Previous Hash
        var lastCertificate = await _context.Certificates
            .OrderByDescending(c => c.CreatedDate)
            .FirstOrDefaultAsync();

        string previousHash = lastCertificate?.CurrentHash ?? "GENESIS";
        string currentHash = BlockchainHashHelper.GenerateHash(
            request.CertificateNumber,
            request.CandidateName,
            request.CourseName,
            request.IssueDate,
            previousHash);

        var certificate = new Certificate
        {
            CertificateNumber = request.CertificateNumber,
            CandidateName = request.CandidateName,
            CourseName = request.CourseName,
            Grade = request.Grade,
            IssueDate = request.IssueDate,
            ExpiryDate = request.ExpiryDate,
            OrganizationId = request.OrganizationId,
            PreviousHash = previousHash,
            CurrentHash = currentHash,
            CreatedBy = userId
        };

        _context.Certificates.Add(certificate);
        
        // Audit
        _context.AuditLogs.Add(new AuditLog
        {
            Action = "Create Certificate",
            UserId = userId,
            TableName = "Certificates",
            RecordId = 0 // Will map properly in real system or post-save
        });

        await _context.SaveChangesAsync(new CancellationToken());

        return Ok(certificate);
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Organization")]
    public async Task<IActionResult> GetCertificates([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var role = User.FindFirstValue(ClaimTypes.Role);
        var orgIdClaim = User.FindFirstValue("OrganizationId");

        var query = _context.Certificates.Include(c => c.Organization).AsQueryable();

        if (role == "Organization" && int.TryParse(orgIdClaim, out int orgId))
        {
            query = query.Where(c => c.OrganizationId == orgId);
        }

        var total = await query.CountAsync();
        var certs = await query
            .OrderByDescending(c => c.CreatedDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new CertificateResponseDto
            {
                Id = c.Id,
                CertificateNumber = c.CertificateNumber,
                CandidateName = c.CandidateName,
                CourseName = c.CourseName,
                IssueDate = c.IssueDate,
                ExpiryDate = c.ExpiryDate,
                OrganizationId = c.OrganizationId,
                OrganizationName = c.Organization.Name,
                CurrentHash = c.CurrentHash,
                Status = c.Status
            })
            .ToListAsync();

        return Ok(new { Total = total, Data = certs });
    }

    [HttpPut("{id}/revoke")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RevokeCertificate(int id)
    {
        var cert = await _context.Certificates.FindAsync(id);
        if (cert == null) return NotFound();

        cert.Status = "Revoked";
        
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        _context.AuditLogs.Add(new AuditLog
        {
            Action = "Revoke Certificate",
            UserId = userId,
            TableName = "Certificates",
            RecordId = cert.Id
        });

        await _context.SaveChangesAsync(new CancellationToken());
        return Ok(new { Message = "Certificate revoked." });
    }
}
