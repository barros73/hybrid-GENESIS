import * as fs from 'fs';
import * as path from 'path';
import { GenesisMap, GenesisNode, GenesisEdge } from './types';

export class StateEngine {
    private mapPath: string;

    constructor(workspaceRoot: string) {
        const hybridDir = path.join(workspaceRoot, '.hybrid');
        if (!fs.existsSync(hybridDir)) {
            fs.mkdirSync(hybridDir, { recursive: true });
        }
        this.mapPath = path.join(hybridDir, 'genesis-map.json');
    }

    public readMap(): GenesisMap {
        if (!fs.existsSync(this.mapPath)) {
            return {
                project_name: "New Project",
                version: "1.0",
                nodes: [],
                edges: []
            };
        }
        const data = fs.readFileSync(this.mapPath, 'utf8');
        return JSON.parse(data);
    }

    public saveMap(map: GenesisMap): void {
        fs.writeFileSync(this.mapPath, JSON.stringify(map, null, 2), 'utf8');
    }

    public addNode(node: GenesisNode): void {
        const map = this.readMap();
        if (map.nodes.some(n => n.id === node.id)) {
            throw new Error(`Node with ID ${node.id} already exists.`);
        }
        map.nodes.push(node);
        this.saveMap(map);
    }

    public addEdge(edge: GenesisEdge): void {
        const map = this.readMap();
        // Check if nodes exist
        if (!map.nodes.some(n => n.id === edge.source) || !map.nodes.some(n => n.id === edge.target)) {
            throw new Error('Source or target node does not exist.');
        }
        map.edges.push(edge);
        this.saveMap(map);
    }

    public updateNode(node: GenesisNode): void {
        const map = this.readMap();
        const index = map.nodes.findIndex(n => n.id === node.id);
        if (index === -1) throw new Error(`Node ${node.id} not found.`);
        map.nodes[index] = node;
        this.saveMap(map);
    }
}
