/*
 * hybrid-GENESIS - Internal Types
 */

export type NodeType = 'GOAL' | 'CONSTRAINT' | 'COMPONENT' | 'IDEA' | 'UNKNOWN';
export type EdgeDirection = 'FORWARD' | 'BACKWARD';

export interface NodeMetadata {
    ownership?: string;      // Used for Rust: e.g., 'Shared', 'Mut', 'Owned'
    session_state?: string;  // E.g., 'RESTORED', 'NEW', 'STALE'
    [key: string]: any;      // Any other metadata
}

export interface GenesisNode {
    id: string;
    type: NodeType;
    label: string;
    data?: NodeMetadata; // Extra metadata for nodes
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
