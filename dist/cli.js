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
const express_1 = __importDefault(require("express"));
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
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.get('/map', (req, res) => {
        const map = stateEngine.readMap();
        const conflicts = LogicValidator_1.LogicValidator.analyze(map);
        res.json({ ...map, conflicts });
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
        let markdown = `# 🗺️ Master Project Tree: ${map.project_name} (GENESIS Export)\n\n`;
        markdown += `**Status Legend:**\n`;
        markdown += `- [ ] : Empty (To start)\n`;
        markdown += `- [/] : In Progress (AI working or blocked)\n`;
        markdown += `- [X] : Finished (Code validated and tested)\n`;
        markdown += `- [!] : Error/Conflict (Architecture violation)\n\n`;
        markdown += `---\n\n`;
        markdown += `## 🏗️ Logical Block Architecture (Logical Tree)\n`;
        markdown += `root (${map.project_name})\n`;
        // Generate Logical Tree from GAOLS and COMPONENTS
        const goals = map.nodes.filter(n => n.type === 'GOAL');
        goals.forEach((goal, gIdx) => {
            const isLastGoal = gIdx === goals.length - 1;
            markdown += `${isLastGoal ? '└──' : '├──'} [ ] ${goal.id}: ${goal.label}\n`;
            const children = map.edges
                .filter(e => e.source === goal.id)
                .map(e => map.nodes.find(n => n.id === e.target))
                .filter(n => n && (n.type === 'COMPONENT' || n.type === 'CONSTRAINT'));
            children.forEach((child, cIdx) => {
                const isLastChild = cIdx === children.length - 1;
                const prefix = isLastGoal ? '    ' : '│   ';
                markdown += `${prefix}${isLastChild ? '└──' : '├──'} [ ] ${child?.id}: ${child?.label}\n`;
            });
        });
        markdown += `\n---\n\n`;
        markdown += `## 📝 Detailed Checklist by Chapters (Action Tree)\n\n`;
        goals.forEach((goal, idx) => {
            markdown += `### Chapter ${idx + 1}: ${goal.label}\n`;
            markdown += `- [ ] INITIALIZE: Setup foundations for ${goal.id}.\n`;
            const targets = map.edges.filter(e => e.source === goal.id);
            targets.forEach(t => {
                const node = map.nodes.find(n => n.id === t.target);
                if (node) {
                    markdown += `- [ ] IMPLEMENT: ${node.label} (${node.id})\n`;
                    markdown += `  > Rationale: ${t.rationale}\n`;
                }
            });
            markdown += `\n`;
        });
        markdown += `---\n\n`;
        markdown += `## 🤖 AI Context Instructions\n`;
        markdown += `1. **Priority:** Jules, always work on the first \`[/]\` node starting from the top.\n`;
        markdown += `2. **Update:** Whenever you complete a node, change the state from \`[/]\` to \`[X]\`.\n`;
        markdown += `3. **Block:** If you find an architectural conflict \`[!]\`, stop and report.\n`;
        const outputPath = path.join(workspaceRoot, 'GENESIS_EXPORT_TREE.md');
        fs.writeFileSync(outputPath, markdown);
        console.log(`✅ Export complete: ${outputPath}`);
    }
    else {
        console.error(`❌ Unsupported target: ${options.target}`);
    }
});
program.parse(process.argv);
