using MediatR;
using SkillMatrix.Domain.Evidence;

namespace SkillMatrix.Application.Evidence.Commands;

public sealed record AddEvidenceCommand(
    string EmployeeId,
    long EmployeeSkillId,
    EvidenceType Type,
    string? ExternalRef,
    string? FileRef,
    string? MetadataJson) : IRequest<AddEvidenceResult>;

public sealed record AddEvidenceResult(long EvidenceItemId);

