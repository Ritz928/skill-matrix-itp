using Microsoft.AspNetCore.Authorization;

namespace SkillMatrix.Api.Auth;

public static class AuthorizationPolicies
{
    public static class Roles
    {
        public const string Employee = "Employee";
        public const string Manager = "Manager";
        public const string Admin = "Admin";
        public const string Leadership = "Leadership";
    }

    public static class PolicyNames
    {
        public const string Employee = "SkillMatrix.Employee";
        public const string Manager = "SkillMatrix.Manager";
        public const string Admin = "SkillMatrix.Admin";
        public const string Leadership = "SkillMatrix.Leadership";
    }

    public static IServiceCollection AddSkillMatrixAuthorization(this IServiceCollection services)
    {
        services.AddAuthorization(options =>
        {
            options.AddPolicy(PolicyNames.Employee, p => p.RequireRole(Roles.Employee, Roles.Manager, Roles.Admin));
            options.AddPolicy(PolicyNames.Manager, p => p.RequireRole(Roles.Manager, Roles.Admin));
            options.AddPolicy(PolicyNames.Admin, p => p.RequireRole(Roles.Admin));
            options.AddPolicy(PolicyNames.Leadership, p => p.RequireRole(Roles.Leadership, Roles.Admin));
        });

        return services;
    }
}

