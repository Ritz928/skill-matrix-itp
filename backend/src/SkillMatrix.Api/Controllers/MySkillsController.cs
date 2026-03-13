using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillMatrix.Api.Auth;
using SkillMatrix.Application.Employees.Commands;
using SkillMatrix.Application.Employees.Queries;
using SkillMatrix.Domain.Proficiency;

namespace SkillMatrix.Api.Controllers;

[ApiController]
[Route("me/skills")]
[Authorize(Policy = AuthorizationPolicies.PolicyNames.Employee)]
public sealed class MySkillsController(ISender sender) : ControllerBase
{
    [HttpGet]
    public Task<GetMySkillsResponse> GetMySkills(CancellationToken cancellationToken)
    {
        var employeeId = User.GetEmployeeId();
        return sender.Send(new GetMySkillsQuery(employeeId), cancellationToken);
    }

    [HttpPost]
    public async Task<ActionResult<UpsertMySkillResult>> AddSkill([FromBody] AddSkillRequest body, CancellationToken cancellationToken)
    {
        var employeeId = User.GetEmployeeId();
        var result = await sender.Send(
            new UpsertMySkillCommand(employeeId, EmployeeSkillId: null, SkillId: body.SkillId, body.ProficiencyCode),
            cancellationToken);

        return CreatedAtAction(nameof(GetMySkills), new { }, result);
    }

    [HttpPatch("{id:long}")]
    public Task<UpsertMySkillResult> UpdateSkill([FromRoute] long id, [FromBody] UpdateSkillRequest body, CancellationToken cancellationToken)
    {
        var employeeId = User.GetEmployeeId();
        return sender.Send(
            new UpsertMySkillCommand(employeeId, EmployeeSkillId: id, SkillId: null, body.ProficiencyCode),
            cancellationToken);
    }

    public sealed record AddSkillRequest(long SkillId, ProficiencyCode ProficiencyCode);

    public sealed record UpdateSkillRequest(ProficiencyCode ProficiencyCode);
}

