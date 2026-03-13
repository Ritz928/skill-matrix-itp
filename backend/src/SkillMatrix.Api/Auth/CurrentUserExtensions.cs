using System.Security.Claims;

namespace SkillMatrix.Api.Auth;

public static class CurrentUserExtensions
{
    public static string GetEmployeeId(this ClaimsPrincipal user)
    {
        var id = user.FindFirstValue("employee_id") ?? user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(id))
        {
            throw new InvalidOperationException("Missing employee id claim.");
        }

        return id;
    }
}

