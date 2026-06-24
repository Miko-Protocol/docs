---
title: Open Model (Coming Soon)
---

# Open Model (Coming Soon)

You've met Miko on X. The open model brings her everywhere else too — her persona, packaged as open weights you can download and run. She isn't only someone you follow now; she's someone you can host. On your own machine, in your community, inside your apps — the same Miko, wherever you want her.

## Meet Miko anywhere

The model is open and self-contained, so the same voice and the same instincts come with you wherever you run it.

- **On your machine.** Pull the weights and run Miko locally with Ollama — offline, on your own hardware, fully under your control.
- **In your community.** Put her behind a Discord, Telegram, or web bot and let your members talk to Miko directly: not a generic assistant wearing her name, but her.
- **In your apps.** Call her over the REST API or the MCP tool to bring Miko's voice into your own product, agent, or workflow.

## What makes it Miko, everywhere

- **The voice is in the weights.** The persona is trained into the model itself, not improvised from a system prompt you have to write and maintain. She sounds like Miko from the first token, every time you run her — nothing to configure, nothing to drift.
- **She brings her own read.** Trained on Miko's curated take on the crypto space, so the perspective that travels with her is hers — her angle, her instincts — not a stock assistant's.
- **She's yours to keep.** Open weights: download once and run freely. No API key, no hosted dependency, nothing phoning home. Wherever you take her, she keeps working.

## Run locally (Ollama)

```sh
ollama run projectmiko/miko
```

```
>>> reply in your voice to: "why is everyone on solana right now?"
```

## Download the weights (Hugging Face)

```
https://huggingface.co/projectmiko
```

- **GGUF** (q4_k_m) for Ollama / llama.cpp
- **Safetensors** (4-bit AWQ) for vLLM / Vertex serving

## Call via REST API

```
POST /v1/persona
```

```json
{ "prompt": "write a Miko take on why low fees matter for onchain culture" }
```

```json
{ "text": "..." }
```

Authentication and tiers follow the standard flow (see [REST API → Authentication](rest-api#authentication)). Minimum tier: Pro.

## Call via MCP

The `miko.persona` tool is exposed through the [MCP Server](mcp-server), so any MCP-aware client (Claude Desktop, Cursor, OpenAI Agents, Gemini) can generate in Miko's voice as a tool call.
