interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Salesforce MCP Pack
 *
 * Requires OAuth connection — gateway injects credentials via _context.salesforce.
 * Tools: SOQL query, record lookup, SOSL search, schema describe, list objects.
 */


interface SalesforceContext {
  salesforce?: { accessToken: string; instanceUrl?: string };
}

const API_VERSION = 'v60.0';

async function sfFetch(ctx: SalesforceContext, path: string, options: RequestInit = {}) {
  if (!ctx.salesforce) {
    return { error: 'connection_required', message: 'Connect your Salesforce account at https://pipeworx.io/account' };
  }
  const { accessToken, instanceUrl } = ctx.salesforce;
  if (!instanceUrl) {
    return { error: 'missing_instance_url', message: 'Salesforce instance URL not found in connection' };
  }
  const base = instanceUrl.replace(/\/$/, '');
  const res = await fetch(`${base}/services/data/${API_VERSION}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Salesforce API error (${res.status}): ${text}`);
  }
  if (res.status === 204) return { success: true };
  return res.json();
}

const tools: McpToolExport['tools'] = [
  {
    name: 'sf_query',
    description: 'Execute a SOQL query against Salesforce. Returns matching records.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'SOQL query (e.g., "SELECT Id, Name FROM Account LIMIT 10")' },
      },
      required: ['query'],
    },
  },
  {
    name: 'sf_get_record',
    description: 'Get a single Salesforce record by object type and ID.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        object: { type: 'string', description: 'SObject type (e.g., "Account", "Contact", "Opportunity")' },
        id: { type: 'string', description: 'Salesforce record ID' },
        fields: { type: 'string', description: 'Comma-separated field names (optional)' },
      },
      required: ['object', 'id'],
    },
  },
  {
    name: 'sf_search',
    description: 'Execute a SOSL search across Salesforce objects.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        search: { type: 'string', description: 'SOSL search (e.g., "FIND {Acme} IN ALL FIELDS RETURNING Account(Id, Name)")' },
      },
      required: ['search'],
    },
  },
  {
    name: 'sf_describe',
    description: 'Describe a Salesforce SObject schema — fields, relationships, metadata.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        object: { type: 'string', description: 'SObject type (e.g., "Account")' },
      },
      required: ['object'],
    },
  },
  {
    name: 'sf_list_objects',
    description: 'List all available Salesforce SObject types in the org.',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'sf_create_record',
    description: 'Create a new Salesforce record.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        object: { type: 'string', description: 'SObject type (e.g., "Account", "Contact")' },
        fields: { type: 'object', description: 'Field name/value pairs (e.g., {"Name": "Acme", "Industry": "Tech"})' },
      },
      required: ['object', 'fields'],
    },
  },
  {
    name: 'sf_update_record',
    description: 'Update an existing Salesforce record.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        object: { type: 'string', description: 'SObject type (e.g., "Account")' },
        id: { type: 'string', description: 'Salesforce record ID' },
        fields: { type: 'object', description: 'Field name/value pairs to update' },
      },
      required: ['object', 'id', 'fields'],
    },
  },
  {
    name: 'sf_delete_record',
    description: 'Delete a Salesforce record.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        object: { type: 'string', description: 'SObject type (e.g., "Account")' },
        id: { type: 'string', description: 'Salesforce record ID' },
      },
      required: ['object', 'id'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const context = (args._context ?? {}) as SalesforceContext;
  delete args._context;

  switch (name) {
    case 'sf_query':
      return sfFetch(context, `/query?q=${encodeURIComponent(args.query as string)}`);
    case 'sf_get_record': {
      const fields = args.fields as string | undefined;
      const path = fields
        ? `/sobjects/${args.object}/${args.id}?fields=${encodeURIComponent(fields)}`
        : `/sobjects/${args.object}/${args.id}`;
      return sfFetch(context, path);
    }
    case 'sf_search':
      return sfFetch(context, `/search?q=${encodeURIComponent(args.search as string)}`);
    case 'sf_describe':
      return sfFetch(context, `/sobjects/${args.object}/describe`);
    case 'sf_list_objects':
      return sfFetch(context, '/sobjects');
    case 'sf_create_record':
      return sfFetch(context, `/sobjects/${args.object}`, {
        method: 'POST',
        body: JSON.stringify(args.fields),
      });
    case 'sf_update_record':
      return sfFetch(context, `/sobjects/${args.object}/${args.id}`, {
        method: 'PATCH',
        body: JSON.stringify(args.fields),
      });
    case 'sf_delete_record':
      return sfFetch(context, `/sobjects/${args.object}/${args.id}`, {
        method: 'DELETE',
      });
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 10 }, provider: 'salesforce' } satisfies McpToolExport;
