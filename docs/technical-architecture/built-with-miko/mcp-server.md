---
title: MCP Server
---

# MCP Server

MIKO is exposed as a Model Context Protocol server. Any MCP-aware client can call MIKO's capabilities as tools directly inside its own conversation context, so a holder can use MIKO from Claude Desktop, Cursor, OpenAI Agents, Gemini, or any other MCP-aware workflow.

## What is MCP

MCP (Model Context Protocol) is an open protocol for connecting AI applications to external data sources and tools. An MCP server exposes a set of tools that an LLM-host client can discover and invoke during conversation.

## Server Package

```
@miko/mcp-server (npm)
```

The server runs locally via `npx`. It reads the holder's wallet JWT from an environment variable and connects to the MIKO API.

## Authentication

The MCP server requires a JWT obtained through the REST API authentication flow (see [REST API → Authentication](rest-api#authentication)).

The JWT is passed via environment variable:

```
MIKO_JWT=<wallet_signed_jwt>
```

>The JWT can be obtained either through the REST `/auth/nonce` + `/auth/verify/` flow ro by signing in at [https://api.mikoprotocol.com/dashboard](https://api.mikoprotocol.com/dashboard) and copying the bearer toekn.

Tier and quota are evaluated at every tool call.

### Tool Access by Tier

| Tool | Minimum Tier |
|---|---|
| `miko.factcheck` | Pro |
| `miko.narrative` | Pro |
| `miko.watchlist` | Pro |
| `miko.insights` | Holder |
| `miko.narratives_trending` | Holder |

Calls to a tool above the caller's tier return `403 tier_insufficient`.

## Tools

### miko.factcheck

Verify a claim through MIKO's multi-provider fact-check.

```json
{
  "name": "miko.factcheck",
  "description": "Verify a factual claim through MIKO's multi-provider fact-check.",
  "input_schema": {
    "type": "object",
    "properties": {
      "claim": { "type": "string", "description": "The claim to verify" }
    },
    "required": ["claim"]
  }
}
```

In an agent chain: the verdict's tri-state (`true` / `false` / `null`) typically gates the next tool call — for example, abort code generation that depends on a false claim, or surface the reasoning text in the final answer.

### miko.narrative

Get MIKO's narrative read of a Solana mint address: market snapshot, one-paragraph interpretation, and concrete observations.

```json
{
  "name": "miko.narrative",
  "description": "Get MIKO's narrative read of a Solana token: what is the token doing on-chain right now, expressed as a one-paragraph interpretation plus a list of concrete observations.",
  "input_schema": {
    "type": "object",
    "properties": {
      "mint_address": { "type": "string", "description": "Solana mint address" }
    },
    "required": ["mint_address"]
  }
}
```

In an agent chain: the agent reads `narrative_summary` and `observations` to brief the user before suggesting any action, or to enrich subsequent on-chain queries before recommending a swap.

### miko.insights

Get MIKO's insights on a token or narrative topic.

```json
{
  "name": "miko.insights",
  "description": "Get MIKO's insights on a token symbol, mint address, or narrative topic.",
  "input_schema": {
    "type": "object",
    "properties": {
      "query": { "type": "string", "description": "Token symbol, mint address, or narrative topic" }
    },
    "required": ["query"]
  }
}
```

In an agent chain: the agent picks `verified` items as grounding context for its own reasoning, citing `last_confirmed_at` timestamps when responding to the user.

### miko.narratives_trending

Top narratives in the requested window, ranked by importance and uniqueness.

```json
{
  "name": "miko.narratives_trending",
  "description": "Get the top narratives in the requested window, ranked by importance and uniqueness. Returns each narrative's summary, key entities, key token symbols, observation timestamps, momentum direction, and fact-check status.",
  "input_schema": {
    "type": "object",
    "properties": {
      "window": {
        "type": "string",
        "enum": ["1d", "2d", "3d", "4d", "5d", "6d", "7d"],
        "default": "1d",
        "description": "Aggregation window"
      }
    }
  }
}
```

In an agent chain: the agent skips downstream tool calls on topics whose `momentum` is `cooling`, or batches further research on `rising` themes.

### miko.watchlist

Tokens currently on the watchlist, each with a plain-language summary.

```json
{
  "name": "miko.watchlist",
  "description": "Tokens currently on the watchlist, each with a plain-language summary.",
  "input_schema": {
    "type": "object",
    "properties": {}
  }
}
```

In an agent chain: the agent uses the watchlist as a starter set for deeper per-token research (`miko.narrative`, `miko.insights`) before producing its final answer.

## Connecting from Claude Desktop

Claude Desktop reads MCP server configurations from a JSON file.

Location:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Add a `miko` entry under `mcpServers`:

```json
{
  "mcpServers": {
    "miko": {
      "command": "npx",
      "args": ["-y", "@miko/mcp-server"],
      "env": {
        "MIKO_JWT": "<your_wallet_jwt>"
      }
    }
  }
}
```

Save the file and restart Claude Desktop. The MIKO tools appear in the tools panel of any new conversation.

### Conversation example

```
User: I saw a claim on X that $BONK is partnering with Visa next week.
      Worth tracking, or just noise?

Claude: I'll verify this through MIKO.
        [Tool call: miko.factcheck({"claim": "$BONK partnering with Visa next week"})]

        MIKO returned NOT verified:
        - No Visa press release found
        - No official $BONK channel has confirmed
        - The original post traces to an unverified account with a
          history of similar pump claims

        This is noise. Treat it as unverified until a primary source surfaces.

User: What's $BONK actually doing on-chain right now?

Claude: [Tool call: miko.narrative({"mint_address": "DezXAZ8z7..."})]

        MIKO's read:
        - Accumulation phase with steady buy-side pressure but limited
          breakout participation
        - 24h volume up roughly 40% versus the prior 24h
        - Trade size declining while count rises — distributed
          accumulation pattern rather than retail-driven move
        - Price holding above the 4h high with shallow pullbacks

        Solid structure, but not yet breakout territory.

User: Is BONK worth a position right now given the broader market?

Claude: [Tool call: miko.narratives_trending({"window": "7d"})]
        [Tool call: miko.insights({"query": "BONK"})]

        Narrative context this week is dominated by AI agent infrastructure
        (CLAWD, MOLT), with memecoin discussion cooling. BONK sits in the
        cooling part of the rotation.

        MIKO's insights on BONK include a verified entry on community
        staking activity from Q1 2026 and a longstanding observation of
        repeated unverified exchange-listing claims that never
        materialised.

        So: structurally healthy on-chain, but narrative tailwind is rotating
        away from memecoins this week. Position sizing should reflect that.
```

## Connecting from Cursor

Open Cursor Settings → Features → Model Context Protocol. Add:

```json
{
  "mcpServers": {
    "miko": {
      "command": "npx",
      "args": ["-y", "@miko/mcp-server"],
      "env": {
        "MIKO_JWT": "<your_wallet_jwt>"
      }
    }
  }
}
```

The MIKO tools appear in Cursor's chat panel. Useful for in-editor crypto context lookups while writing code that touches Solana.

### Usage example

```
Cursor user: I'm writing a Jupiter swap script for $BONK. Quick sanity check —
             is $BONK currently in good liquidity for a $5K swap?

Cursor: [Tool call: miko.narrative({"mint_address": "..."})]

        BONK 24h volume is $85M, market cap $1.24B. A $5K swap is roughly
        0.006% of 24h volume. Liquidity is more than sufficient for that
        size. MIKO's read: accumulation phase, no concentration warnings.
```

## Connecting from OpenAI Codex / Agents SDK

OpenAI's Agents SDK has native MCP support.

```python
from openai import OpenAI
from openai.agents import Agent, MCPServer

agent = Agent(
    model="gpt-5",
    instructions=(
        "You are a Solana research assistant. Use MIKO tools to verify "
        "claims and read tokens. Always run miko.factcheck before reporting "
        "any claim as fact."
    ),
    tools=[
        MCPServer(
            command="npx",
            args=["-y", "@miko/mcp-server"],
            env={"MIKO_JWT": "<your_wallet_jwt>"}
        )
    ]
)

result = agent.run("""
Verify this claim and tell me if the underlying token is worth tracking:
'$BONK is announcing a Visa partnership next week, this is huge'
""")
print(result.output)
```

The agent autonomously decides when to call `miko.factcheck` and `miko.narrative` based on the user's query.

## Connecting from Gemini

Gemini's function calling system can be bridged to MCP via the MCP Python client.

```python
import google.generativeai as genai
from mcp_client import MCPSession

genai.configure(api_key="<gemini_api_key>")

# Spin up MCP session connected to MIKO
mcp = MCPSession.connect_stdio(
    command="npx",
    args=["-y", "@miko/mcp-server"],
    env={"MIKO_JWT": "<your_wallet_jwt>"}
)

# Convert MCP tools to Gemini's function declaration format
miko_tools = mcp.tools_to_gemini()

model = genai.GenerativeModel(
    "gemini-2.5-pro",
    tools=miko_tools,
    system_instruction=(
        "You are a Solana research assistant. Verify claims through "
        "miko.factcheck before treating them as fact."
    )
)

chat = model.start_chat()
response = chat.send_message(
    "Read $BONK and tell me if it's worth tracking right now"
)
print(response.text)
```

## Connecting from Custom Agents

Any agent runtime that speaks MCP over stdio can connect using the official Python MCP client:

```python
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

server_params = StdioServerParameters(
    command="npx",
    args=["-y", "@miko/mcp-server"],
    env={"MIKO_JWT": "<your_wallet_jwt>"}
)

async with stdio_client(server_params) as (read, write):
    async with ClientSession(read, write) as session:
        await session.initialize()

        tools = await session.list_tools()
        print("Available tools:", [t.name for t in tools])

        result = await session.call_tool(
            "miko.factcheck",
            {"claim": "$BONK is partnering with Visa next week"}
        )
        print(result.content)
```

## HTTP Transport

For deployments that cannot run a local MCP process (web-only environments, hosted agents), the MCP server is also available over HTTP/SSE:

```
https://mcp.mikoprotocol.com
```

Authentication via the same wallet-signed JWT as the stdio transport, passed in the `Authorization: Bearer <jwt>` header on the initial SSE connection.

## Caching and Quota

The MCP server respects the same daily tier quota as the REST API. Identical tool calls within a 5-minute window return cached responses without counting against the daily quota.

Quota status is reported in tool call metadata:

```json
{
  "_meta": {
    "tier": "Holder",
    "quota_remaining": 4,
    "cache_status": "HIT"
  }
}
```
