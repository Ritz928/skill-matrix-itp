using SkillMatrix.Domain.Proficiency;
using SkillMatrix.Domain.Validation;

namespace SkillMatrix.Application.Events;

public static class SkillMatrixEventMapper
{
    public static string GetEventType(object payload) =>
        payload switch
        {
            SkillChangedEvent => "SkillMatrix.SkillChanged",
            ValidationRequestedEvent => "SkillMatrix.ValidationRequested",
            SkillValidatedEvent => "SkillMatrix.SkillValidated",
            ValidationRejectedEvent => "SkillMatrix.ValidationRejected",
            SkillExpiredEvent => "SkillMatrix.SkillExpired",
            SkillRequestSubmittedEvent => "SkillMatrix.SkillRequestSubmitted",
            SkillRequestDecidedEvent => "SkillMatrix.SkillRequestDecided",
            _ => throw new ArgumentOutOfRangeException(nameof(payload), payload.GetType().FullName, "Unknown event payload type."),
        };

    public sealed record SkillChangedEvent(
        string EmployeeId,
        long SkillId,
        long EmployeeSkillId,
        ProficiencyCode ActiveProficiencyCode,
        ValidationStatus ValidationStatus,
        DateTime OccurredAtUtc);

    public sealed record ValidationRequestedEvent(
        long ValidationRequestId,
        string EmployeeId,
        long EmployeeSkillId,
        long SkillId,
        ProficiencyCode RequestedProficiencyCode,
        DateTime OccurredAtUtc);

    public sealed record SkillValidatedEvent(
        long ValidationRequestId,
        string EmployeeId,
        long EmployeeSkillId,
        long SkillId,
        ProficiencyCode FinalProficiencyCode,
        string ValidatedByEmployeeId,
        DateTime ValidationExpiresAtUtc,
        DateTime OccurredAtUtc);

    public sealed record ValidationRejectedEvent(
        long ValidationRequestId,
        string EmployeeId,
        long EmployeeSkillId,
        long SkillId,
        string RejectedByEmployeeId,
        DateTime OccurredAtUtc);

    public sealed record SkillExpiredEvent(
        string EmployeeId,
        long EmployeeSkillId,
        long SkillId,
        DateTime OccurredAtUtc);

    public sealed record SkillRequestSubmittedEvent(
        long SkillRequestId,
        string RequestedByEmployeeId,
        string ProposedSkillName,
        string ProposedCategoryName,
        string ProposedSubcategoryName,
        DateTime OccurredAtUtc);

    public sealed record SkillRequestDecidedEvent(
        long SkillRequestId,
        string Decision,
        long? ApprovedSkillId,
        string DecidedByEmployeeId,
        DateTime OccurredAtUtc);
}

