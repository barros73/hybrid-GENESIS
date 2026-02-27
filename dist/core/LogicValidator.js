"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicValidator = void 0;
class LogicValidator {
    static analyze(map) {
        const conflicts = [];
        // 1. Detect Constraints Violations
        const constraints = map.nodes.filter(n => n.type === 'CONSTRAINT');
        for (const constraint of constraints) {
            // Find edges targeting or sourced from this constraint
            const relatedEdges = map.edges.filter(e => e.source === constraint.id || e.target === constraint.id);
            for (const edge of relatedEdges) {
                // Example logic: if a COMPONENT is linked to a CONSTRAINT via FORWARD edge, 
                // check if the rationale mentions "violation" or similar keywords
                if (edge.rationale.toLowerCase().includes('conflict') || edge.rationale.toLowerCase().includes('break')) {
                    conflicts.push({
                        severity: 'ERROR',
                        description: `Architectural Conflict: ${edge.rationale}`,
                        nodes: [edge.source, edge.target]
                    });
                }
            }
        }
        // 2. Detect Isolated Nodes
        for (const node of map.nodes) {
            const hasEdges = map.edges.some(e => e.source === node.id || e.target === node.id);
            if (!hasEdges && node.type !== 'IDEA') {
                conflicts.push({
                    severity: 'WARNING',
                    description: `Isolated Node: ${node.label} has no logical connections.`,
                    nodes: [node.id]
                });
            }
        }
        return conflicts;
    }
}
exports.LogicValidator = LogicValidator;
