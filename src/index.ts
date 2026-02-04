#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode
} from '@modelcontextprotocol/sdk/types.js';
import { BitbucketClient, BitbucketConfig } from './bitbucket-client.js';

const server = new Server(
  {
    name: 'bitbucket-2.0-mcp',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Get configuration from environment variables
const config: BitbucketConfig = {
  workspace: process.env.BITBUCKET_WORKSPACE || '',
  email: process.env.BITBUCKET_EMAIL || '',
  apiToken: process.env.BITBUCKET_API_TOKEN || ''
};

if (!config.workspace || !config.email || !config.apiToken) {
  console.error('Error: Missing required environment variables:');
  console.error('  - BITBUCKET_WORKSPACE');
  console.error('  - BITBUCKET_EMAIL');
  console.error('  - BITBUCKET_API_TOKEN');
  process.exit(1);
}

const bitbucket = new BitbucketClient(config);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_repositories',
        description: 'List all repositories in the workspace',
        inputSchema: {
          type: 'object',
          properties: {
            page: {
              type: 'number',
              description: 'Page number for pagination (default: 1)'
            },
            pagelen: {
              type: 'number',
              description: 'Number of items per page (default: 10, max: 100)'
            }
          }
        }
      },
      {
        name: 'get_repository',
        description: 'Get detailed information about a specific repository',
        inputSchema: {
          type: 'object',
          properties: {
            repo_slug: {
              type: 'string',
              description: 'Repository slug (name)'
            }
          },
          required: ['repo_slug']
        }
      },
      {
        name: 'list_pull_requests',
        description: 'List pull requests for a repository',
        inputSchema: {
          type: 'object',
          properties: {
            repo_slug: {
              type: 'string',
              description: 'Repository slug (name)'
            },
            state: {
              type: 'string',
              enum: ['OPEN', 'MERGED', 'DECLINED', 'SUPERSEDED'],
              description: 'Filter by PR state (optional)'
            },
            page: {
              type: 'number',
              description: 'Page number for pagination'
            }
          },
          required: ['repo_slug']
        }
      },
      {
        name: 'get_pull_request',
        description: 'Get detailed information about a specific pull request',
        inputSchema: {
          type: 'object',
          properties: {
            repo_slug: {
              type: 'string',
              description: 'Repository slug (name)'
            },
            pr_id: {
              type: 'number',
              description: 'Pull request ID'
            }
          },
          required: ['repo_slug', 'pr_id']
        }
      },
      {
        name: 'create_pull_request',
        description: 'Create a new pull request',
        inputSchema: {
          type: 'object',
          properties: {
            repo_slug: {
              type: 'string',
              description: 'Repository slug (name)'
            },
            title: {
              type: 'string',
              description: 'PR title'
            },
            source_branch: {
              type: 'string',
              description: 'Source branch name'
            },
            destination_branch: {
              type: 'string',
              description: 'Destination branch name (default: main)'
            },
            description: {
              type: 'string',
              description: 'PR description (optional)'
            },
            close_source_branch: {
              type: 'boolean',
              description: 'Close source branch after merge (default: false)'
            }
          },
          required: ['repo_slug', 'title', 'source_branch']
        }
      },
      {
        name: 'list_branches',
        description: 'List branches in a repository',
        inputSchema: {
          type: 'object',
          properties: {
            repo_slug: {
              type: 'string',
              description: 'Repository slug (name)'
            },
            page: {
              type: 'number',
              description: 'Page number for pagination'
            }
          },
          required: ['repo_slug']
        }
      },
      {
        name: 'list_commits',
        description: 'List commits in a repository',
        inputSchema: {
          type: 'object',
          properties: {
            repo_slug: {
              type: 'string',
              description: 'Repository slug (name)'
            },
            branch: {
              type: 'string',
              description: 'Branch name (optional, defaults to main branch)'
            },
            page: {
              type: 'number',
              description: 'Page number for pagination'
            }
          },
          required: ['repo_slug']
        }
      },
      {
        name: 'get_commit',
        description: 'Get detailed information about a specific commit',
        inputSchema: {
          type: 'object',
          properties: {
            repo_slug: {
              type: 'string',
              description: 'Repository slug (name)'
            },
            commit_hash: {
              type: 'string',
              description: 'Commit hash'
            }
          },
          required: ['repo_slug', 'commit_hash']
        }
      },
      {
        name: 'list_issues',
        description: 'List issues for a repository',
        inputSchema: {
          type: 'object',
          properties: {
            repo_slug: {
              type: 'string',
              description: 'Repository slug (name)'
            },
            state: {
              type: 'string',
              enum: ['new', 'open', 'resolved', 'on hold', 'invalid', 'duplicate', 'wontfix', 'closed'],
              description: 'Filter by issue state (optional)'
            },
            page: {
              type: 'number',
              description: 'Page number for pagination'
            }
          },
          required: ['repo_slug']
        }
      },
      {
        name: 'get_issue',
        description: 'Get detailed information about a specific issue',
        inputSchema: {
          type: 'object',
          properties: {
            repo_slug: {
              type: 'string',
              description: 'Repository slug (name)'
            },
            issue_id: {
              type: 'number',
              description: 'Issue ID'
            }
          },
          required: ['repo_slug', 'issue_id']
        }
      },
      {
        name: 'create_issue',
        description: 'Create a new issue',
        inputSchema: {
          type: 'object',
          properties: {
            repo_slug: {
              type: 'string',
              description: 'Repository slug (name)'
            },
            title: {
              type: 'string',
              description: 'Issue title'
            },
            content: {
              type: 'string',
              description: 'Issue description/content'
            },
            kind: {
              type: 'string',
              enum: ['bug', 'enhancement', 'proposal', 'task'],
              description: 'Issue kind (default: bug)'
            },
            priority: {
              type: 'string',
              enum: ['trivial', 'minor', 'major', 'critical', 'blocker'],
              description: 'Issue priority (default: major)'
            }
          },
          required: ['repo_slug', 'title']
        }
      },
      {
        name: 'get_diff',
        description: 'Get the diff for a pull request or between commits',
        inputSchema: {
          type: 'object',
          properties: {
            repo_slug: {
              type: 'string',
              description: 'Repository slug (name)'
            },
            spec: {
              type: 'string',
              description: 'Diff spec (e.g., "master..feature" or PR ID)'
            }
          },
          required: ['repo_slug', 'spec']
        }
      }
    ]
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const workspace = bitbucket.getWorkspace();

    switch (name) {
      case 'list_repositories': {
        const page = (args?.page as number) || 1;
        const pagelen = Math.min((args?.pagelen as number) || 10, 100);

        const result = await bitbucket.get(
          `/repositories/${workspace}?page=${page}&pagelen=${pagelen}`
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case 'get_repository': {
        const repoSlug = args?.repo_slug as string;
        const result = await bitbucket.get(`/repositories/${workspace}/${repoSlug}`);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case 'list_pull_requests': {
        const repoSlug = args?.repo_slug as string;
        const state = args?.state as string | undefined;
        const page = (args?.page as number) || 1;

        let url = `/repositories/${workspace}/${repoSlug}/pullrequests?page=${page}`;
        if (state) {
          url += `&state=${state}`;
        }

        const result = await bitbucket.get(url);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case 'get_pull_request': {
        const repoSlug = args?.repo_slug as string;
        const prId = args?.pr_id as number;

        const result = await bitbucket.get(
          `/repositories/${workspace}/${repoSlug}/pullrequests/${prId}`
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case 'create_pull_request': {
        const repoSlug = args?.repo_slug as string;
        const title = args?.title as string;
        const sourceBranch = args?.source_branch as string;
        const destinationBranch = (args?.destination_branch as string) || 'main';
        const description = args?.description as string | undefined;
        const closeSourceBranch = (args?.close_source_branch as boolean) || false;

        const data = {
          title,
          source: {
            branch: {
              name: sourceBranch
            }
          },
          destination: {
            branch: {
              name: destinationBranch
            }
          },
          description,
          close_source_branch: closeSourceBranch
        };

        const result = await bitbucket.post(
          `/repositories/${workspace}/${repoSlug}/pullrequests`,
          data
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case 'list_branches': {
        const repoSlug = args?.repo_slug as string;
        const page = (args?.page as number) || 1;

        const result = await bitbucket.get(
          `/repositories/${workspace}/${repoSlug}/refs/branches?page=${page}`
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case 'list_commits': {
        const repoSlug = args?.repo_slug as string;
        const branch = args?.branch as string | undefined;
        const page = (args?.page as number) || 1;

        let url = `/repositories/${workspace}/${repoSlug}/commits`;
        if (branch) {
          url += `/${branch}`;
        }
        url += `?page=${page}`;

        const result = await bitbucket.get(url);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case 'get_commit': {
        const repoSlug = args?.repo_slug as string;
        const commitHash = args?.commit_hash as string;

        const result = await bitbucket.get(
          `/repositories/${workspace}/${repoSlug}/commit/${commitHash}`
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case 'list_issues': {
        const repoSlug = args?.repo_slug as string;
        const state = args?.state as string | undefined;
        const page = (args?.page as number) || 1;

        let url = `/repositories/${workspace}/${repoSlug}/issues?page=${page}`;
        if (state) {
          url += `&q=state="${state}"`;
        }

        const result = await bitbucket.get(url);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case 'get_issue': {
        const repoSlug = args?.repo_slug as string;
        const issueId = args?.issue_id as number;

        const result = await bitbucket.get(
          `/repositories/${workspace}/${repoSlug}/issues/${issueId}`
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case 'create_issue': {
        const repoSlug = args?.repo_slug as string;
        const title = args?.title as string;
        const content = args?.content as string | undefined;
        const kind = (args?.kind as string) || 'bug';
        const priority = (args?.priority as string) || 'major';

        const data: any = {
          title,
          kind,
          priority
        };

        if (content) {
          data.content = {
            raw: content
          };
        }

        const result = await bitbucket.post(
          `/repositories/${workspace}/${repoSlug}/issues`,
          data
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case 'get_diff': {
        const repoSlug = args?.repo_slug as string;
        const spec = args?.spec as string;

        const result = await bitbucket.get(
          `/repositories/${workspace}/${repoSlug}/diff/${spec}`
        );

        return {
          content: [
            {
              type: 'text',
              text: typeof result === 'string' ? result : JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown error';
    const statusCode = error.response?.status;

    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}${statusCode ? ` (Status: ${statusCode})` : ''}`
        }
      ],
      isError: true
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Bitbucket 2.0 MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
