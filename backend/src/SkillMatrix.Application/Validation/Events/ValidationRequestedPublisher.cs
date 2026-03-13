using SkillMatrix.Application.Events;
using SkillMatrix.Application.Outbox;
using SkillMatrix.Domain.Employees;
using SkillMatrix.Domain.Validation;

namespace SkillMatrix.Application.Validation.Events;

public sealed class ValidationRequestedPublisher(IOutboxPublisher outbox)
{
    public Task PublishAsync(ValidationRequest request, EmployeeSkill employeeSkill, DateTime occurredAtUtc, CancellationToken cancellationToken = default)
    {
        var payload = new SkillMatrixEventMapper.ValidationRequestedEvent(
            request.Id,
            employeeSkill.EmployeeId,
            employeeSkill.Id,
            employeeSkill.SkillId,
            request.RequestedProficiencyCode,
            occurredAtUtc);

        var eventType = SkillMatrixEventMapper.GetEventType(payload);
        return outbox.EnqueueAsync(eventType, payload, occurredAtUtc, cancellationToken);
    }
}

