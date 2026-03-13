using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace SkillMatrix.Api.Auth;

public sealed class DevHeaderAuthHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder) : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    public const string SchemeName = "DevHeader";

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var employeeId = Request.Headers["X-Employee-Id"].FirstOrDefault();
        if (string.IsNullOrWhiteSpace(employeeId))
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }

        var roles = (Request.Headers["X-Roles"].FirstOrDefault() ?? AuthorizationPolicies.Roles.Employee)
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, employeeId),
            new("employee_id", employeeId),
        };

        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

        var identity = new ClaimsIdentity(claims, SchemeName);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, SchemeName);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}

