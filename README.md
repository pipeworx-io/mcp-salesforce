# mcp-salesforce

Salesforce MCP Pack

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1679+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `sf_query` | Query Salesforce records using SOQL. Returns matching records with all requested fields. Use sf_describe first to learn available fields for your object. |
| `sf_get_record` | Fetch a single Salesforce record by ID. Specify object type (e.g., 'Account', 'Contact', 'Opportunity') and record ID. Returns all fields. |
| `sf_search` | Search across Salesforce objects by keyword. Returns matching records from multiple object types like Accounts, Contacts, Leads. Use for broad keyword searches. |
| `sf_describe` | Get schema details for a Salesforce object (e.g., 'Account'). Returns field names, types, relationships, and metadata. Use before querying to understand available fields. |
| `sf_list_objects` | List all SObject types available in your Salesforce org. Returns object names and labels. Use to discover queryable objects. |
| `sf_create_record` | Create a new Salesforce record. Specify object type (e.g., 'Contact') and field values. Returns the new record ID. |
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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/salesforce/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1679+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

This pack runs against a connected salesforce account, so it needs a Pipeworx key: sign in at https://pipeworx.io/account, connect salesforce, then call `POST https://gateway.pipeworx.io/v1/tools/salesforce_sf_query` with `Authorization: Bearer <your Pipeworx key>`. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/salesforce_sf_query`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Standalone (no gateway account)

This package also runs as a local stdio MCP server — no Pipeworx account, no
gateway round-trip:

```json
{
  "mcpServers": {
    "salesforce": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-salesforce"]
    }
  }
}
```

Or run it directly to confirm it starts:

```bash
npx -y @pipeworx/mcp-salesforce
```

It speaks MCP over stdin/stdout and answers `initialize`/`tools/list`/`tools/call`
for **only** this pack's tools — none of the shared meta-tools the gateway
connection above adds. Same source, same tools, no ask_pipeworx routing.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Salesforce data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
