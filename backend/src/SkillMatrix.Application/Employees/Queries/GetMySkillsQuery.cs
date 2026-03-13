using MediatR;

namespace SkillMatrix.Application.Employees.Queries;

public sealed record GetMySkillsQuery(string EmployeeId) : IRequest<GetMySkillsResponse>;

public sealed record GetMySkillsResponse(string EmployeeId, IReadOnlyList<MySkillDto> Skills);

public sealed record MySkillDto(
    string EmployeeSkillId,
    SkillSummaryDto Skill,
    ProficiencyDto ActiveProficiency,
    string ValidationStatus,
    DateTime? LastValidatedAtUtc,
    DateTime? ValidationExpiresAtUtc);

public sealed record SkillSummaryDto(
    string Id,
    string Name,
    string Definition,
    string CategoryName,
    string SubcategoryName);

public sealed record ProficiencyDto(string Code, string DisplayName);

