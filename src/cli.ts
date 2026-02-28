#!/usr/bin/env node
/*
 * hybrid-GENESIS - The AI-Driven Spatial Architecture Planner
 * Copyright 2026 Fabrizio Baroni
 * Licensed under the Apache License, Version 2.0
 */

import { Command } from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import { StateEngine } from './core/StateEngine';
import { LogicValidator } from './core/LogicValidator';
import express, { Request, Response } from 'express';

const program = new Command();
const workspaceRoot = process.cwd();
const stateEngine = new StateEngine(workspaceRoot);

program
    .name('hybrid-genesis')
    .description('Layer 0 of the Hybrid Ecosystem: Spatial Architecture Planning')
    .version('0.5.0');

program
    .command('start')
    .description('Start the GENESIS daemon and local API server')
    .option('-p, --port <number>', 'Port to run the server on', '3000')
    .action((options) => {
        const port = parseInt(options.port);
        console.log(`🌌 hybrid-GENESIS: Starting Daemon on port ${port}...`);

        const app = express();
        app.use(express.json());

        app.get('/map', (req: Request, res: Response) => {
            const map = stateEngine.readMap();
            const conflicts = LogicValidator.analyze(map);
            res.json({ ...map, conflicts });
        });

        app.post('/node', (req: Request, res: Response) => {
            try {
                stateEngine.addNode(req.body);
                generateMarkdownExport();
                res.status(201).json({ status: 'OK' });
            } catch (e: any) {
                res.status(400).json({ error: e.message });
            }
        });

        app.post('/edge', (req: Request, res: Response) => {
            try {
                stateEngine.addEdge(req.body);
                generateMarkdownExport();
                res.status(201).json({ status: 'OK' });
            } catch (e: any) {
                res.status(400).json({ error: e.message });
            }
        });

        app.listen(port, () => {
            console.log(`✅ Daemon active at http://localhost:${port}`);
            console.log(`Watching: ${path.join(workspaceRoot, '.hybrid', 'genesis-map.json')}`);
        });
    });

function appendLog(command: string, message: string): void {
    const hybridDir = path.join(workspaceRoot, '.hybrid');
    if (!fs.existsSync(hybridDir)) fs.mkdirSync(hybridDir, { recursive: true });
    const logPath = path.join(hybridDir, 'genesis-report.log');
    const timestampedOutput = `[${new Date().toISOString()}] COMMAND: ${command}\n${message.trim()}\n\n`;
    fs.appendFileSync(logPath, timestampedOutput);
}

function generateMarkdownExport(aiFormat: boolean = false): void {
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
    } else {
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
        if (!aiFormat) console.log(`📤 hybrid-GENESIS: Exporting graph to ${options.target} format...`);
        const map = stateEngine.readMap();

        if (options.target === 'tree') {
            generateMarkdownExport(aiFormat);
        } else {
            if (aiFormat) console.log(JSON.stringify({ error: `Unsupported target: ${options.target}` }));
            else console.error(`❌ Unsupported target: ${options.target}`);
        }
    });

program.parse(process.argv);
