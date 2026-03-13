namespace SkillMatrix.Domain.Taxonomy;

public class SkillCategory
{
    public long Id { get; set; }

    public string Name { get; set; } = "";

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAtUtc { get; set; }

    public DateTime UpdatedAtUtc { get; set; }

    public List<SkillSubcategory> Subcategories { get; set; } = [];
}

