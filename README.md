# mcp-salesforce

Salesforce MCP Pack

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `sf_query` | Execute a SOQL query against Salesforce. Returns matching records. |
| `sf_get_record` | Get a single Salesforce record by object type and ID. |
| `sf_search` | Execute a SOSL search across Salesforce objects. |
| `sf_describe` | Describe a Salesforce SObject schema — fields, relationships, metadata. |
| `sf_list_objects` | List all available Salesforce SObject types in the org. |
| `sf_create_record` | Create a new Salesforce record. |
| `sf_update_record` | Update an existing Salesforce record. |
| `sf_delete_record` | Delete a Salesforce record. |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "salesforce": {
      "url": "https://gateway.pipeworx.io/salesforce/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use salesforce
```

## License

MIT
