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
exports.StateEngine = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class StateEngine {
    constructor(workspaceRoot) {
        const hybridDir = path.join(workspaceRoot, '.hybrid');
        if (!fs.existsSync(hybridDir)) {
            fs.mkdirSync(hybridDir, { recursive: true });
        }
        this.mapPath = path.join(hybridDir, 'genesis-map.json');
    }
    readMap() {
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
    saveMap(map) {
        fs.writeFileSync(this.mapPath, JSON.stringify(map, null, 2), 'utf8');
    }
    addNode(node) {
        const map = this.readMap();
        if (map.nodes.some(n => n.id === node.id)) {
            throw new Error(`Node with ID ${node.id} already exists.`);
        }
        map.nodes.push(node);
        this.saveMap(map);
    }
    addEdge(edge) {
        const map = this.readMap();
        // Check if nodes exist
        if (!map.nodes.some(n => n.id === edge.source) || !map.nodes.some(n => n.id === edge.target)) {
            throw new Error('Source or target node does not exist.');
        }
        map.edges.push(edge);
        this.saveMap(map);
    }
    updateNode(node) {
        const map = this.readMap();
        const index = map.nodes.findIndex(n => n.id === node.id);
        if (index === -1)
            throw new Error(`Node ${node.id} not found.`);
        map.nodes[index] = node;
        this.saveMap(map);
    }
}
exports.StateEngine = StateEngine;
