import * as fs from 'fs';
import { GenesisMap, GenesisNode, GenesisEdge } from './types';

export class SyncEngine {
    constructor(private workspaceRoot: string) { }

    public syncFromMarkdown(manifestPath: string): GenesisMap {
        const content = fs.readFileSync(manifestPath, 'utf8');
        const lines = content.split('\n');

        const map: GenesisMap = {
            project_name: "Sync Profile",
            version: "1.0",
            nodes: [],
            edges: []
        };

        let currentGoal: GenesisNode | null = null;

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

                const node: GenesisNode = {
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
