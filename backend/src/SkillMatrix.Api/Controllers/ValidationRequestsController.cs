using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillMatrix.Api.Auth;
using SkillMatrix.Application.Validation.Commands;
using SkillMatrix.Domain.Proficiency;

namespace SkillMatrix.Api.Controllers;

[ApiController]
[Route("me/skills/{employeeSkillId:long}/validation-requests")]
[Authorize(Policy = AuthorizationPolicies.PolicyNames.Employee)]
public sealed class ValidationRequestsController(ISender sender) : ControllerBase
{
    [HttpPost]
    public Task<SubmitValidationRequestResult> Submit(
        [FromRoute] long employeeSkillId,
        [FromBody] SubmitValidationRequestRequest body,
        CancellationToken cancellationToken)
    {
        var employeeId = User.GetEmployeeId();
        return sender.Send(
            new SubmitValidationRequestCommand(employeeId, employeeSkillId, body.RequestedProficiencyCode, body.Message),
            cancellationToken);
    }

    public sealed record SubmitValidationRequestRequest(ProficiencyCode RequestedProficiencyCode, string? Message);
}

