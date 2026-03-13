using MediatR;
using SkillMatrix.Domain.Proficiency;

namespace SkillMatrix.Application.Validation.Commands;

public sealed record SubmitValidationRequestCommand(
    string EmployeeId,
    long EmployeeSkillId,
    ProficiencyCode RequestedProficiencyCode,
    string? Message) : IRequest<SubmitValidationRequestResult>;

public sealed record SubmitValidationRequestResult(long ValidationRequestId);

