using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkillMatrix.Domain.Proficiency;
using SkillMatrix.Domain.Ratings;

namespace SkillMatrix.Infrastructure.Persistence.Configurations;

public sealed class SkillRatingConfiguration : IEntityTypeConfiguration<SkillRating>
{
    public void Configure(EntityTypeBuilder<SkillRating> builder)
    {
        builder.ToTable("skill_ratings");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id").ValueGeneratedOnAdd();

        builder.Property(x => x.EmployeeSkillId).HasColumnName("employee_skill_id").IsRequired();

        builder.Property(x => x.Source)
            .HasColumnName("source")
            .HasConversion(v => v.ToString(), v => Enum.Parse<SkillRatingSource>(v, true))
            .HasMaxLength(32)
            .IsRequired();

        builder.Property(x => x.ProficiencyCode)
            .HasColumnName("proficiency_code")
            .HasConversion(v => v.ToString(), v => Enum.Parse<ProficiencyCode>(v, true))
            .HasMaxLength(32)
            .IsRequired();

        builder.Property(x => x.RaterEmployeeId).HasColumnName("rater_employee_id").HasMaxLength(128);
        builder.Property(x => x.Notes).HasColumnName("notes").HasMaxLength(1000);
        builder.Property(x => x.CreatedAtUtc).HasColumnName("created_at_utc").IsRequired();

        builder.HasIndex(x => new { x.EmployeeSkillId, x.Source });
    }
}

