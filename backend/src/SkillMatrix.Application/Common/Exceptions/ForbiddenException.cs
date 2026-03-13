namespace SkillMatrix.Application.Common.Exceptions;

public sealed class ForbiddenException(string message) : AppException("forbidden", message);

