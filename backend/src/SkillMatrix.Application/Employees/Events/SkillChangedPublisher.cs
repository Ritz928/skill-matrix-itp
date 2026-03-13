using SkillMatrix.Application.Events;
using SkillMatrix.Application.Outbox;
using SkillMatrix.Domain.Employees;

namespace SkillMatrix.Application.Employees.Events;

public sealed class SkillChangedPublisher(IOutboxPublisher outbox)
{
    public Task PublishAsync(EmployeeSkill employeeSkill, DateTime occurredAtUtc, CancellationToken cancellationToken = default)
    {
        var payload = new SkillMatrixEventMapper.SkillChangedEvent(
            employeeSkill.EmployeeId,
            employeeSkill.SkillId,
            employeeSkill.Id,
            employeeSkill.ActiveProficiencyCode,
            employeeSkill.ValidationStatus,
            occurredAtUtc);

        var eventType = SkillMatrixEventMapper.GetEventType(payload);
        return outbox.EnqueueAsync(eventType, payload, occurredAtUtc, cancellationToken);
    }
}

