using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkillMatrix.Domain.Taxonomy;

namespace SkillMatrix.Infrastructure.Persistence.Configurations;

public sealed class SkillSubcategoryConfiguration : IEntityTypeConfiguration<SkillSubcategory>
{
    public void Configure(EntityTypeBuilder<SkillSubcategory> builder)
    {
        builder.ToTable("skill_subcategories");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id").ValueGeneratedOnAdd();

        builder.Property(x => x.CategoryId).HasColumnName("category_id").IsRequired();
        builder.Property(x => x.Name).HasColumnName("name").HasMaxLength(200).IsRequired();
        builder.Property(x => x.IsActive).HasColumnName("is_active").IsRequired();
        builder.Property(x => x.CreatedAtUtc).HasColumnName("created_at_utc").IsRequired();
        builder.Property(x => x.UpdatedAtUtc).HasColumnName("updated_at_utc").IsRequired();

        builder.HasIndex(x => new { x.CategoryId, x.Name }).IsUnique();

        builder.HasMany(x => x.Skills)
            .WithOne(s => s.Subcategory!)
            .HasForeignKey(s => s.SubcategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

