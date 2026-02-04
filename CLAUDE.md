# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Model Context Protocol (MCP) server that provides access to the Bitbucket Cloud API. It enables AI assistants to interact with Bitbucket repositories, pull requests, issues, commits, branches, and diffs through a standardized MCP interface.

## Development Commands

### Building
```bash
npm run build          # Compile TypeScript to JavaScript in dist/
npm run dev            # Watch mode - recompile on file changes
```

### Running the Server
```bash
node dist/index.js     # Run the compiled server (requires environment variables)
```

### Required Environment Variables
```bash
BITBUCKET_WORKSPACE    # Bitbucket workspace slug
BITBUCKET_EMAIL        # Atlassian account email
BITBUCKET_API_TOKEN    # Atlassian API token (from id.atlassian.com)
```

## Architecture

### Core Components

**src/index.ts** (Main MCP Server)
- Implements the MCP server using `@modelcontextprotocol/sdk`
- Defines 13 tools for Bitbucket operations (repositories, PRs, issues, commits, branches, diffs)
- Handles tool registration via `ListToolsRequestSchema`
- Executes tool calls via `CallToolRequestSchema` with a large switch statement
- Uses stdio transport for communication with MCP clients
- Returns all results as JSON text content

**src/bitbucket-client.ts** (HTTP Client)
- Thin wrapper around axios for Bitbucket API v2.0 calls
- Handles Basic Auth (email + API token)
- Provides typed methods: `get()`, `post()`, `put()`, `delete()`
- Base URL: `https://api.bitbucket.org/2.0`
- Stores workspace configuration

### Tool Implementation Pattern

Each tool in `src/index.ts` follows the same pattern:
1. Extract parameters from `args` object
2. Build Bitbucket API endpoint URL with workspace and repo_slug
3. Call `bitbucket.get()` or `bitbucket.post()` with the URL
4. Return JSON-stringified result as text content
5. Catch errors and return formatted error messages with HTTP status codes

### Authentication

Uses HTTP Basic Authentication with:
- Username: Atlassian account email
- Password: Atlassian API Token (not app password)

API tokens must have appropriate scopes (read:repository, read:pullrequest, write:pullrequest, etc.)

## Key Patterns

### Tool Categories
- **Repository tools**: list_repositories, get_repository
- **Pull request tools**: list_pull_requests, get_pull_request, create_pull_request
- **Branch tools**: list_branches
- **Commit tools**: list_commits, get_commit
- **Issue tools**: list_issues, get_issue, create_issue
- **Diff tools**: get_diff

### Pagination
Most list operations support `page` and optionally `pagelen` parameters. Bitbucket API uses 1-based page numbers.

### State Filtering
- PR states: OPEN, MERGED, DECLINED, SUPERSEDED
- Issue states: new, open, resolved, on hold, invalid, duplicate, wontfix, closed

### Error Handling
Errors are caught in the main switch statement and formatted as:
```
Error: {error.message} (Status: {statusCode})
```

## Configuration for MCP Clients

The server runs on stdio and requires configuration in MCP client config files (e.g., Claude Desktop's `claude_desktop_config.json`) with the command, args (path to dist/index.js), and env variables.

## Important Notes

- All API calls use the workspace from environment variables
- The server validates required env vars on startup and exits if missing
- Tool names use snake_case (e.g., `list_pull_requests`)
- All responses are JSON-formatted text
- The server logs to stderr to avoid interfering with stdio transport
