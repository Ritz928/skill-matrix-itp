using System.Text.Json;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillMatrix.Api.Auth;
using SkillMatrix.Application.Evidence.Commands;
using SkillMatrix.Domain.Evidence;

namespace SkillMatrix.Api.Controllers;

[ApiController]
[Route("me/skills/{employeeSkillId:long}/evidence")]
[Authorize(Policy = AuthorizationPolicies.PolicyNames.Employee)]
public sealed class EvidenceController(ISender sender) : ControllerBase
{
    [HttpPost]
    public Task<AddEvidenceResult> AddEvidence([FromRoute] long employeeSkillId, [FromBody] AddEvidenceRequest body, CancellationToken cancellationToken)
    {
        var employeeId = User.GetEmployeeId();
        var metadataJson = body.Metadata is null ? null : JsonSerializer.Serialize(body.Metadata.Value, new JsonSerializerOptions(JsonSerializerDefaults.Web));

        return sender.Send(
            new AddEvidenceCommand(employeeId, employeeSkillId, body.Type, body.ExternalRef, body.FileRef, metadataJson),
            cancellationToken);
    }

    public sealed record AddEvidenceRequest(
        EvidenceType Type,
        string? ExternalRef,
        string? FileRef,
        JsonElement? Metadata);
}

