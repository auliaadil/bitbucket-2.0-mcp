# Bitbucket MCP Server

A Model Context Protocol (MCP) server that provides access to Bitbucket Cloud API. This server enables AI assistants like Claude to interact with Bitbucket repositories, pull requests, issues, and more.

## Features

This MCP server provides tools for:

- **Repositories**: List and get repository details
- **Pull Requests**: List, view, and create pull requests
- **Branches**: List repository branches
- **Commits**: List and view commits
- **Issues**: List, view, and create issues
- **Diffs**: Get diffs for PRs or between commits

## Prerequisites

- Node.js 18 or higher
- A Bitbucket Cloud account
- Atlassian API Token (see setup instructions below)

## Creating an Atlassian API Token

1. Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click **Create API token**
3. Give it a label (e.g., "Bitbucket MCP Server")
4. Select the following scopes based on your needs:

   **Required scopes** (minimum for read-only access):
   - `read:repository:bitbucket` - View repositories, branches, commits, and diffs
   - `read:pullrequest:bitbucket` - View pull requests
   - `read:issue:bitbucket` - View issues

   **Additional scopes** (for write operations):
   - `write:pullrequest:bitbucket` - Create and modify pull requests
   - `write:issue:bitbucket` - Create and modify issues

   **Optional scopes** (for enhanced functionality):
   - `read:workspace:bitbucket` - View workspace information
   - `read:project:bitbucket` - View project information
   - `read:account` - View user profiles

5. Click **Create**
6. **Important**: Copy the generated token immediately (you won't be able to see it again)

## Installation

### Option 1: Install via npm (Recommended)

```bash
npm install -g @auliaadil/bitbucket-2.0-mcp
```

### Option 2: Install from source (for development)

```bash
# Clone the repository
git clone https://github.com/auliaadil/bitbucket-2.0-mcp.git
cd bitbucket-2.0-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

## Configuration

### For Claude Desktop

Add the following to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

If you installed via npm (Option 1):

```json
{
  "mcpServers": {
    "bitbucket": {
      "command": "bitbucket-2.0-mcp",
      "env": {
        "BITBUCKET_WORKSPACE": "your-workspace-slug",
        "BITBUCKET_EMAIL": "your-email@example.com",
        "BITBUCKET_API_TOKEN": "your-atlassian-api-token"
      }
    }
  }
}
```

If you installed from source (Option 2):

```json
{
  "mcpServers": {
    "bitbucket": {
      "command": "node",
      "args": ["/path/to/bitbucket-2.0-mcp/dist/index.js"],
      "env": {
        "BITBUCKET_WORKSPACE": "your-workspace-slug",
        "BITBUCKET_EMAIL": "your-email@example.com",
        "BITBUCKET_API_TOKEN": "your-atlassian-api-token"
      }
    }
  }
}
```

Replace:
- `your-workspace-slug` with your Bitbucket workspace slug (e.g., "my-team")
- `your-email@example.com` with your Atlassian account email
- `your-atlassian-api-token` with the Atlassian API token you created
- `/path/to/bitbucket-2.0-mcp` with the actual path (only for source installation)

### For Claude Code CLI

Add the following to your Claude Code CLI configuration file (`~/.claude/config.json`):

If you installed via npm (Option 1):

```json
{
  "mcpServers": {
    "bitbucket": {
      "command": "bitbucket-2.0-mcp",
      "env": {
        "BITBUCKET_WORKSPACE": "your-workspace-slug",
        "BITBUCKET_EMAIL": "your-email@example.com",
        "BITBUCKET_API_TOKEN": "your-atlassian-api-token"
      }
    }
  }
}
```

If you installed from source (Option 2):

```json
{
  "mcpServers": {
    "bitbucket": {
      "command": "node",
      "args": ["/path/to/bitbucket-2.0-mcp/dist/index.js"],
      "env": {
        "BITBUCKET_WORKSPACE": "your-workspace-slug",
        "BITBUCKET_EMAIL": "your-email@example.com",
        "BITBUCKET_API_TOKEN": "your-atlassian-api-token"
      }
    }
  }
}
```

### For GitHub Copilot CLI

Add the following to your Copilot CLI configuration file (`~/.github/copilot-cli/config.json`):

If you installed via npm (Option 1):

```json
{
  "mcpServers": {
    "bitbucket": {
      "command": "bitbucket-2.0-mcp",
      "env": {
        "BITBUCKET_WORKSPACE": "your-workspace-slug",
        "BITBUCKET_EMAIL": "your-email@example.com",
        "BITBUCKET_API_TOKEN": "your-atlassian-api-token"
      }
    }
  }
}
```

If you installed from source (Option 2):

```json
{
  "mcpServers": {
    "bitbucket": {
      "command": "node",
      "args": ["/path/to/bitbucket-2.0-mcp/dist/index.js"],
      "env": {
        "BITBUCKET_WORKSPACE": "your-workspace-slug",
        "BITBUCKET_EMAIL": "your-email@example.com",
        "BITBUCKET_API_TOKEN": "your-atlassian-api-token"
      }
    }
  }
}
```

### For other MCP clients

If you installed via npm (Option 1):

Set the following environment variables:

```bash
export BITBUCKET_WORKSPACE="your-workspace-slug"
export BITBUCKET_EMAIL="your-email@example.com"
export BITBUCKET_API_TOKEN="your-atlassian-api-token"
```

Then run the server:

```bash
bitbucket-2.0-mcp
```

If you installed from source (Option 2):

Set the following environment variables:

```bash
export BITBUCKET_WORKSPACE="your-workspace-slug"
export BITBUCKET_EMAIL="your-email@example.com"
export BITBUCKET_API_TOKEN="your-atlassian-api-token"
```

Then run the server:

```bash
node /path/to/bitbucket-2.0-mcp/dist/index.js
```

## Scope Requirements by Tool

The following table shows which Atlassian API token scopes are required for each tool:

| Tool | Required Scopes |
|------|----------------|
| `list_repositories` | `read:repository:bitbucket` |
| `get_repository` | `read:repository:bitbucket` |
| `list_pull_requests` | `read:pullrequest:bitbucket` |
| `get_pull_request` | `read:pullrequest:bitbucket` |
| `create_pull_request` | `read:pullrequest:bitbucket`, `write:pullrequest:bitbucket` |
| `list_branches` | `read:repository:bitbucket` |
| `list_commits` | `read:repository:bitbucket` |
| `get_commit` | `read:repository:bitbucket` |
| `list_issues` | `read:issue:bitbucket` |
| `get_issue` | `read:issue:bitbucket` |
| `create_issue` | `read:issue:bitbucket`, `write:issue:bitbucket` |
| `get_diff` | `read:repository:bitbucket` |

## Available Tools

### Repository Tools

#### `list_repositories`
List all repositories in the workspace.

**Parameters:**
- `page` (optional): Page number for pagination
- `pagelen` (optional): Items per page (max: 100)

#### `get_repository`
Get detailed information about a repository.

**Parameters:**
- `repo_slug` (required): Repository name

### Pull Request Tools

#### `list_pull_requests`
List pull requests for a repository.

**Parameters:**
- `repo_slug` (required): Repository name
- `state` (optional): Filter by state (OPEN, MERGED, DECLINED, SUPERSEDED)
- `page` (optional): Page number

#### `get_pull_request`
Get details about a specific pull request.

**Parameters:**
- `repo_slug` (required): Repository name
- `pr_id` (required): Pull request ID

#### `create_pull_request`
Create a new pull request.

**Parameters:**
- `repo_slug` (required): Repository name
- `title` (required): PR title
- `source_branch` (required): Source branch name
- `destination_branch` (optional): Destination branch (default: main)
- `description` (optional): PR description
- `close_source_branch` (optional): Close source after merge (default: false)

### Branch Tools

#### `list_branches`
List all branches in a repository.

**Parameters:**
- `repo_slug` (required): Repository name
- `page` (optional): Page number

### Commit Tools

#### `list_commits`
List commits in a repository.

**Parameters:**
- `repo_slug` (required): Repository name
- `branch` (optional): Branch name
- `page` (optional): Page number

#### `get_commit`
Get details about a specific commit.

**Parameters:**
- `repo_slug` (required): Repository name
- `commit_hash` (required): Commit hash

### Issue Tools

#### `list_issues`
List issues for a repository.

**Parameters:**
- `repo_slug` (required): Repository name
- `state` (optional): Filter by state (new, open, resolved, etc.)
- `page` (optional): Page number

#### `get_issue`
Get details about a specific issue.

**Parameters:**
- `repo_slug` (required): Repository name
- `issue_id` (required): Issue ID

#### `create_issue`
Create a new issue.

**Parameters:**
- `repo_slug` (required): Repository name
- `title` (required): Issue title
- `content` (optional): Issue description
- `kind` (optional): Issue type (bug, enhancement, proposal, task)
- `priority` (optional): Issue priority (trivial, minor, major, critical, blocker)

### Diff Tools

#### `get_diff`
Get the diff for a pull request or between commits.

**Parameters:**
- `repo_slug` (required): Repository name
- `spec` (required): Diff spec (e.g., "master..feature" or PR ID)

## Usage Examples

When using with Claude Desktop, you can ask questions like:

- "List all repositories in my Bitbucket workspace"
- "Show me open pull requests for the project-name repository"
- "Create a pull request from feature-branch to main in my-repo"
- "What are the latest commits on the develop branch?"
- "Create a bug issue in my-repo titled 'Fix login error'"

## Development

```bash
# Install dependencies
npm install

# Build and watch for changes
npm run dev

# Build for production
npm run build
```

## Troubleshooting

### Authentication Errors

If you get 401 or 403 errors:
1. Verify your email and Atlassian API token are correct
2. Ensure your API token hasn't expired or been revoked
3. Confirm your Atlassian account has access to the workspace
4. Ensure your workspace slug is correct

### Permission/Scope Errors

If specific tools fail with permission errors:
1. Check that your API token has the required scopes (see "Scope Requirements by Tool" section)
2. Verify you have the necessary permissions in your Bitbucket workspace
3. Some operations (like creating PRs or issues) require write scopes - ensure these are enabled on your token
4. You may need to regenerate your token with additional scopes if you initially created it with limited permissions

### Tool Not Found

If tools aren't appearing:
1. Restart your MCP client (Claude Desktop, Claude Code CLI, etc.) after configuration changes
2. Check the logs in your client's developer console
3. For npm installations: Verify the installation with `npm list -g @auliaadil/bitbucket-2.0-mcp`
4. For source installations: Verify the path to `index.js` is correct

### Rate Limiting

Bitbucket API has rate limits. If you hit them:
- Wait a few minutes before retrying
- Reduce the number of requests
- Consider implementing caching if needed

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT

## Resources

- [Bitbucket API Documentation](https://developer.atlassian.com/cloud/bitbucket/rest/intro/)
- [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
- [Bitbucket OpenAPI Specification](./docs/bitbucket-openapi-spec.json) - Complete API spec included in this repository
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
