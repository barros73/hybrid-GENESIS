/*
 * hybrid-GENESIS - Internal Types
 */

export type NodeType = 'GOAL' | 'CONSTRAINT' | 'COMPONENT' | 'IDEA' | 'UNKNOWN';
export type EdgeDirection = 'FORWARD' | 'BACKWARD';

export interface GenesisNode {
    id: string;
    type: NodeType;
    label: string;
    data?: any; // Extra metadata for nodes
}

export interface GenesisEdge {
    source: string;
    target: string;
    direction: EdgeDirection;
    rationale: string;
}

export interface GenesisMap {
    project_name: string;
    version: string;
    nodes: GenesisNode[];
    edges: GenesisEdge[];
}
