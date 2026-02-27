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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function activate(context) {
    console.log('Hybrid GENESIS is now active!');
    let disposable = vscode.commands.registerCommand('hybrid-genesis.showGraph', () => {
        const panel = vscode.window.createWebviewPanel('genesisGraph', 'Hybrid GENESIS: Spatial Graph', vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview'))
            ]
        });
        panel.webview.html = getWebviewContent();
        // Listen for messages from the webview
        panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'alert':
                    vscode.window.showErrorMessage(message.text);
                    return;
            }
        }, undefined, context.subscriptions);
    });
    context.subscriptions.push(disposable);
}
function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hybrid GENESIS</title>
    <style>
        body { margin: 0; overflow: hidden; background: #000; color: #fff; font-family: sans-serif; }
        #graph-container { width: 100vw; height: 100vh; }
        #ui-overlay { position: absolute; top: 10px; left: 10px; pointer-events: none; }
        .node-label { background: rgba(0,0,0,0.7); padding: 2px 5px; border-radius: 3px; font-size: 12px; }
    </style>
    <script src="https://unpkg.com/3d-force-graph"></script>
</head>
<body>
    <div id="ui-overlay">
        <h1>🌌 GENESIS</h1>
        <p>Layer 0: Spatial Planning</p>
    </div>
    <div id="graph-container"></div>
    <script>
        const vscode = acquireVsCodeApi();
        const container = document.getElementById('graph-container');

        // Initial empty data
        let gData = { nodes: [], links: [] };

        const Graph = ForceGraph3D()(container)
            .graphData(gData)
            .nodeLabel('label')
            .nodeAutoColorBy('type')
            .linkDirectionalParticles(2)
            .linkDirectionalParticleSpeed(d => 0.01)
            .onNodeClick(node => {
                vscode.postMessage({ command: 'alert', text: 'Node: ' + node.label });
            });

        // Function to poll the local daemon (simulation for now)
        async function updateData() {
            try {
                const response = await fetch('http://localhost:3000/map');
                const data = await response.json();
                
                const formattedData = {
                    nodes: data.nodes.map(n => ({ id: n.id, label: n.label, type: n.type })),
                    links: data.edges.map(e => ({ source: e.source, target: e.target, rationale: e.rationale }))
                };

                Graph.graphData(formattedData);
            } catch (e) {
                console.error('Daemon not reachable');
            }
        }

        setInterval(updateData, 2000);
    </script>
</body>
</html>`;
}
function deactivate() { }
//# sourceMappingURL=extension.js.map