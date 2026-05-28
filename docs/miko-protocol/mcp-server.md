---
title: MCP Server
---

# MCP Server

MIKO is exposed as a Model Context Protocol server. Any MCP-aware client can call MIKO's capabilities as tools directly inside its own conversation context, so a holder can pull MIKO's intelligence into Claude Desktop, Cursor, OpenAI Agents, Gemini, or any other MCP-aware workflow.

## What is MCP

MCP (Model Context Protocol) is an open protocol for connecting AI applications to external data sources and tools. An MCP server exposes a set of tools that an LLM-host client can discover and invoke during conversation. MIKO's MCP server is a thin wrapper around the same backend modules that serve the REST API.

## Server Package

```
@miko/mcp-server (npm)
```

The server runs locally via `npx`. It reads the holder's wallet JWT from an environment variable and connects to MIKO's backend. Each tool invocation goes through the same tier check and quota accounting as the REST API.

## Authentication

The MCP server requires a JWT obtained through the REST API authentication flow (see [REST API → Authentication](rest-api#authentication)).

The JWT is passed via environment variable:

```
MIKO_JWT=<wallet_signed_jwt>
```

Tier and quota are evaluated at every tool call.

## Tools

### miko.factcheck

Run a claim through the 6-provider fact-check pipeline.

```json
{
  "name": "miko.factcheck",
  "description": "Verify a factual claim against multi-source web evidence",
  "input_schema": {
    "type": "object",
    "properties": {
      "claim": { "type": "string", "description": "The claim to verify" },
      "context": { "type": "string", "description": "Optional surrounding context" }
    },
    "required": ["claim"]
  }
}
```

### miko.analyze

Sentiment, persuasion, and topic analysis of arbitrary text.

```json
{
  "name": "miko.analyze",
  "description": "Analyze text for sentiment, persuasion, topic, and mentioned tickers",
  "input_schema": {
    "type": "object",
    "properties": {
      "text": { "type": "string", "description": "The text to analyze" }
    },
    "required": ["text"]
  }
}
```

### miko.scan

Fetch on-chain overview and narrative facts for a Solana mint address.

```json
{
  "name": "miko.scan",
  "description": "Get current price, volume, and narrative facts for a Solana token",
  "input_schema": {
    "type": "object",
    "properties": {
      "mint_address": { "type": "string", "description": "Solana mint address" }
    },
    "required": ["mint_address"]
  }
}
```

### miko.alpha

Current candidate alpha picks ranked by the selection algorithm.

```json
{
  "name": "miko.alpha",
  "description": "Get current candidate alpha picks ranked by composite score",
  "input_schema": {
    "type": "object",
    "properties": {}
  }
}
```

### miko.picks_history

Weekly selection track record with 24h and 7d performance.

```json
{
  "name": "miko.picks_history",
  "description": "Get past weekly selections with their subsequent on-chain performance",
  "input_schema": {
    "type": "object",
    "properties": {
      "limit": { "type": "integer", "default": 10 },
      "offset": { "type": "integer", "default": 0 }
    }
  }
}
```

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

Claude: I'll verify this through MIKO's fact-check pipeline.
        [Tool call: miko.factcheck({"claim": "$BONK partnering with Visa next week"})]

        MIKO returned NOT_VERIFIED:
        - 3 providers consulted
        - No Visa press release, no $BONK official mention, no corroborating
          coverage
        - The original tweet traces to an unverified account

        This is noise. The claim has no corroborating sources.

User: What's $BONK actually doing on-chain right now?

Claude: [Tool call: miko.scan({"mint_address": "DezXAZ8z7..."})]

        Current snapshot:
        - Price $0.000018, MC $1.24B
        - 24h volume $85M
        - Narrative regime: accumulation
        - Breakout score 67/100, exhaustion 41/100

        Solid liquidity, accumulation regime, moderate breakout positioning.
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

Cursor: [Tool call: miko.scan({"mint_address": "..."})]

        $BONK 24h volume is $85M, market cap $1.24B. A $5K swap is roughly
        0.006% of 24h volume. Liquidity is more than sufficient for that size.
```

## Connecting from OpenAI Codex / Agents SDK

OpenAI's Agents SDK has native MCP support.

```python
from openai import OpenAI
from openai.agents import Agent, MCPServer

agent = Agent(
    model="gpt-5",
    instructions=(
        "You are a Solana research assistant. Use MIKO tools to verify claims "
        "and analyze tokens. Always run miko.factcheck before reporting any "
        "claim as fact."
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

The agent autonomously decides when to call `miko.factcheck` and `miko.scan` based on the user's query.

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
    "Scan $BONK and tell me if it's worth tracking right now"
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
    "quota_remaining": 47,
    "cache_status": "HIT"
  }
}
```
