"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicValidator = void 0;
class LogicValidator {
    static analyze(map) {
        const conflicts = [];
        // 1. Detect Constraints Violations (Enhanced)
        const constraints = map.nodes.filter(n => n.type === 'CONSTRAINT');
        const components = map.nodes.filter(n => n.type === 'COMPONENT');
        for (const constraint of constraints) {
            const relatedEdges = map.edges.filter(e => e.source === constraint.id || e.target === constraint.id);
            // Check for explicit "CONFLICT" in rationale
            for (const edge of relatedEdges) {
                if (/conflict|break|violation|illegal/i.test(edge.rationale)) {
                    conflicts.push({
                        severity: 'ERROR',
                        description: `Architectural Violation: ${edge.rationale}`,
                        nodes: [edge.source, edge.target]
                    });
                }
            }
            // BIM-Specific: If a constraint mentions BIM, it must be connected to a COMPONENT
            if (constraint.label.toLowerCase().includes('bim')) {
                const isConnectedToComponent = relatedEdges.some(e => {
                    const otherId = e.source === constraint.id ? e.target : e.source;
                    return components.some(c => c.id === otherId);
                });
                if (!isConnectedToComponent) {
                    conflicts.push({
                        severity: 'WARNING',
                        description: `BIM Isolation: Constraint '${constraint.label}' is defined but not enforced by any component.`,
                        nodes: [constraint.id]
                    });
                }
            }
        }
        // 1.5 Detect Missing Ownership Metadata (Rust Optimization)
        for (const component of components) {
            if (!component.data || !component.data.ownership) {
                conflicts.push({
                    severity: 'WARNING',
                    description: `Missing Ownership Context: Component '${component.label}' does not define an 'ownership' policy (e.g., Shared, Owned, Mut). This is highly recommended for Rust code generation to prevent borrow-checker conflicts in the generated Skeleton.`,
                    nodes: [component.id]
                });
            }
        }
        // 2. Detect Isolated Nodes & Goal Paths
        const goals = map.nodes.filter(n => n.type === 'GOAL');
        for (const goal of goals) {
            const hasPath = map.edges.some(e => e.source === goal.id);
            if (!hasPath) {
                conflicts.push({
                    severity: 'ERROR',
                    description: `Dangling Goal: '${goal.label}' has no components or sub-goals to achieve it.`,
                    nodes: [goal.id]
                });
            }
        }
        for (const node of map.nodes) {
            const hasEdges = map.edges.some(e => e.source === node.id || e.target === node.id);
            if (!hasEdges && node.type !== 'IDEA') {
                conflicts.push({
                    severity: 'WARNING',
                    description: `Isolated Node: '${node.label}' is disconnected from the architecture map.`,
                    nodes: [node.id]
                });
            }
        }
        return conflicts;
    }
}
exports.LogicValidator = LogicValidator;
