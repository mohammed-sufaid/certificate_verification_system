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
public class UserController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public UserController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .Include(u => u.Role)
            .Include(u => u.Organization)
            .OrderByDescending(u => u.CreatedDate)
            .Select(u => new UserResponseDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                RoleId = u.RoleId,
                RoleName = u.Role.RoleName,
                OrganizationId = u.OrganizationId,
                OrganizationName = u.Organization != null ? u.Organization.Name : null,
                IsActive = u.IsActive
            })
            .ToListAsync();
            
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var u = await _context.Users
            .Include(x => x.Role)
            .Include(x => x.Organization)
            .FirstOrDefaultAsync(x => x.Id == id);
            
        if (u == null) return NotFound();
        return Ok(new UserResponseDto
        {
            Id = u.Id,
            FullName = u.FullName,
            Email = u.Email,
            RoleId = u.RoleId,
            RoleName = u.Role.RoleName,
            OrganizationId = u.OrganizationId,
            OrganizationName = u.Organization?.Name,
            IsActive = u.IsActive
        });
    }

    // Note: User Creation is handled by AuthController.Register

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto request)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        // Check email conflict
        if (await _context.Users.AnyAsync(u => u.Email == request.Email && u.Id != id))
            return BadRequest("Email is already in use by another account.");

        user.FullName = request.FullName;
        user.Email = request.Email;
        user.RoleId = request.RoleId;
        user.OrganizationId = request.OrganizationId;
        user.IsActive = request.IsActive;

        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        }

        await _context.SaveChangesAsync(new CancellationToken());
        return Ok(new { Message = "User updated successfully." });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        // Prevent deleting yourself
        var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (currentUserId == id) return BadRequest("You cannot delete your own account.");

        // Check if tied to certificates 
        if (await _context.Certificates.AnyAsync(c => c.CreatedBy == id))
        {
            return BadRequest("Cannot delete user as they have issued certificates. Consider disabling instead.");
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync(new CancellationToken());
        return Ok(new { Message = "User deleted successfully." });
    }
}
