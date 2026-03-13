using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkillMatrix.Domain.Taxonomy;

namespace SkillMatrix.Infrastructure.Persistence.Configurations;

public sealed class SkillDefinitionConfiguration : IEntityTypeConfiguration<SkillDefinition>
{
    public void Configure(EntityTypeBuilder<SkillDefinition> builder)
    {
        builder.ToTable("skills");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id").ValueGeneratedOnAdd();

        builder.Property(x => x.SubcategoryId).HasColumnName("subcategory_id").IsRequired();
        builder.Property(x => x.Name).HasColumnName("name").HasMaxLength(200).IsRequired();
        builder.Property(x => x.Definition).HasColumnName("definition").HasColumnType("longtext").IsRequired();

        builder.Property(x => x.Version).HasColumnName("version").IsRequired();

        builder.Property(x => x.Status)
            .HasColumnName("status")
            .HasConversion(v => v.ToString(), v => Enum.Parse<SkillStatus>(v, true))
            .HasMaxLength(32)
            .IsRequired();

        builder.Property(x => x.ReplacedBySkillId).HasColumnName("replaced_by_skill_id");

        builder.Property(x => x.CreatedAtUtc).HasColumnName("created_at_utc").IsRequired();
        builder.Property(x => x.UpdatedAtUtc).HasColumnName("updated_at_utc").IsRequired();

        builder.HasIndex(x => new { x.SubcategoryId, x.Name }).IsUnique();
        builder.HasIndex(x => new { x.SubcategoryId, x.Status });
    }
}

