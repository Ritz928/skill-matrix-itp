using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkillMatrix.Domain.Proficiency;
using SkillMatrix.Domain.Validation;

namespace SkillMatrix.Infrastructure.Persistence.Configurations;

public sealed class ValidationDecisionConfiguration : IEntityTypeConfiguration<ValidationDecision>
{
    public void Configure(EntityTypeBuilder<ValidationDecision> builder)
    {
        builder.ToTable("validation_decisions");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id").ValueGeneratedOnAdd();

        builder.Property(x => x.ValidationRequestId).HasColumnName("validation_request_id").IsRequired();
        builder.Property(x => x.DeciderEmployeeId).HasColumnName("decider_employee_id").HasMaxLength(128).IsRequired();

        builder.Property(x => x.Decision)
            .HasColumnName("decision")
            .HasConversion(v => v.ToString(), v => Enum.Parse<ValidationDecisionType>(v, true))
            .HasMaxLength(32)
            .IsRequired();

        builder.Property(x => x.FinalProficiencyCode)
            .HasColumnName("final_proficiency_code")
            .HasConversion(
                v => v == null ? null : v.Value.ToString(),
                v => v == null ? null : Enum.Parse<ProficiencyCode>(v, true))
            .HasMaxLength(32);

        builder.Property(x => x.Feedback).HasColumnName("feedback").HasMaxLength(2000);
        builder.Property(x => x.CreatedAtUtc).HasColumnName("created_at_utc").IsRequired();

        builder.HasIndex(x => x.ValidationRequestId).IsUnique();
    }
}

