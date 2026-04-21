using CertificateVerification.Application.DTOs;
using CertificateVerification.Application.Interfaces;
using CertificateVerification.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CertificateVerification.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")]
public class OrganizationController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public OrganizationController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetOrganizations()
    {
        var orgs = await _context.Organizations
            .Select(o => new OrganizationResponseDto
            {
                Id = o.Id,
                Name = o.Name,
                Address = o.Address,
                Email = o.Email,
                Phone = o.Phone,
                LogoPath = o.LogoPath,
                IsActive = o.IsActive
            })
            .ToListAsync();
        return Ok(orgs);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrganization(int id)
    {
        var o = await _context.Organizations.FindAsync(id);
        if (o == null) return NotFound();
        return Ok(new OrganizationResponseDto 
        { 
            Id = o.Id, 
            Name = o.Name, 
            Address = o.Address,
            Email = o.Email,
            Phone = o.Phone,
            LogoPath = o.LogoPath,
            IsActive = o.IsActive
        });
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrganization([FromBody] CreateOrganizationDto request)
    {
        if (await _context.Organizations.AnyAsync(o => o.Name == request.Name))
            return BadRequest("Organization name already exists.");

        var org = new Organization
        {
            Name = request.Name,
            Address = request.Address,
            Email = request.Email,
            Phone = request.Phone,
            LogoPath = request.LogoPath,
            IsActive = true
        };
        _context.Organizations.Add(org);
        await _context.SaveChangesAsync(new CancellationToken());

        return Ok(new OrganizationResponseDto 
        { 
            Id = org.Id, 
            Name = org.Name, 
            Address = org.Address,
            Email = org.Email,
            Phone = org.Phone,
            LogoPath = org.LogoPath,
            IsActive = org.IsActive
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateOrganization(int id, [FromBody] UpdateOrganizationDto request)
    {
        var org = await _context.Organizations.FindAsync(id);
        if (org == null) return NotFound();

        if (await _context.Organizations.AnyAsync(o => o.Name == request.Name && o.Id != id))
            return BadRequest("Organization name already exists.");

        org.Name = request.Name;
        org.Address = request.Address;
        org.Email = request.Email;
        org.Phone = request.Phone;
        org.LogoPath = request.LogoPath;
        org.IsActive = request.IsActive;

        await _context.SaveChangesAsync(new CancellationToken());
        return Ok(new OrganizationResponseDto 
        { 
            Id = org.Id, 
            Name = org.Name, 
            Address = org.Address,
            Email = org.Email,
            Phone = org.Phone,
            LogoPath = org.LogoPath,
            IsActive = org.IsActive
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrganization(int id)
    {
        var org = await _context.Organizations.FindAsync(id);
        if (org == null) return NotFound();

        // Check if tied to certificates or users
        if (await _context.Certificates.AnyAsync(c => c.OrganizationId == id) ||
            await _context.Users.AnyAsync(u => u.OrganizationId == id))
        {
            return BadRequest("Cannot delete organization because it has associated certificates or users.");
        }

        _context.Organizations.Remove(org);
        await _context.SaveChangesAsync(new CancellationToken());
        return Ok(new { Message = "Organization deleted successfully." });
    }
}
