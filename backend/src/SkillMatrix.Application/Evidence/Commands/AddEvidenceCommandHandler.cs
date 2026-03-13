using MediatR;
using Microsoft.EntityFrameworkCore;
using SkillMatrix.Application.Common.Exceptions;
using SkillMatrix.Application.Persistence;
using SkillMatrix.Domain.Evidence;

namespace SkillMatrix.Application.Evidence.Commands;

public sealed class AddEvidenceCommandHandler(ISkillMatrixDbContext db) : IRequestHandler<AddEvidenceCommand, AddEvidenceResult>
{
    public async Task<AddEvidenceResult> Handle(AddEvidenceCommand request, CancellationToken cancellationToken)
    {
        var exists = await db.EmployeeSkills.AnyAsync(
            es => es.Id == request.EmployeeSkillId && es.EmployeeId == request.EmployeeId,
            cancellationToken);

        if (!exists)
        {
            throw new NotFoundException("Employee skill not found.");
        }

        var item = new EvidenceItem
        {
            EmployeeSkillId = request.EmployeeSkillId,
            Type = request.Type,
            ExternalRef = request.ExternalRef,
            FileRef = request.FileRef,
            MetadataJson = request.MetadataJson,
            CreatedAtUtc = DateTime.UtcNow,
        };

        db.EvidenceItems.Add(item);
        await db.SaveChangesAsync(cancellationToken);

        return new AddEvidenceResult(item.Id);
    }
}

