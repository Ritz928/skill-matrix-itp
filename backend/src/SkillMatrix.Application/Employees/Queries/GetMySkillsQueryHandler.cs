using MediatR;
using Microsoft.EntityFrameworkCore;
using SkillMatrix.Application.Persistence;

namespace SkillMatrix.Application.Employees.Queries;

public sealed class GetMySkillsQueryHandler(ISkillMatrixDbContext db) : IRequestHandler<GetMySkillsQuery, GetMySkillsResponse>
{
    public async Task<GetMySkillsResponse> Handle(GetMySkillsQuery request, CancellationToken cancellationToken)
    {
        var items = await (
            from es in db.EmployeeSkills.AsNoTracking()
            join s in db.Skills.AsNoTracking() on es.SkillId equals s.Id
            join sc in db.SkillSubcategories.AsNoTracking() on s.SubcategoryId equals sc.Id
            join c in db.SkillCategories.AsNoTracking() on sc.CategoryId equals c.Id
            where es.EmployeeId == request.EmployeeId
            orderby c.Name, sc.Name, s.Name
            select new MySkillDto(
                es.Id.ToString(),
                new SkillSummaryDto(
                    s.Id.ToString(),
                    s.Name,
                    s.Definition,
                    c.Name,
                    sc.Name),
                new ProficiencyDto(es.ActiveProficiencyCode.ToString(), es.ActiveProficiencyCode.ToString()),
                es.ValidationStatus.Value,
                es.LastValidatedAtUtc,
                es.ValidationExpiresAtUtc
            )
        ).ToListAsync(cancellationToken);

        return new GetMySkillsResponse(request.EmployeeId, items);
    }
}

