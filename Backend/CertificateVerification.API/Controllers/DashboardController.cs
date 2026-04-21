using CertificateVerification.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CertificateVerification.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin,Organization")]
public class DashboardController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public DashboardController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var totalCertificates = await _context.Certificates.CountAsync();
        var activeCertificates = await _context.Certificates.CountAsync(c => c.Status == "Active");
        var revokedCertificates = await _context.Certificates.CountAsync(c => c.Status == "Revoked");
        var totalOrganizations = await _context.Organizations.CountAsync();

        var recentActivities = await _context.AuditLogs
            .Include(a => a.User)
            .OrderByDescending(a => a.CreatedDate)
            .Take(5)
            .Select(a => new { a.Action, User = a.User.FullName, a.CreatedDate })
            .ToListAsync();

        return Ok(new
        {
            TotalCertificates = totalCertificates,
            ActiveCertificates = activeCertificates,
            RevokedCertificates = revokedCertificates,
            TotalOrganizations = totalOrganizations,
            RecentActivities = recentActivities
        });
    }
}
