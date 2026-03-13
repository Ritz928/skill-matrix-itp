using System.Text.Json.Serialization;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.EntityFrameworkCore;
using SkillMatrix.Api.Auth;
using SkillMatrix.Api.Middleware;
using SkillMatrix.Api.Routing;
using SkillMatrix.Application.Audit;
using SkillMatrix.Application.Employees.Events;
using SkillMatrix.Application.Outbox;
using SkillMatrix.Application.Validation.Events;
using SkillMatrix.Infrastructure.Audit;
using SkillMatrix.Infrastructure.Jobs;
using SkillMatrix.Infrastructure.Outbox;
using SkillMatrix.Infrastructure.Persistence;
using SkillMatrix.Infrastructure.Persistence.Migrations;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers(options =>
{
    options.Conventions.Insert(0, new GlobalRoutePrefixConvention(new AttributeRouteModel(new RouteAttribute("api/v1/skill-matrix"))));
}).AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(SkillChangedPublisher).Assembly);
});

builder.Services.AddSkillMatrixAuthorization();

var authority = builder.Configuration["AUTH:JWT:AUTHORITY"];
var audience = builder.Configuration["AUTH:JWT:AUDIENCE"] ?? "itp";

if (builder.Environment.IsDevelopment() && string.IsNullOrWhiteSpace(authority))
{
    builder.Services
        .AddAuthentication(DevHeaderAuthHandler.SchemeName)
        .AddScheme<AuthenticationSchemeOptions, DevHeaderAuthHandler>(DevHeaderAuthHandler.SchemeName, _ => { });
}
else
{
    builder.Services
        .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.Authority = authority;
            options.Audience = audience;
        });
}

var mysqlConnectionString =
    builder.Configuration["SkillMatrix:MySql:ConnectionString"]
    ?? builder.Configuration["SKILLMATRIX:MYSQL:CONNECTIONSTRING"]
    ?? builder.Configuration["ConnectionStrings:SkillMatrix"];

if (string.IsNullOrWhiteSpace(mysqlConnectionString))
{
    throw new InvalidOperationException("Missing MySQL connection string. Set SkillMatrix:MySql:ConnectionString (or SKILLMATRIX__MYSQL__CONNECTIONSTRING).");
}

builder.Services.AddDbContext<SkillMatrixDbContext>(options =>
{
    options.UseMySql(mysqlConnectionString, ServerVersion.AutoDetect(mysqlConnectionString));
});
builder.Services.AddScoped<SkillMatrix.Application.Persistence.ISkillMatrixDbContext>(sp => sp.GetRequiredService<SkillMatrixDbContext>());

builder.Services.AddSingleton<SkillMatrixMigrationRunner>();

builder.Services.AddScoped<IAuditLogger, AuditLogger>();
builder.Services.AddScoped<IOutboxPublisher, OutboxPublisher>();

builder.Services.AddScoped<SkillChangedPublisher>();
builder.Services.AddScoped<ValidationRequestedPublisher>();

builder.Services.AddHostedService<OutboxDispatcher>();
builder.Services.AddHostedService<SkillMatrixJobHooksHostedService>();

var app = builder.Build();

app.UseMiddleware<CorrelationIdMiddleware>();
app.UseMiddleware<ErrorHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

await using (var scope = app.Services.CreateAsyncScope())
{
    var runner = scope.ServiceProvider.GetRequiredService<SkillMatrixMigrationRunner>();
    await runner.ApplyPendingAsync(mysqlConnectionString);
}

app.Run();
