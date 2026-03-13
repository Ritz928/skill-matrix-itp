using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillMatrix.Api.Auth;
using SkillMatrix.Application.Taxonomy.Queries;

namespace SkillMatrix.Api.Controllers;

[ApiController]
[Route("taxonomy")]
[Authorize(Policy = AuthorizationPolicies.PolicyNames.Employee)]
public sealed class TaxonomyController(ISender sender) : ControllerBase
{
    [HttpGet]
    public Task<GetTaxonomyResponse> Get(CancellationToken cancellationToken) =>
        sender.Send(new GetTaxonomyQuery(), cancellationToken);
}

