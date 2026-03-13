using MediatR;
using Microsoft.EntityFrameworkCore;
using SkillMatrix.Application.Persistence;

namespace SkillMatrix.Application.Taxonomy.Queries;

public sealed class GetTaxonomyQueryHandler(ISkillMatrixDbContext db) : IRequestHandler<GetTaxonomyQuery, GetTaxonomyResponse>
{
    public async Task<GetTaxonomyResponse> Handle(GetTaxonomyQuery request, CancellationToken cancellationToken)
    {
        var categories = await db.SkillCategories
            .AsNoTracking()
            .Include(c => c.Subcategories)
            .ThenInclude(sc => sc.Skills)
            .OrderBy(c => c.Name)
            .ToListAsync(cancellationToken);

        var dto = categories.Select(c =>
            new TaxonomyCategoryDto(
                c.Id.ToString(),
                c.Name,
                c.IsActive,
                c.Subcategories
                    .OrderBy(sc => sc.Name)
                    .Select(sc => new TaxonomySubcategoryDto(
                        sc.Id.ToString(),
                        sc.Name,
                        sc.IsActive,
                        sc.Skills
                            .OrderBy(s => s.Name)
                            .Select(s => new TaxonomySkillDto(
                                s.Id.ToString(),
                                s.Name,
                                s.Definition,
                                s.Status.ToString(),
                                s.Version))
                            .ToList()))
                    .ToList()
            )).ToList();

        return new GetTaxonomyResponse(dto);
    }
}

