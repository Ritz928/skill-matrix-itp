using MediatR;

namespace SkillMatrix.Application.Taxonomy.Queries;

public sealed record GetTaxonomyQuery : IRequest<GetTaxonomyResponse>;

public sealed record GetTaxonomyResponse(IReadOnlyList<TaxonomyCategoryDto> Categories);

public sealed record TaxonomyCategoryDto(
    string Id,
    string Name,
    bool IsActive,
    IReadOnlyList<TaxonomySubcategoryDto> Subcategories);

public sealed record TaxonomySubcategoryDto(
    string Id,
    string Name,
    bool IsActive,
    IReadOnlyList<TaxonomySkillDto> Skills);

public sealed record TaxonomySkillDto(
    string Id,
    string Name,
    string Definition,
    string Status,
    int Version);

