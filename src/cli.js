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
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const StateEngine_1 = require("./core/StateEngine");
const express = __importStar(require("express"));
const program = new commander_1.Command();
const workspaceRoot = process.cwd();
const stateEngine = new StateEngine_1.StateEngine(workspaceRoot);
program
    .name('hybrid-genesis')
    .description('Layer 0 of the Hybrid Ecosystem: Spatial Architecture Planning')
    .version('1.0.0');
program
    .command('start')
    .description('Start the GENESIS daemon and local API server')
    .option('-p, --port <number>', 'Port to run the server on', '3000')
    .action((options) => {
    const port = parseInt(options.port);
    console.log(`🌌 hybrid-GENESIS: Starting Daemon on port ${port}...`);
    const app = express();
    app.use(express.json());
    app.get('/map', (req, res) => {
        res.json(stateEngine.readMap());
    });
    app.post('/node', (req, res) => {
        try {
            stateEngine.addNode(req.body);
            res.status(201).json({ status: 'OK' });
        }
        catch (e) {
            res.status(400).json({ error: e.message });
        }
    });
    app.post('/edge', (req, res) => {
        try {
            stateEngine.addEdge(req.body);
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
program
    .command('export')
    .description('Flatten the 3D graph into a linear Markdown checklist')
    .option('--target <type>', 'Export target (e.g., tree)', 'tree')
    .action((options) => {
    console.log(`📤 hybrid-GENESIS: Exporting graph to ${options.target} format...`);
    const map = stateEngine.readMap();
    if (options.target === 'tree') {
        let markdown = `# 🌲 Hybrid-TREE Checklist (Generated from GENESIS)\n\n`;
        // Basic BFS/DFS style flattening
        markdown += `## 🎯 Goals\n`;
        map.nodes.filter(n => n.type === 'GOAL').forEach(n => {
            markdown += `- [ ] ${n.label}\n`;
            // Find connected components
            const constraints = map.edges
                .filter(e => e.source === n.id)
                .map(e => ({ edge: e, node: map.nodes.find(node => node.id === e.target) }))
                .filter(x => x.node?.type === 'CONSTRAINT');
            constraints.forEach(c => {
                markdown += `  - [ ] CONSTRAINT: ${c.node?.label}\n`;
                markdown += `    > Rationale: ${c.edge.rationale}\n`;
            });
        });
        const outputPath = path.join(workspaceRoot, 'GENESIS_EXPORT_TREE.md');
        fs.writeFileSync(outputPath, markdown);
        console.log(`✅ Export complete: ${outputPath}`);
    }
    else {
        console.error(`❌ Unsupported target: ${options.target}`);
    }
});
program.parse(process.argv);
//# sourceMappingURL=cli.js.map