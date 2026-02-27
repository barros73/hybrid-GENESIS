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

## 🛠️ Usage

### Manual Installation
```bash
npm install -g .
```

### Start the Daemon
```bash
hybrid-genesis start
```
Runs the background orchestrator and local API server (default port 3000).

### Export to TREE
```bash
hybrid-genesis export --target tree
```
Generates `GENESIS_EXPORT_TREE.md` for handoff to **hybrid-TREE**.

---

## 🔗 The Hybrid Ecosystem

GENESIS is the genesis point of a 4-tier software traceability pipeline:

1.  **Layer 0 (GENESIS)**: Spatial Brainstorming & The "Why".
2.  **Layer 1 (TREE)**: Linear Project Management & The "What".
3.  **Layer 2 (MATRIX)**: Deterministic JSON Traceability & The "Where".
4.  **Layer 3 (RCP)**: Static Code Analysis & The "How".

---
*Copyright 2026 Fabrizio Baroni. Licensed under the Apache License, Version 2.0.*
