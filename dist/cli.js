#!/usr/bin/env node
"use strict";
/*
 * hybrid-GENESIS - The AI-Driven Spatial Architecture Planner
 * Copyright 2026 Fabrizio Baroni
 * Licensed under the Apache License, Version 2.0
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const StateEngine_1 = require("./core/StateEngine");
const LogicValidator_1 = require("./core/LogicValidator");
const SyncEngine_1 = require("./core/SyncEngine");
const express_1 = __importDefault(require("express"));
const program = new commander_1.Command();
const workspaceRoot = process.cwd();
const stateEngine = new StateEngine_1.StateEngine(workspaceRoot);
program
    .name('hybrid-genesis')
    .description('Layer 0 of the Hybrid Ecosystem: Spatial Architecture Planning')
    .version('0.6.2');
program
    .command('start')
    .description('Start the GENESIS daemon and local API server')
    .option('-p, --port <number>', 'Port to run the server on', '3000')
    .action((options) => {
    const port = parseInt(options.port);
    console.log(`🌌 hybrid-GENESIS: Starting Daemon on port ${port}...`);
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    // Simple CORS middleware
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        }
        else {
            next();
        }
    });
    app.get('/', (req, res) => {
        res.send('🌌 hybrid-GENESIS Daemon is active. Use the VS Code extension to view the 3D graph.');
    });
    app.get('/health', (req, res) => {
        res.json({ status: 'UP', timestamp: new Date().toISOString() });
    });
    app.get('/map', (req, res) => {
        const map = stateEngine.readMap();
        const conflicts = LogicValidator_1.LogicValidator.analyze(map);
        res.json({ ...map, conflicts });
    });
    app.post('/node', (req, res) => {
        try {
            stateEngine.addNode(req.body);
            generateMarkdownExport();
            res.status(201).json({ status: 'OK' });
        }
        catch (e) {
            res.status(400).json({ error: e.message });
        }
    });
    app.post('/edge', (req, res) => {
        try {
            stateEngine.addEdge(req.body);
            generateMarkdownExport();
            res.status(201).json({ status: 'OK' });
        }
        catch (e) {
            res.status(400).json({ error: e.message });
        }
    });
    app.listen(port, () => {
        console.log(`✅ Daemon active at http://localhost:${port}`);
        console.log(`Watching: ${path.join(workspaceRoot, '.hybrid', 'genesis-map.json')}`);
    });
});
function appendLog(command, message) {
    const hybridDir = path.join(workspaceRoot, '.hybrid');
    if (!fs.existsSync(hybridDir))
        fs.mkdirSync(hybridDir, { recursive: true });
    const logPath = path.join(hybridDir, 'genesis-report.log');
    const timestampedOutput = `[${new Date().toISOString()}] COMMAND: ${command}\n${message.trim()}\n\n`;
    fs.appendFileSync(logPath, timestampedOutput);
}
function generateMarkdownExport(aiFormat = false) {
    const map = stateEngine.readMap();
    let markdown = `# 🗺️ Master Project Tree: ${map.project_name} (GENESIS Export)\n\n`;
    markdown += `**Status Legend:**\n`;
    markdown += `- [ ] : Empty (To start)\n`;
    markdown += `- [/] : In Progress (AI working or blocked)\n`;
    markdown += `- [X] : Finished (Code validated and tested)\n`;
    markdown += `- [!] : Error/Conflict (Architecture violation)\n\n`;
    markdown += `---\n\n`;
    markdown += `## 🏗️ Logical Block Architecture (Logical Tree)\n`;
    markdown += `root (${map.project_name})\n`;
    // Generate Logical Tree from GOALS and COMPONENTS
    const goals = map.nodes.filter(n => n.type === 'GOAL');
    goals.sort((a, b) => a.index.localeCompare(b.index));
    goals.forEach((goal, gIdx) => {
        const isLastGoal = gIdx === goals.length - 1;
        markdown += `${isLastGoal ? '└──' : '├──'} [ ] ${goal.index}: ${goal.label}\n`;
        const children = map.edges
            .filter(e => e.source === goal.id)
            .map(e => map.nodes.find(n => n.id === e.target))
            .filter(n => n && (n.type === 'COMPONENT' || n.type === 'CONSTRAINT'));
        children.sort((a, b) => a.index.localeCompare(b.index));
        children.forEach((child, cIdx) => {
            const isLastChild = cIdx === children.length - 1;
            const prefix = isLastGoal ? '    ' : '│   ';
            markdown += `${prefix}${isLastChild ? '└──' : '├──'} [ ] ${child.index}: ${child.label}\n`;
        });
    });
    markdown += `\n---\n\n`;
    markdown += `## 📝 Detailed Checklist by Chapters (Action Tree)\n\n`;
    goals.forEach((goal) => {
        markdown += `### Chapter ${goal.index}: ${goal.label}\n`;
        if (goal.description)
            markdown += `> ${goal.description}\n`;
        markdown += `- [ ] INITIALIZE: Setup foundations for ${goal.id}.\n`;
        const targets = map.edges.filter(e => e.source === goal.id);
        const children = targets
            .map(t => ({ target: t, node: map.nodes.find(n => n.id === t.target) }))
            .filter(x => x.node);
        children.sort((a, b) => a.node.index.localeCompare(a.node.index));
        children.forEach(c => {
            const node = c.node;
            const edge = c.target;
            markdown += `- [ ] Mission ${node.index}: ${node.label} (${node.id})\n`;
            if (node.description)
                markdown += `  > ${node.description}\n`;
            markdown += `  > Rationale: ${edge.rationale}\n`;
        });
        markdown += `\n`;
    });
    markdown += `---\n\n`;
    markdown += `## 🤖 AI Context Instructions\n`;
    markdown += `1. **Priority:** Jules, always work on the first \`[/]\` node starting from the top.\n`;
    markdown += `2. **Update:** Whenever you complete a node, change the state from \`[/]\` to \`[X]\`.\n`;
    markdown += `3. **Block:** If you find an architectural conflict \`[!]\`, stop and report.\n`;
    const hybridDir = path.join(workspaceRoot, '.hybrid');
    if (!fs.existsSync(hybridDir)) {
        fs.mkdirSync(hybridDir, { recursive: true });
    }
    const outputPath = path.join(hybridDir, 'GENESIS_EXPORT_TREE.md');
    fs.writeFileSync(outputPath, markdown);
    if (aiFormat) {
        const out = JSON.stringify({ status: 'success', path: outputPath, goals_count: goals.length });
        console.log(out);
        appendLog('export', out);
    }
    else {
        const msg = `✅ Export complete: ${outputPath}. Goals processed: ${goals.length}`;
        console.log(msg);
        appendLog('export', msg);
    }
}
program
    .command('export')
    .description('Flatten the 3D graph into a linear Markdown checklist')
    .option('--target <type>', 'Export target (e.g., tree)', 'tree')
    .option('--ai-format', 'Output in machine-readable JSON format')
    .action((options) => {
    const aiFormat = options.aiFormat;
    if (!aiFormat)
        console.log(`📤 hybrid-GENESIS: Exporting graph to ${options.target} format...`);
    const map = stateEngine.readMap();
    if (options.target === 'tree') {
        generateMarkdownExport(aiFormat);
    }
    else {
        if (aiFormat)
            console.log(JSON.stringify({ error: `Unsupported target: ${options.target}` }));
        else
            console.error(`❌ Unsupported target: ${options.target}`);
    }
});
program
    .command('sync')
    .description('Ingest existing Markdown manifest into the spatial map')
    .option('--manifest <path>', 'Path to the manifest file (e.g., MASTER_PROJECT_TREE.md)', 'MASTER_PROJECT_TREE.md')
    .option('--ai-format', 'Output in machine-readable JSON format')
    .action((options) => {
    const aiFormat = options.aiFormat;
    const manifestPath = path.isAbsolute(options.manifest) ? options.manifest : path.join(workspaceRoot, options.manifest);
    if (!aiFormat)
        console.log(`🔄 hybrid-GENESIS: Syncing from ${options.manifest}...`);
    if (!fs.existsSync(manifestPath)) {
        if (aiFormat)
            console.log(JSON.stringify({ error: `Manifest not found: ${manifestPath}` }));
        else
            console.error(`❌ Error: Manifest not found at ${manifestPath}`);
        process.exit(1);
    }
    const syncEngine = new SyncEngine_1.SyncEngine(workspaceRoot);
    const map = syncEngine.syncFromMarkdown(manifestPath);
    stateEngine.saveMap(map);
    if (aiFormat) {
        console.log(JSON.stringify({ status: 'success', nodes_count: map.nodes.length, edges_count: map.edges.length }));
    }
    else {
        console.log(`✅ Sync complete. Ingested ${map.nodes.length} nodes and ${map.edges.length} edges.`);
    }
});
program.parse(process.argv);
