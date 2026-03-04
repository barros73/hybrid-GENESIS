"use strict";
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
exports.SyncEngine = void 0;
const fs = __importStar(require("fs"));
class SyncEngine {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
    }
    syncFromMarkdown(manifestPath) {
        const content = fs.readFileSync(manifestPath, 'utf8');
        const lines = content.split('\n');
        const map = {
            project_name: "Sync Profile",
            version: "1.0",
            nodes: [],
            edges: []
        };
        let currentGoal = null;
        for (const line of lines) {
            // Match Goals: ## [Index]: [Label] or ### [Index]: [Label]
            const goalMatch = line.match(/^#{2,3}\s+([^:]+):\s+(.+)/);
            if (goalMatch) {
                const index = goalMatch[1].trim();
                const label = goalMatch[2].trim();
                const id = label.toUpperCase().replace(/\s+/g, '_').replace(/[^\w]/g, '');
                currentGoal = {
                    id,
                    index,
                    type: 'GOAL',
                    label
                };
                map.nodes.push(currentGoal);
                continue;
            }
            // Match Components: - [ ] Mission [Index]: [Label] ([Id])
            const compMatch = line.match(/^-\s*\[[ x/!]\]\s*Mission\s+([^:]+):\s+([^(]+)\(([^)]+)\)/i);
            if (compMatch && currentGoal) {
                const index = compMatch[1].trim();
                const label = compMatch[2].trim();
                const id = compMatch[3].trim();
                const node = {
                    id,
                    index,
                    type: 'COMPONENT',
                    label
                };
                map.nodes.push(node);
                // Create edge from goal to component
                map.edges.push({
                    source: currentGoal.id,
                    target: node.id,
                    direction: 'FORWARD',
                    rationale: `Mission requirement for ${currentGoal.label}`
                });
            }
        }
        return map;
    }
}
exports.SyncEngine = SyncEngine;
