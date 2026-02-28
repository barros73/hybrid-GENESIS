# 🌌 hybrid-GENESIS

### The AI-Driven Spatial Architecture Planner (Layer 0)

Linear AI chats are noisy and suffer from context amnesia. When designing complex software architectures, after 50 prompts, the LLM forgets the original constraints, the "why" behind decisions is lost, and the context window is saturated.

**hybrid-GENESIS** is the "Layer 0" of the Hybrid Orchestration Ecosystem. It replaces linear text history with a **Spatial Knowledge Graph**. You brainstorm with the AI, and GENESIS builds a 3D map of Nodes (goals, components, constraints) and Bidirectional Vectors (the rationale/the "why" connecting them).

When the brainstorming is mature, the engine deterministically flattens the 3D spatial graph into a linear Markdown checklist, ready for execution in Level 1 (**hybrid-TREE**).

---

## ✨ Core Features

- 🧠 **Cure for LLM Amnesia**: Stop feeding the AI thousands of tokens of noisy chat history. GENESIS distills your architectural decisions into a dense, state-based JSON graph. The AI reads the map, not the chat.
- 🧭 **Semantic Bidirectional Vectors**: Edges are not just empty lines. Every vector connecting Node A to Node B contains the explicit rationale, preventing future architectural conflicts.
- 🗜️ **Deterministic Flattening**: With a single command (`hybrid-genesis export`), compress the complex spatial concept map into a clean, hierarchical project checklist.
- 🛡️ **Conflict Resolution**: The AI acts as a Devil's Advocate. If you try to add a new constraint that logically conflicts with a rationale established weeks ago, the spatial engine flags the collision.
- ⚖️ **Apache 2.0 Licensed**: Enterprise-ready, legally secure, and fully open-source.

---

## 🏁 Getting Started

### Prerequisites
Before installing, ensure you have the following ready:
- **Node.js**: Version 16.x or higher.
- **npm**: Standard Node package manager.
- **VS Code**: To use the architectural visualization extension.

### 🚀 Quick Installation
For a fully automated setup of the entire Hybrid ecosystem, run:
```bash
curl -sSL https://raw.githubusercontent.com/barros73/hybrid-BIM/main/install.sh | bash
```
*(Or run `bash install.sh` if you have the repository cloned locally).*

## 🛠️ Usage & CLI Reference

This node executable operates as the master orchestrator for Layer 0.

### Global Options
All commands support the hidden `--ai-format` flag. When appended, it suppresses human-readable console outputs (emojis and prose) to return strictly pure JSON payloads. This is essential for chaining inputs into LLM Agents and pipeline automation.

### `hybrid-genesis start`
Starts a persistent background daemon that exposes local HTTP endpoints to build your architectural graph dynamically.

**Options:**
- `-p, --port <number>`: Port for the local API server (Default: `3000`).

**Detailed Behavior:**
- The daemon waits for `POST /node` and `POST /edge` payloads to build logical components and the rationale vectors connecting them.
- Any mutation automatically streams to `.hybrid/genesis-map.json` ensuring no context is lost.
- Upon significant changes, it automatically triggers a flattening export.

**Example:**
```bash
hybrid-genesis start --port 4000
```

### `hybrid-genesis export`
Takes the 3D semantic graph database (`genesis-map.json`) and deterministically flattens it down to a 2D Action Checklist. 

**Options:**
- `--target <type>`: Identifies the target framework (Use `tree`).
- `--ai-format`: Outputs as `{ "status": "success", "path": "...", "goals_count": 4 }`.

**Detailed Behavior:**
- Produces a fully actionable `GENESIS_EXPORT_TREE.md` located inside `.hybrid/`.
- The Markdown is pre-formatted with actionable states (`[ ]`, `[/]`, `[X]`), nested component scopes, and embedded architecture rationales ready to be ingested by Layer 1 (TREE).

**Example:**
```bash
hybrid-genesis export --target tree --ai-format
```

---

## 📜 Global Ecosystem Logging
To safeguard against traceability losses in complex pipelines, `hybrid-GENESIS` records every CLI execution into a persistent audit history file.

All operations, payload summaries, and state mutations are automatically appended tracking absolute timestamps:
**`📁 .hybrid/genesis-report.log`**

*This enables humans or sub-agents to trace back the exact command timeline during Brownfield integrations or debugging sessions.*

---

## 🔗 The Hybrid Ecosystem

GENESIS is the genesis point of a 4-tier software traceability pipeline:

1.  **Layer 0 (GENESIS)**: `export` (Spatial Brainstorming & Intent).
2.  **Layer 1 (TREE)**: `consolidate` (Linear Logic & Checkpoints).
3.  **Layer 3 (RCP)**: `export-structure` (Static Analysis & Reality).
4.  **Layer 2 (MATRIX)**: `connect` & `bridge` (Traceability & Next Best Action).

---
*Copyright 2026 Fabrizio Baroni. Licensed under the Apache License, Version 2.0.*
