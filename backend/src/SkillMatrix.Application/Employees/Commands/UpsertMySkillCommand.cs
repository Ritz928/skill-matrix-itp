using MediatR;
using SkillMatrix.Domain.Proficiency;

namespace SkillMatrix.Application.Employees.Commands;

public sealed record UpsertMySkillCommand(
    string EmployeeId,
    long? EmployeeSkillId,
    long? SkillId,
    ProficiencyCode ProficiencyCode) : IRequest<UpsertMySkillResult>;

public sealed record UpsertMySkillResult(long EmployeeSkillId);

