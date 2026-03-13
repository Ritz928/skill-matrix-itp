using MediatR;
using Microsoft.EntityFrameworkCore;
using SkillMatrix.Application.Common.Exceptions;
using SkillMatrix.Application.Employees.Events;
using SkillMatrix.Application.Persistence;
using SkillMatrix.Domain.Employees;
using SkillMatrix.Domain.Ratings;
using SkillMatrix.Domain.Validation;

namespace SkillMatrix.Application.Employees.Commands;

public sealed class UpsertMySkillCommandHandler(
    ISkillMatrixDbContext db,
    SkillChangedPublisher skillChangedPublisher) : IRequestHandler<UpsertMySkillCommand, UpsertMySkillResult>
{
    public async Task<UpsertMySkillResult> Handle(UpsertMySkillCommand request, CancellationToken cancellationToken)
    {
        if (request.EmployeeSkillId is null && request.SkillId is null)
        {
            throw new ValidationException("Either employeeSkillId or skillId is required.");
        }

        EmployeeSkill employeeSkill;

        if (request.EmployeeSkillId is not null)
        {
            employeeSkill = await db.EmployeeSkills
                .FirstOrDefaultAsync(es => es.Id == request.EmployeeSkillId && es.EmployeeId == request.EmployeeId, cancellationToken)
                ?? throw new NotFoundException("Employee skill not found.");
        }
        else
        {
            var skillId = request.SkillId!.Value;

            var skillExists = await db.Skills.AnyAsync(s => s.Id == skillId, cancellationToken);
            if (!skillExists)
            {
                throw new NotFoundException("Skill not found.");
            }

            employeeSkill = await db.EmployeeSkills
                .FirstOrDefaultAsync(es => es.EmployeeId == request.EmployeeId && es.SkillId == skillId, cancellationToken)
                ?? new EmployeeSkill
                {
                    EmployeeId = request.EmployeeId,
                    SkillId = skillId,
                    CreatedAtUtc = DateTime.UtcNow,
                    UpdatedAtUtc = DateTime.UtcNow,
                    ValidationStatus = ValidationStatus.SelfAssessed,
                };

            if (employeeSkill.Id == 0)
            {
                db.EmployeeSkills.Add(employeeSkill);
            }
        }

        var proficiencyChanged = employeeSkill.ActiveProficiencyCode != request.ProficiencyCode;

        employeeSkill.ActiveProficiencyCode = request.ProficiencyCode;
        employeeSkill.UpdatedAtUtc = DateTime.UtcNow;

        if (employeeSkill.ValidationStatus == ValidationStatus.Validated && proficiencyChanged)
        {
            employeeSkill.ValidationStatus = ValidationStatus.PendingValidation;
        }

        await db.SaveChangesAsync(cancellationToken);

        db.SkillRatings.Add(new SkillRating
        {
            EmployeeSkillId = employeeSkill.Id,
            Source = SkillRatingSource.Self,
            ProficiencyCode = request.ProficiencyCode,
            RaterEmployeeId = request.EmployeeId,
            CreatedAtUtc = DateTime.UtcNow,
        });

        await db.SaveChangesAsync(cancellationToken);

        await skillChangedPublisher.PublishAsync(employeeSkill, DateTime.UtcNow, cancellationToken);

        return new UpsertMySkillResult(employeeSkill.Id);
    }
}

