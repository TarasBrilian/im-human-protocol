# Im Human

**Privacy-Preserving Human Verification Protocol**

A decentralized identity verification system that proves humanity without revealing personal information, leveraging ZKTLS, AI-powered on-chain analysis, and encrypted storage on Walrus.

---

## Overview

Im Human solves the fundamental trilemma of digital identity systems: **How do you prove someone is a real human without exposing their identity while maintaining strong on-chain verifiability?**

The protocol operates through a multi-layer pipeline combining four critical technology pillars:
- **Zero-Knowledge Proofs** (ZKTLS Reclaim Protocol)
- **AI-Powered Behavioral Analysis** (On-chain transaction intelligence)
- **Decentralized Storage** (Walrus)
- **End-to-End Encryption** (Seal)

---

## Key Features

### 🔐 Zero-Knowledge CEX Verification
Prove you're KYC-verified on Binance without revealing your identity, email, balance, or trading history.

### 🤖 AI-Driven On-Chain Analysis
Machine learning models analyze Sui blockchain activity to detect bot-like behavior and score humanity (0-100).

### 🗄️ Encrypted Decentralized Storage
Store verification credentials on Walrus with Seal encryption, ensuring data persistence without compromising privacy.

### 🔗 Multi-Signal Verification
Combines off-chain identity attestation with on-chain behavioral analysis for defense-in-depth security.

### 🌐 Composable Credentials
Generate verifiable credentials that can be used across the Sui ecosystem for DAO governance, DeFi, gaming, and more.

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Identity Attestation** | ZKTLS Reclaim Protocol | Privacy-preserving CEX verification |
| **Blockchain** | Sui Network | Object-centric blockchain for high-performance verification |
| **AI** | Deep Neural Networks | Behavioral analysis and bot detection |
| **Storage** | Walrus | Decentralized, persistent blob storage |
| **Encryption** | Seal | End-to-end encryption for credentials |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Im Human Protocol                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │   Layer 1: CEX Verification (ZKTLS)     │
        │   • Binance KYC attestation              │
        │   • Zero-knowledge proof generation      │
        │   • No identity disclosure               │
        └──────────────┬──────────────────────────┘
                       │
                       ▼
        ┌─────────────────────────────────────────┐
        │   Layer 2: On-Chain Analysis (AI)       │
        │   • Sui wallet connection                │
        │   • Transaction graph traversal          │
        │   • ML-based humanity scoring            │
        │   • Bot pattern detection                │
        └──────────────┬──────────────────────────┘
                       │
                       ▼
        ┌─────────────────────────────────────────┐
        │   Layer 3: Storage (Walrus + Seal)      │
        │   • Credential wrapping                  │
        │   • Seal encryption                      │
        │   • Walrus blob submission               │
        │   • On-chain commitment anchoring        │
        └─────────────────────────────────────────┘
```

---

## How It Works

### Step 1: CEX Verification
1. User navigates to **CEX Verify** menu
2. System initiates ZKTLS session with Binance
3. User authenticates with their Binance account
4. Reclaim Protocol generates zero-knowledge proof of KYC verification
5. Proof is created without exposing personal data

### Step 2: Wallet Binding & On-Chain Analysis
1. User proceeds to **On-Chain Verify** menu
2. User connects Sui wallet
3. System binds wallet address with CEX proof via cryptographic signature
4. User clicks **"Analyze"** button
5. AI agent fetches complete transaction history from Sui blockchain
6. Deep learning model analyzes behavioral patterns
7. System generates humanity score (0-100)

### Step 3: Credential Storage
1. If score is satisfactory, user clicks **"Wrap to JSON"**
2. System packages verification data into structured credential
3. User clicks **"Submit to Walrus"**
4. Credential is encrypted using Seal
5. Encrypted blob is submitted to Walrus storage
6. Storage commitment is anchored on Sui blockchain

---

## Technical Deep Dive

### ZKTLS Reclaim Protocol: Privacy-Preserving Attestation

**The Problem:** Traditional oracle systems require trusted intermediaries or on-chain integrations. How do you prove data from a web2 service (like Binance) without exposing private information?

**The Solution:** ZKTLS (Zero-Knowledge Transport Layer Security) proves statements about HTTPS communications without revealing the content.

**How it Works:**
1. **TLS Session Capture:** User establishes HTTPS connection with Binance
2. **Selective Disclosure:** Reclaim Protocol allows proving specific claims (e.g., "account is KYC verified") without revealing full response payload
3. **Cryptographic Proof:** System generates ZK proof stating: "I received response from Binance's server (verified via TLS certificate chain) confirming KYC status, but I'm not disclosing my identity"
4. **On-Chain Verification:** Anyone can verify the proof on-chain without accessing original data

**Technical Advantages:**
- **Client-Side Operation:** Binance doesn't know proofs are being generated
- **No API Required:** Works with any TLS-enabled service
- **Cryptographically Sound:** Impossible to forge proofs without actual server interaction

### AI-Powered Behavioral Analysis on Sui

**Why Sui?**
Sui's object-centric model provides unprecedented granularity for behavioral analysis:
- **Object Ownership Graphs:** Track how users interact with NFTs, coins, and DeFi positions
- **Parallel Transaction Patterns:** Analyze concurrent transaction execution patterns unique to Sui
- **Sponsored Transaction Detection:** Identify automation through gas sponsorship patterns

**AI Architecture:**

**1. Deep Graph Analysis**
- Transaction graph traversal on connected Sui address
- Feature extraction across hundreds of dimensions:
  - Temporal clustering (human bursts vs. bot precision)
  - Counter-party diversity
  - Gas optimization patterns
  - Smart contract interaction complexity
  - Object interaction patterns

**2. Multi-Layer Neural Network**
- **Input Layer:** High-dimensional feature vector from transaction history
- **Hidden Layers:** Deep architecture with dropout for overfitting prevention
- **Attention Mechanism:** Focus on most indicative patterns
- **Output Layer:** Probability distribution → Human score (0-100)

**3. Adversarial Training**
Model trained not just on normal data, but adversarial examples:
- Bot operators deliberately mimicking human patterns
- Sybil networks with coordinated behavior
- Edge cases with ambiguous signals

**4. Real-Time Inference**
- Analysis completes in seconds
- Outputs score + confidence level + feature importance
- **Score 100/100** requires:
  - All features indicate human-like behavior
  - No red flags detected
  - Confidence > 98%
  - Organic diversity in transaction patterns

**Bot Detection Heuristics:**
- **Temporal Precision:** Overly regular transaction intervals
- **Value Patterns:** Mathematically identical transaction amounts
- **Contract Repetition:** Excessive focus on single contracts
- **Batch Anomalies:** Unnatural transaction batching
- **Fund Flow Loops:** Circular transaction patterns
- **Gas Optimization:** Algorithmically perfect gas price selection

### Walrus: Decentralized Storage with Economic Guarantees

**Why Walrus Over Traditional Storage?**

Traditional solutions fail for high-value credentials:
- **Centralized databases:** Single point of failure, privacy risks
- **On-chain storage:** Expensive, limited capacity
- **IPFS:** No persistence guarantees

**Walrus Architecture:**

**1. Reed-Solomon Erasure Coding**
- Data split into multiple shards
- File recoverable even if majority of shards are lost
- Redundancy without full replication

**2. Proof of Storage**
- Nodes must periodically submit cryptographic proofs
- Proofs verify they still store assigned shards
- Verifiable storage, not trust-based

**3. Economic Incentives**
- Rewards for reliable storage
- Penalties for proof failures
- Nash equilibrium favoring honest behavior

**4. Sui Integration**
- Storage commitments anchored on-chain
- Immutable ledger of storage state
- Fast finality from Sui's consensus

**Persistence Guarantee:** Data remains accessible as long as economic incentives are maintained—no reliance on altruistic pinning.

### Seal: Unconditional Privacy Through Encryption

**Encryption Architecture:**

**1. Strong Symmetric Encryption**
- AES-256 or ChaCha20 ciphers
- Computationally impossible to break

**2. User-Controlled Key Derivation**
- Encryption key derived from user's private key
- Storage nodes cannot decrypt data
- Only user has access

**3. Selective Disclosure Protocol**
- Generate view keys for specific parties
- Grant read access without full control
- Revoke keys anytime without deleting data

**4. Encrypted Metadata**
- File size, timestamps, access logs all encrypted
- Prevents metadata leakage attacks

**Privacy Flow:**
```
User → Seal Encryption → Encrypted Blob → Walrus Storage
                                                   ↓
                                         Sui On-Chain Commitment
                                                   ↓
                                    Only User Can Decrypt with Key
```

**Guarantee:** Even if Walrus nodes are compromised, data remains unreadable. True end-to-end encryption.

---

## Multi-Signal Defense in Depth

Im Human doesn't rely on a single verification method:

| Signal | What It Proves | Attack Resistance |
|--------|----------------|-------------------|
| **CEX KYC Proof** | Legal identity exists | High cost to acquire multiple verified accounts |
| **On-Chain AI Analysis** | Behavioral legitimacy | Bot patterns detectable even with legitimate accounts |

**Synergy:** Even if attacker compromises one layer (e.g., purchasing verified CEX account), they must still pass AI analysis—which requires mimicking human behavior across hundreds of transaction features.

---

## Use Cases

### DAO Governance
- Whitelist voters based on humanity score
- Prevent Sybil attacks in quadratic voting
- Weight voting power by verification confidence

### DeFi Protocols
- Offer better rates for verified humans
- Undercollateralized lending for high-score users
- Bot-resistant liquidity mining programs

### Gaming Platforms
- Anti-cheat systems that ban bot accounts
- Fair competition in play-to-earn economies
- Verified player leaderboards

### Social Networks
- Verify content creators as real humans
- Combat bot-driven engagement farming
- Authentic community building

---

## Attack Surface & Mitigations

| Attack Vector | Description | Mitigation |
|--------------|-------------|------------|
| **CEX Account Purchase** | Buy verified accounts | AI detects bot behavior regardless of account source |
| **Sybil Attack** | Create multiple accounts | High economic cost; AI correlates patterns |
| **AI Model Gaming** | Craft human-like patterns | Adversarial training; continuous model updates |
| **Storage Breach** | Compromise Walrus nodes | Seal encryption renders data unreadable |
| **Blockchain Reorg** | Consensus attacks | Sui's Narwhal+Bullshark provides fast finality |

---

## Getting Started

### Prerequisites
- Sui wallet (Sui Wallet, Suiet, or compatible)
- Verified Binance account (KYC completed)
- Active transaction history on Sui network

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/im-human.git

# Install dependencies
cd im-human
pnpm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

```

### Configuration

Set up your environment variables:
```
im-human-reclaim

# ============================================
# RECLAIM PROTOCOL CREDENTIALS (REQUIRED)
# ============================================
# Get these from: https://dev.reclaimprotocol.org
RECLAIM_APP_ID=your_app_id_here
RECLAIM_APP_SECRET=your_app_secret_here
RECLAIM_PROVIDER_ID=your_provider_id_here

# ============================================
# BINANCE API CREDENTIALS (OPTIONAL)
# ============================================
# These are ONLY needed for direct Binance API testing
# Reclaim Protocol does NOT use these - it fetches KYC through user's browser
# You can leave these empty or comment them out if you don't need direct API access
BINANCE_API_KEY=your_binance_api_key_here
BINANCE_SECRET_KEY=your_binance_secret_key_here

# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=3000
BASE_URL=http://localhost:3000
```

```
im-human-frontend
# Reclaim Protocol Backend API URL
NEXT_PUBLIC_RECLAIM_API_URL=http://localhost:3001

# BlockVision API Key for Sui blockchain data
NEXT_PUBLIC_API_KEY=xxxxxxxx
```

---

## Roadmap

- [x] ZKTLS CEX verification (Binance)
- [x] AI on-chain analysis on Sui
- [x] Walrus + Seal integration
- [ ] Multi-CEX support (Coinbase, Kraken)
- [ ] Advanced ML models with transformer architecture
- [ ] Cross-chain verification support
- [ ] Mobile app (iOS/Android)
- [ ] Developer SDK for integration


Im Human showcases how Walrus + Seal create infrastructure for next-generation identity systems that are truly decentralized, private, and verifiable.

---

## License

MIT License - see [LICENSE](LICENSE) for details

---

## Acknowledgments

- **Reclaim Protocol** for ZKTLS technology
- **Walrus Team** for decentralized storage infrastructure
- **Sui Foundation** for blockchain support

---

**Built with 🔐 by humans, verified by AI, stored on Walrus**