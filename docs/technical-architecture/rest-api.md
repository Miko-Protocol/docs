---
title: REST API
---

# REST API

The MIKO REST API exposes the agent's analytical pipeline over standard HTTP. Every request is authenticated with a wallet-signed JWT, and every response is JSON.

## Base URL

```
https://api.mikoprotocol.com
```

## Authentication

Every endpoint requires a Bearer token in the `Authorization` header. The token is obtained by signing a server-issued nonce with the holder's Solana wallet.

### Step 1: Request a nonce

```bash
curl -X POST https://api.mikoprotocol.com/auth/nonce \
  -H "Content-Type: application/json" \
  -d '{"wallet": "<solana_address>"}'
```

Response:

```json
{
  "nonce": "5xKQp7vN3aB8cD2eF9gH...",
  "expires_at": "2026-05-27T12:35:00Z"
}
```

### Step 2: Sign the nonce

Sign the nonce string with the wallet's secret key.

```javascript
// JavaScript / TypeScript
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import nacl from "tweetnacl";

const message = new TextEncoder().encode(nonce);
const signature = nacl.sign.detached(message, keypair.secretKey);
const signatureB58 = bs58.encode(signature);
```

```python
# Python
from nacl.signing import SigningKey
import base58

message = nonce.encode("utf-8")
signing_key = SigningKey(secret_key)
signed = signing_key.sign(message)
signature_b58 = base58.b58encode(signed.signature).decode()
```

### Step 3: Verify and receive JWT

```bash
curl -X POST https://api.mikoprotocol.com/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "<solana_address>",
    "signature": "<base58_sig>",
    "nonce": "<nonce_from_step_1>"
  }'
```

Response:

```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIs...",
  "tier": "Holder",
  "expires_at": "2026-05-28T12:30:00Z",
  "quota": {"daily_limit": 5, "remaining": 5}
}
```

Include the JWT in every subsequent request:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Tier and Quota

The JWT is scoped to the holder's current tier. Tiers are evaluated at JWT issuance based on \$MIKO holdings.

| Tier | Holdings | Daily Limit | Per-minute Limit |
|---|---|---|---|
| Holder | ≥ \$100 | 5 requests | 1 RPM |
| Pro | ≥ \$1,000 | 100 requests | 3 RPM |
| Whale | ≥ \$2,000 | 300 requests | 10 RPM |

Wallets holding less than \$100 of \$MIKO receive `403 tier_insufficient` at `/auth/verify` and cannot obtain a JWT.

Tier and remaining quota are returned in every response under the `X-Tier` and `X-Quota-Remaining` headers.

## Endpoints

### POST /v1/factcheck

Verify a claim through MIKO's multi-provider fact-check pipeline.

Request:

```bash
curl -X POST https://api.mikoprotocol.com/v1/factcheck \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "claim": "$BONK is announcing a Visa partnership next week"
  }'
```

Response:

```json
{
  "is_verified": false,
  "verdict_summary": "No corroborating evidence for the claimed Visa partnership.",
  "reasoning": "No Visa press release matches the claim. No official $BONK channel has announced the partnership. The original post traces to an unverified account with a recent history of similar pump-and-dump claims. Independent sources do not converge on this claim."
}
```

`is_verified` is `true`, `false`, or `null` (insufficient evidence).

### POST /v1/narrative

Get MIKO's narrative read of a Solana mint address.

Request:

```bash
curl -X POST https://api.mikoprotocol.com/v1/narrative \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "mint_address": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
  }'
```

Response:

```json
{
  "symbol": "BONK",
  "mint_address": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  "market_snapshot": {
    "price_usd": 0.000018,
    "market_cap_usd": 1240000000,
    "volume_24h_usd": 85000000
  },
  "narrative_summary": "BONK is in an accumulation phase with steady buy-side pressure but limited breakout participation. Volume is elevated against the prior 24h period, but trade size shifts suggest larger wallets are accumulating quietly rather than retail driving the move.",
  "observations": [
    "Buy pressure dominant on 1h timeframe with rising trade count",
    "24h volume up roughly 40% versus prior 24h period",
    "Average trade size declining while trade count rises, consistent with distributed accumulation",
    "Price holding above the 4h high with shallow pullbacks",
    "Wallet inflow steady, no concentration warnings"
  ],
  "snapshot_at": "2026-05-27T12:00:00Z"
}
```

### POST /v1/insights

Query MIKO's knowledge graph.

Request:

```bash
curl -X POST https://api.mikoprotocol.com/v1/insights \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "BONK"
  }'
```

`query` accepts a token symbol (`"BONK"`), a mint address, or a narrative topic (`"Solana DePIN"`, `"AI agent infrastructure"`).

Response:

```json
{
  "query": "BONK",
  "insights": [
    {
      "text": "BONK community staked 1.2B tokens in the dao validator launch (Q1 2026), with no insider unlocks tied to the staking pool. Verified through the official BONK Foundation announcement and corroborating on-chain transaction data.",
      "first_observed_at": "2026-02-14T08:30:00Z",
      "last_confirmed_at": "2026-04-22T16:00:00Z",
      "related_tokens": ["BONK"],
      "fact_check": "verified"
    },
    {
      "text": "Repeated unverified claims of major exchange listings for BONK have circulated since mid-2025; none of the named exchanges (Coinbase, Kraken) have confirmed any listing through their official channels.",
      "first_observed_at": "2025-08-03T14:20:00Z",
      "last_confirmed_at": "2026-05-20T09:00:00Z",
      "related_tokens": ["BONK"],
      "fact_check": "not_required"
    }
  ],
  "total_insights": 8,
  "knowledge_freshness": "2026-05-20T09:00:00Z"
}
```

`fact_check` is one of `verified` or `not_required`.

### GET /v1/narratives/trending

Top narratives MIKO has surfaced in the requested window, ranked by importance and uniqueness.

```bash
curl "https://api.mikoprotocol.com/v1/narratives/trending?window=7d" \
  -H "Authorization: Bearer <jwt>"
```

Query parameters: `window` = `1d`, `2d`, `3d`, `4d`, `5d`, `6d`, or `7d` (default `1d`).

Response:

```json
{
  "window": "7d",
  "evaluated_at": "2026-05-27T12:00:00Z",
  "narratives": [
    {
      "summary": "AI agent frameworks and on-chain agent execution have driven sustained KOL discussion this week, anchored by OpenClaw's continued growth and new on-chain agent deployments on Solana.",
      "key_entities": ["AI agents", "OpenClaw", "on-chain agents"],
      "key_tokens": ["CLAWD", "MOLT"],
      "first_observed_at": "2026-05-20T09:00:00Z",
      "last_confirmed_at": "2026-05-27T08:00:00Z",
      "momentum": "dominant",
      "fact_check": "verified"
    },
    {
      "summary": "DePIN narrative gaining steady KOL coverage with new physical-infrastructure tokens entering trading pairs. Discussion shifting from speculative framing to use-case-driven framing.",
      "key_entities": ["DePIN", "physical infrastructure"],
      "key_tokens": ["HONEY"],
      "first_observed_at": "2026-05-22T14:30:00Z",
      "last_confirmed_at": "2026-05-27T07:00:00Z",
      "momentum": "rising",
      "fact_check": "not_required"
    },
    {
      "summary": "Memecoin discussion cooled mid-week as attention rotated toward infrastructure plays. Existing leaders held volume but new launches saw weaker KOL pickup.",
      "key_entities": ["memecoin rotation"],
      "key_tokens": ["WIF"],
      "first_observed_at": "2026-05-21T11:00:00Z",
      "last_confirmed_at": "2026-05-26T18:00:00Z",
      "momentum": "cooling",
      "fact_check": "not_required"
    }
  ]
}
```

`momentum` is one of `rising`, `dominant`, or `cooling`.

`fact_check` is one of `verified` or `not_required`.

Up to 5 narratives are returned. `key_tokens` lists token symbols only. Empty arrays are valid responses.

### GET /v1/watchlist

Tokens MIKO is currently paying close attention to, with a plain-language summary of why each token is on the list.

```bash
curl https://api.mikoprotocol.com/v1/watchlist \
  -H "Authorization: Bearer <jwt>"
```

Response:

```json
{
  "evaluated_at": "2026-05-27T12:00:00Z",
  "watching": [
    {
      "symbol": "POPCAT",
      "mint_address": "...",
      "attention_level": "rising",
      "summary": "Building KOL momentum over the last 48h with multiple independent sources flagging accumulation. Narrative anchored on a memecoin recovery wave.",
      "first_appeared_at": "2026-05-25T10:00:00Z"
    },
    {
      "symbol": "WIF",
      "mint_address": "...",
      "attention_level": "high",
      "summary": "Sustained attention across the full week with steady mention volume. Coverage tone is neutral-to-positive; no breakout catalyst surfaced yet.",
      "first_appeared_at": "2026-05-20T08:00:00Z"
    },
    {
      "symbol": "CLAWD",
      "mint_address": "...",
      "attention_level": "high",
      "summary": "Strong recurring mentions tied to AI agent narrative dominance. Multiple KOLs framing as a core position for the current rotation.",
      "first_appeared_at": "2026-05-18T11:30:00Z"
    }
  ]
}
```

`attention_level` is one of `high`, `rising`, or `steady`.

## Error Responses

All errors return JSON with an `error` field and HTTP status:

```json
{
  "error": "quota_exceeded",
  "message": "Daily quota of 5 reached for Holder tier",
  "retry_after": "2026-05-28T00:00:00Z"
}
```

Common errors:

| Status | Code | Meaning |
|---|---|---|
| 401 | `unauthorized` | missing or invalid JWT |
| 403 | `tier_insufficient` | wallet does not hold the minimum \$MIKO required to obtain a JWT, or current tier lacks access to the endpoint |
| 429 | `quota_exceeded` | daily or per-minute quota exhausted |
| 429 | `rate_limit_burst` | per-second burst cap exceeded |
| 400 | `invalid_request` | malformed request body |
| 503 | `provider_unavailable` | upstream provider unavailable, retry suggested |

## Rate Limiting

In addition to the daily and per-minute tier quotas, all endpoints have a per-wallet burst cap of 5 requests per second.

## Caching

Identical requests within a 5-minute window return cached responses. Cache hits do not count against the daily quota. Response headers:

- `X-Cache: HIT` or `X-Cache: MISS`
- `X-Cache-Age: <seconds since cached>`
