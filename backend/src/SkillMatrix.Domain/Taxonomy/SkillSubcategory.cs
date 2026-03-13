namespace SkillMatrix.Domain.Taxonomy;

public class SkillSubcategory
{
    public long Id { get; set; }

    public long CategoryId { get; set; }

    public string Name { get; set; } = "";

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAtUtc { get; set; }

    public DateTime UpdatedAtUtc { get; set; }

    public SkillCategory? Category { get; set; }

    public List<SkillDefinition> Skills { get; set; } = [];
}

