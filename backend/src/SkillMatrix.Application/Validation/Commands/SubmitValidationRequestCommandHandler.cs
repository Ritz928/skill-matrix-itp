using MediatR;
using Microsoft.EntityFrameworkCore;
using SkillMatrix.Application.Common.Exceptions;
using SkillMatrix.Application.Persistence;
using SkillMatrix.Application.Validation.Events;
using SkillMatrix.Domain.Validation;

namespace SkillMatrix.Application.Validation.Commands;

public sealed class SubmitValidationRequestCommandHandler(
    ISkillMatrixDbContext db,
    ValidationRequestedPublisher publisher) : IRequestHandler<SubmitValidationRequestCommand, SubmitValidationRequestResult>
{
    public async Task<SubmitValidationRequestResult> Handle(SubmitValidationRequestCommand request, CancellationToken cancellationToken)
    {
        var employeeSkill = await db.EmployeeSkills
            .FirstOrDefaultAsync(es => es.Id == request.EmployeeSkillId && es.EmployeeId == request.EmployeeId, cancellationToken)
            ?? throw new NotFoundException("Employee skill not found.");

        var now = DateTime.UtcNow;

        employeeSkill.ActiveProficiencyCode = request.RequestedProficiencyCode;
        employeeSkill.ValidationStatus = SkillMatrix.Domain.Validation.ValidationStatus.PendingValidation;
        employeeSkill.UpdatedAtUtc = now;

        var validationRequest = new ValidationRequest
        {
            EmployeeSkillId = employeeSkill.Id,
            RequestedByEmployeeId = request.EmployeeId,
            RequestedProficiencyCode = request.RequestedProficiencyCode,
            Status = ValidationRequestStatus.Submitted,
            SubmittedAtUtc = now,
            CreatedAtUtc = now,
            UpdatedAtUtc = now,
        };

        db.ValidationRequests.Add(validationRequest);
        await db.SaveChangesAsync(cancellationToken);

        await publisher.PublishAsync(validationRequest, employeeSkill, now, cancellationToken);

        return new SubmitValidationRequestResult(validationRequest.Id);
    }
}

