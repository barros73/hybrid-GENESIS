import { GenesisMap, GenesisNode, GenesisEdge } from './types';
export declare class StateEngine {
    private mapPath;
    constructor(workspaceRoot: string);
    readMap(): GenesisMap;
    saveMap(map: GenesisMap): void;
    addNode(node: GenesisNode): void;
    addEdge(edge: GenesisEdge): void;
    updateNode(node: GenesisNode): void;
}
//# sourceMappingURL=StateEngine.d.ts.map