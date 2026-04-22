# mcp-salesforce

Salesforce MCP Pack

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `sf_query` | Query Salesforce records using SOQL. Returns matching records with all requested fields. Use sf_describe first to learn available fields for your object. |
| `sf_get_record` | Fetch a single Salesforce record by ID. Specify object type (e.g., \'Account\', \'Contact\', \'Opportunity\') and record ID. Returns all fields. |
| `sf_search` | Search across Salesforce objects by keyword. Returns matching records from multiple object types like Accounts, Contacts, Leads. Use for broad keyword searches. |
| `sf_describe` | Get schema details for a Salesforce object (e.g., \'Account\'). Returns field names, types, relationships, and metadata. Use before querying to understand available fields. |
| `sf_list_objects` | List all SObject types available in your Salesforce org. Returns object names and labels. Use to discover queryable objects. |
| `sf_create_record` | Create a new Salesforce record. Specify object type (e.g., \'Contact\') and field values. Returns the new record ID. |
| `sf_update_record` | Update an existing Salesforce record by ID. Specify object type and field values to change. Returns success status. |
| `sf_delete_record` | Delete a Salesforce record by ID. Specify object type and record ID. Returns success status. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "salesforce": {
      "url": "https://gateway.pipeworx.io/salesforce/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Salesforce data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
