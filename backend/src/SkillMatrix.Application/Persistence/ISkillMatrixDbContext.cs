using Microsoft.EntityFrameworkCore;
using SkillMatrix.Domain.Audit;
using SkillMatrix.Domain.Employees;
using SkillMatrix.Domain.Evidence;
using SkillMatrix.Domain.Outbox;
using SkillMatrix.Domain.Proficiency;
using SkillMatrix.Domain.Ratings;
using SkillMatrix.Domain.Taxonomy;
using SkillMatrix.Domain.Validation;

namespace SkillMatrix.Application.Persistence;

public interface ISkillMatrixDbContext
{
    DbSet<SkillCategory> SkillCategories { get; }
    DbSet<SkillSubcategory> SkillSubcategories { get; }
    DbSet<SkillDefinition> Skills { get; }

    DbSet<ProficiencyLevel> ProficiencyLevels { get; }

    DbSet<EmployeeSkill> EmployeeSkills { get; }
    DbSet<EvidenceItem> EvidenceItems { get; }
    DbSet<SkillRating> SkillRatings { get; }

    DbSet<ValidationRequest> ValidationRequests { get; }
    DbSet<ValidationDecision> ValidationDecisions { get; }

    DbSet<AuditLogEntry> AuditLogEntries { get; }
    DbSet<OutboxMessage> OutboxMessages { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

