# API Documentation

## Bitbucket OpenAPI Specification

**File:** `bitbucket-openapi-spec.json`

This is the official Bitbucket API OpenAPI 3.0 specification.

### Source Information

- **Source URL:** https://dac-static.atlassian.com/server/bitbucket/10.0.swagger.v3.json?_v=1.637.26
- **Retrieved Date:** February 4, 2026
- **Bitbucket Version:** 10.0
- **API Version:** 2.0

### Usage

This specification file serves as:
- Complete reference for all available Bitbucket API endpoints
- Documentation for request/response schemas
- Reference for implementing additional tools in the MCP server

### Updating the Specification

To update to the latest version:

1. Download the latest spec from Atlassian:
   ```bash
   curl -o docs/bitbucket-openapi-spec.json \
     "https://dac-static.atlassian.com/server/bitbucket/10.0.swagger.v3.json?_v=1.637.26"
   ```

2. Update the metadata in the `info` section:
   - `x-source-url`: Update with the new URL
   - `x-retrieved-date`: Set to current date
   - `x-bitbucket-version`: Update if version changed

3. Commit the changes with appropriate version information

### Related Documentation

- [Bitbucket API Documentation](https://developer.atlassian.com/cloud/bitbucket/rest/intro/)
- [OpenAPI Specification](https://spec.openapis.org/oas/v3.0.0)
