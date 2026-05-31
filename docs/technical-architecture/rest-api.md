---
title: REST API
---

# REST API

The MIKO REST API exposes the agent's intelligence stack over standard HTTP. Every request is authenticated with a wallet-signed JWT, and every response is JSON.

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
  "quota": {"daily_limit": 50, "remaining": 50}
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

Tier and remaining quota are returned in every response under the `X-Tier` and `X-Quota-Remaining` headers.

## Endpoints

### POST /v1/factcheck

Verify a claim through the 6-provider fact-check pipeline.

Request:

```bash
curl -X POST https://api.mikoprotocol.com/v1/factcheck \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "claim": "$BONK is launching a new validator next week",
    "context": "optional surrounding text from the original source"
  }'
```

Response:

```json
{
  "verdict": "NOT_VERIFIED",
  "confidence": 0.87,
  "evidence": [
    {
      "provider": "perplexity",
      "url": "https://...",
      "snippet": "No official $BONK announcement matches this claim..."
    },
    {
      "provider": "tavily",
      "url": "https://...",
      "snippet": "Original claim traces to an unverified account..."
    }
  ],
  "providers_consulted": 3,
  "verification_strategy": "intensive"
}
```

Verdict values: `VERIFIED`, `NOT_VERIFIED`, `INSUFFICIENT_EVIDENCE`.

### POST /v1/analyze

Analyze arbitrary text for sentiment, persuasion, and topic.

Request:

```bash
curl -X POST https://api.mikoprotocol.com/v1/analyze \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Just bought more $BONK after seeing the announcement, this is going to moon!"
  }'
```

Response:

```json
{
  "sentiment": "positive",
  "sentiment_score": 0.84,
  "persuasion_score": 0.42,
  "topic": "memecoin_speculation",
  "tickers_mentioned": ["BONK"],
  "noise_flags": []
}
```

### POST /v1/scan

Fetch on-chain overview and derived narrative facts for a Solana mint address.

Request:

```bash
curl -X POST https://api.mikoprotocol.com/v1/scan \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "mint_address": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
  }'
```

Response:

```json
{
  "mint_address": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  "symbol": "BONK",
  "price_usd": 0.000018,
  "market_cap_usd": 1240000000,
  "volume_24h_usd": 85000000,
  "narrative_facts": {
    "regime": "accumulation",
    "breakout_0_100": 67,
    "stealth_0_100": 23,
    "exhaustion_0_100": 41,
    "buy_sell_pressure_ratio": 1.32,
    "transaction_velocity_4h": 4.7,
    "holder_distribution_gini": 0.71
  }
}
```

### GET /v1/alpha

Current candidate alpha picks ranked by the selection algorithm.

```bash
curl https://api.mikoprotocol.com/v1/alpha \
  -H "Authorization: Bearer <jwt>"
```

Response:

```json
{
  "evaluated_at": "2026-05-27T12:00:00Z",
  "ml_phase": "phase_3",
  "candidates": [
    {
      "rank": 1,
      "symbol": "WIF",
      "mint_address": "...",
      "composite_score": 0.87,
      "factcheck_passed": true
    },
    {
      "rank": 2,
      "symbol": "POPCAT",
      "mint_address": "...",
      "composite_score": 0.81,
      "factcheck_passed": true
    }
  ]
}
```

### GET /v1/picks/history

Track record of weekly selections with subsequent performance.

```bash
curl "https://api.mikoprotocol.com/v1/picks/history?limit=10&offset=0" \
  -H "Authorization: Bearer <jwt>"
```

Response:

```json
{
  "picks": [
    {
      "selected_at": "2026-05-20T18:00:00Z",
      "display_symbol": "WIF",
      "mint_address": "...",
      "selection_method": "phase_3_catboost",
      "outcome_24h_change_pct": 14.3,
      "outcome_7d_change_pct": 22.1,
      "composite_outcome_score": 0.78
    },
    {
      "selected_at": "2026-05-13T18:00:00Z",
      "display_symbol": "MEW",
      "mint_address": "...",
      "selection_method": "phase_3_catboost",
      "outcome_24h_change_pct": -3.2,
      "outcome_7d_change_pct": 5.8,
      "composite_outcome_score": 0.41
    }
  ],
  "total": 26,
  "limit": 10,
  "offset": 0
}
```

## Error Responses

All errors return JSON with an `error` field and HTTP status:

```json
{
  "error": "tier_quota_exceeded",
  "message": "Daily quota of 50 reached for Holder tier",
  "retry_after": "2026-05-28T00:00:00Z"
}
```

Common errors:

| Status | Code | Meaning |
|---|---|---|
| 401 | `unauthorized` | missing or invalid JWT |
| 403 | `tier_insufficient` | tier does not have access to this endpoint |
| 429 | `quota_exceeded` | daily quota exhausted |
| 400 | `invalid_request` | malformed request body |
| 503 | `provider_unavailable` | upstream provider down, retry suggested |

## Caching

Identical requests within a 5-minute window return cached responses. Cache hits do not count against the daily quota. Response headers:

- `X-Cache: HIT` or `X-Cache: MISS`
- `X-Cache-Age: <seconds since cached>`
