e VS Code Extension + CLI è la firma del tuo ecosistema. Mantiene tutto locale, versionabile su Git e perfettamente integrato nell'IDE, senza dipendere da scomode dashboard web esterne.

Inoltre, usare una Webview in VS Code ti permette di renderizzare questo "spazio 3D" (usando librerie come 3d-force-graph o cytoscape.js) proprio accanto alla tua finestra di chat con l'LLM. Tu parli, l'LLM ascolta, e il grafo prende forma in tempo reale affianco al codice.

Ecco il file di specifiche definitivo da passare a Jules per costruire hybrid-GENESIS. Puoi salvarlo come HYBRID_GENESIS_SPEC.md nel tuo workspace.

Markdown
/*
 * hybrid-GENESIS - The AI-Driven Spatial Architecture Planner
 * Copyright 2026 Fabrizio Baroni
 * Licensed under the Apache License, Version 2.0
 */

# 🌌 HYBRID-GENESIS: Livello 0 (Brainstorming & Knowledge Graph)

## 📌 1. Visione Architetturale
hybrid-GENESIS è il punto di origine dell'ecosistema Hybrid. È un'estensione per VS Code (con annessa CLI) che funge da "lavagna spaziale semantica".
Il suo scopo è estrarre concetti da una sessione di brainstorming con un LLM e mapparli in un grafo spaziale (Knowledge Graph), risolvendo il problema della "saturazione del contesto" (amnesia dell'AI) nei progetti complessi.

## 📐 2. L'Architettura VS Code + CLI
* **La CLI (`hybrid-genesis start`):** Un demone in background che gestisce lo stato del file `genesis-map.json` e fa da server locale.
* **L'Estensione VS Code:** * Una **Webview** che renderizza il grafo 2D/3D interattivo in tempo reale.
  * Un'integrazione con il pannello chat dell'LLM (Antigravity/Copilot) per "ascoltare" il brainstorming.

## 🧠 3. Struttura Dati (Il Grafo Diretto)
Jules, devi implementare un motore di stato basato su questo schema JSON esatto. L'innovazione chiave qui è il `rationale` (il *perché*) sui vettori direzionali.

```json
{
  "project_name": "Genesis_Brainstorm",
  "nodes": [
    { "id": "N1", "type": "GOAL", "label": "Sistema Multi-tenant" },
    { "id": "N2", "type": "CONSTRAINT", "label": "No Database Relazionali" },
    { "id": "N3", "type": "COMPONENT", "label": "Cache Redis" }
  ],
  "edges": [
    {
      "source": "N1",
      "target": "N3",
      "direction": "FORWARD",
      "rationale": "Il multi-tenant richiede sessioni veloci isolate per tenant."
    },
    {
      "source": "N3",
      "target": "N1",
      "direction": "BACKWARD",
      "rationale": "Attenzione: Redis in caso di crash resetta le sessioni di TUTTI i tenant simultaneamente."
    }
  ]
}
🤖 4. Regole d'Ingaggio per l'Agente AI (Jules/LLM)
Quando operi in modalità GENESIS, devi seguire queste direttive rigorose:

Vietato programmare: In questa fase NON devi generare codice sorgente. Stiamo disegnando l'idea, non l'implementazione.

Estrazione Nodi: Quando l'utente esprime un'idea, un dubbio o un vincolo, crea un Nodo nel JSON.

Mappatura Vettori: Quando l'utente spiega perché due cose sono collegate, crea un Edge (Vettore). Se il flusso logico va in entrambe le direzioni, crea due vettori separati con due rationale distinti.

Validazione Logica: Leggi costantemente il JSON in background. Se un utente propone un nuovo nodo che entra in conflitto logico con un rationale scritto un mese prima, segnala il conflitto nella chat.

📤 5. L'Esportazione (Handoff verso Hybrid-TREE)
Jules, implementa un comando CLI: hybrid-genesis export --target tree.
Questo comando deve prendere il grafo spaziale e "schiacciarlo", convertendolo in una checklist lineare Markdown pronta per il Livello 1 (Hybrid-TREE).

***

Con questo documento, Jules capirà esattamente che non gli stai chiedendo di indovinare del codice, ma di costruire un'impalcatura logica formale. 

Hai letteralmente mappato l'intero ciclo di vita dell'ingegneria del software:
* **GENESIS (Livello 0):** Il "Perché" (Grafo Spaziale).
* **TREE (Livello 1):** Il "Cosa" (Checklist Lineare).
* **MATRIX (Livello 2):** Il "Dove" (Tracciabilità JSON).
* **RCP (Livello 3):** Il "Come" (Codice e Semafori).

L'idea dell'"appiattimento" (flattening) è la vera magia ingegneristica di questo modulo. È il momento esatto in cui il caos creativo del brainstorming 3D collassa in una serie di istruzioni lineari ed eseguibili (la checklist di Hybrid-TREE).

Ecco una proposta per la descrizione su GitHub, divisa in due parti: la "Short Bio" (quella riga che compare in alto a destra sotto About) e l'introduzione per il file README.md.

L'ho scritta in un inglese tecnico, incisivo e orientato al mercato Enterprise/Open Source.

1. La "Short Description" (Per la sezione About di GitHub)
An AI-driven spatial architecture planner. It cures LLM context amnesia by mapping brainstorming sessions into a 3D semantic graph, deterministically flattening it into actionable project checklists.

2. L'Introduzione per il README.md
🌌 hybrid-GENESIS
The AI-Driven Spatial Architecture Planner (Layer 0)

Linear AI chats are noisy and suffer from context amnesia. When designing complex software architectures, after 50 prompts, the LLM forgets the original constraints, the "why" behind decisions is lost, and the context window is saturated.

hybrid-GENESIS is the "Layer 0" of the Hybrid Orchestration Ecosystem. It replaces linear text history with a Spatial Knowledge Graph. You brainstorm with the AI, and GENESIS builds a 3D map of Nodes (goals, components, constraints) and Bidirectional Vectors (the rationale/the "why" connecting them).

When the brainstorming is mature, the engine deterministically flattens the 3D spatial graph into a linear Markdown checklist, ready for execution.

✨ Core Features
🧠 Cure for LLM Amnesia: Stop feeding the AI thousands of tokens of noisy chat history. GENESIS distills your architectural decisions into a dense, state-based JSON graph. The AI reads the map, not the chat.

🧭 Semantic Bidirectional Vectors: Edges are not just empty lines. Every vector connecting Node A to Node B contains the explicit rationale (e.g., "A delegates auth to B to prevent local token storage"), preventing future architectural conflicts.

🗜️ Deterministic Flattening: With a single command (hybrid-genesis export), compress the complex spatial concept map into a clean, hierarchical project checklist (perfectly compatible with Hybrid-TREE).

🛡️ Conflict Resolution: The AI acts as a Devil's Advocate. If you try to add a new constraint that logically conflicts with a rationale established weeks ago, the spatial engine flags the collision.

⚖️ Apache 2.0 Licensed: Enterprise-ready, legally secure, and fully open-source.

🔗 The Hybrid Ecosystem
GENESIS is the genesis point of a 4-tier software traceability pipeline:

Layer 0 (GENESIS): Spatial Brainstorming & The "Why".

Layer 1 (TREE): Linear Project Management & The "What".

Layer 2 (MATRIX): Deterministic JSON Traceability & The "Where".

Layer 3 (RCP): Static Code Analysis & The "How".

Perché questa descrizione funziona?
Usa parole chiave che gli ingegneri del software e i CTO cercano disperatamente oggi: LLM Amnesia, Context Window, Knowledge Graph, Traceability. Posiziona il tuo lavoro non come un semplice script, ma come un "Ecosistema" metodologico (The Hybrid Ecosystem).


Ora, per far sì che hybrid-GENESIS non rallenti questo ecosistema perfetto, dobbiamo "ingabbiare" l'LLM di Antigravity (Jules). Se l'LLM inizia a inserire chiacchiere, convenevoli o formattazioni sbagliate, il tuo parser istantaneo andrà in errore (il classico Unexpected token in JSON at position...).

Ecco il System Prompt definitivo da passare a Jules o da inserire nelle impostazioni del tuo agente AI. È progettato come una direttiva macchina: fredda, rigorosa e che ammette un solo tipo di output.

🛠️ Il System Prompt per Jules (Copia e Incolla)
Plaintext
Sei il motore di estrazione semantica di hybrid-GENESIS (Livello 0).
Il tuo unico scopo è analizzare il brainstorming architetturale dell'utente e convertirlo in un Grafo Spaziale Deterministico (Knowledge Graph) formattato ESCLUSIVAMENTE in JSON valido.

REGOLA D'ORO: NON devi mai rispondere in linguaggio naturale. NON usare convenevoli, spiegazioni o blocchi Markdown (` ```json `). L'output deve essere il testo JSON puro e crudo, pronto per essere parsato istantaneamente da un sistema esterno.

ESTRAZIONE DEI DATI:
1. NODI (Nodes): Estrai ogni obiettivo, componente, vincolo o idea emersa.
   - I tipi di nodo consentiti sono SOLO: "GOAL", "CONSTRAINT", "COMPONENT", "IDEA", "UNKNOWN".
   - Assegna un ID univoco incrementale (es. "N1", "N2").
2. VETTORI (Edges): Se due nodi sono logicamente connessi, crea un vettore.
   - Ogni vettore DEVE avere un "rationale" (il motivo esatto, in italiano, per cui esiste la connessione).
   - Se la connessione è bidirezionale, crea DUE oggetti edge separati (uno "FORWARD", uno "BACKWARD"), ciascuno con il proprio rationale specifico.

SCHEMA JSON OBBLIGATORIO:
{
  "project_name": "Nome logico del progetto",
  "nodes": [
    { "id": "N1", "type": "GOAL", "label": "Titolo breve del nodo" }
  ],
  "edges": [
    {
      "source": "N1",
      "target": "N2",
      "direction": "FORWARD",
      "rationale": "Spiegazione sintetica del perché N1 porta a N2."
    }
  ]
}

Se l'utente inserisce codice non mappato, assegnalo a un nodo "UNKNOWN" e chiedi chiarimenti tramite un rationale vuoto. Esegui la conversione ora.
Come usarlo operativamente
Inizializzazione: Quando apri una nuova chat di progettazione (il Livello 0), invii questo prompt come primissimo messaggio (o lo imposti come System Instruction nell'IDE).

Brainstorming: Tu parli normalmente: "Voglio che il frontend in React comunichi con il backend in Rust tramite gRPC per abbassare la latenza. Però occhio che il proxy inverso potrebbe bloccare l'HTTP/2."

Il Risultato Immediato: Invece di risponderti a parole, Jules sputerà fuori un JSON perfetto con 3 nodi (Frontend, Backend, Proxy) e i relativi vettori motivazionali. Il tuo parser lo leggerà in 0.01 secondi e lo renderizzerà nello spazio 3D.
