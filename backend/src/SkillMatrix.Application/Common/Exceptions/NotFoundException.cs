namespace SkillMatrix.Application.Common.Exceptions;

public sealed class NotFoundException(string message) : AppException("not_found", message);

