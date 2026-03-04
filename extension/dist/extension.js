"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
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
        panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case 'alert':
                    vscode.window.showErrorMessage(message.text);
                    return;
            }
        }, undefined, context.subscriptions);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' https://unpkg.com; style-src 'unsafe-inline'; connect-src http://localhost:3000;">
    <title>Hybrid GENESIS</title>
    <style>
        body { margin: 0; overflow: hidden; background: #050505; color: #e0e0e0; font-family: 'Inter', -apple-system, sans-serif; }
        #graph-container { width: 100vw; height: 100vh; }
        
        #ui-overlay { 
            position: absolute; top: 20px; left: 20px; pointer-events: none; 
            text-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 10;
        }
        
        #side-panel {
            position: absolute; right: 20px; top: 20px; bottom: 20px; width: 300px;
            background: rgba(15, 15, 15, 0.85); backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px;
            padding: 20px; overflow-y: auto; transition: transform 0.3s ease;
            box-shadow: -5px 0 20px rgba(0,0,0,0.5);
            z-index: 20;
        }

        .panel-closed { transform: translateX(340px); }

        h1, h2, h3 { color: #fff; margin-top: 0; font-weight: 300; letter-spacing: 1px; }
        .stat-box { margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px; }
        .label { font-size: 10px; text-transform: uppercase; color: #888; margin-bottom: 5px; }
        .value { font-size: 14px; font-weight: 500; }
        
        .conflict-item { 
            font-size: 12px; padding: 10px; margin-bottom: 10px; border-radius: 4px;
            border-left: 3px solid #ff4444; background: rgba(255, 68, 68, 0.1);
        }
        .conflict-warning { border-left-color: #ffcc00; background: rgba(255, 204, 0, 0.1); }
        
        .type-badge {
            display: inline-block; padding: 2px 6px; border-radius: 10px; font-size: 10px;
            margin-top: 5px; background: #333;
        }

        #close-panel { 
            position: absolute; top: 10px; right: 10px; cursor: pointer; color: #888; pointer-events: all;
        }
    </style>
    <script src="https://unpkg.com/3d-force-graph"></script>
    <script src="https://unpkg.com/three-spritetext"></script>
</head>
<body>
    <div id="ui-overlay">
        <h1>🌌 GENESIS</h1>
        <p style="opacity: 0.6; font-size: 12px;">Layer 0: Spatial Knowledge Graph</p>
    </div>

    <div id="side-panel" class="panel-closed">
        <div id="close-panel" onclick="togglePanel(false)">✕</div>
        <div id="inspector">
            <h2 id="ins-label">Node Inspector</h2>
            <div class="stat-box">
                <div class="label">ID</div>
                <div id="ins-id" class="value">-</div>
                <div id="ins-type" class="type-badge">TYPE</div>
            </div>
            <div class="stat-box">
                <div class="label">Architecture Rationale</div>
                <div id="ins-rationale" class="value" style="font-style: italic; color: #aaa;">Select an edge to view rationale.</div>
            </div>
        </div>
        <div id="conflicts-section">
            <h2 style="margin-top: 40px; color: #ff4444;">🛡️ Logic Guard</h2>
            <div id="conflicts-list">
                <p style="font-size: 12px; color: #888;">No active conflicts detected.</p>
            </div>
        </div>
    </div>

    <div id="graph-container"></div>

    <script>
        const vscode = acquireVsCodeApi();
        const container = document.getElementById('graph-container');
        const sidePanel = document.getElementById('side-panel');

        const COLORS = {
            'GOAL': '#FFD700',
            'CONSTRAINT': '#FF4500',
            'COMPONENT': '#1E90FF',
            'IDEA': '#32CD32',
            'UNKNOWN': '#888888'
        };

        let currentData = { nodes: [], links: [], conflicts: [] };

        const Graph = ForceGraph3D()(container)
            .backgroundColor('#050505')
            .nodeColor(n => COLORS[n.type] || '#fff')
            .nodeLabel(n => `
        < div;
    style = "background: rgba(0,0,0,0.8); padding: 8px; border: 1px solid #555; border-radius: 4px;" >
        style;
    "color:${COLORS[n.type]}" > [$, { n, : .type }] < /b> ${n.label}<br/ >
        style;
    "font-size: 11px; color: #aaa;" > $;
    {
        n.id;
    }
    /i>
        < /div> `)
            .nodeThreeObjectExtend(true)
            .nodeThreeObject(n => {
                const sprite = new SpriteText(n.label);
                sprite.color = '#ffffff';
                sprite.textHeight = 4;
                sprite.position.set(0, 12, 0);
                return sprite;
            })
            .linkWidth(2)
            .linkColor(l => {
                const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
                const targetId = typeof l.target === 'object' ? l.target.id : l.target;
                return currentData.conflicts.some(c => c.nodes.includes(sourceId) && c.nodes.includes(targetId)) ? '#ff4444' : '#666';
            })
            .linkDirectionalArrowLength(3.5)
            .linkDirectionalArrowRelPos(1)
            .linkCurvature(0.1)
            .linkDirectionalParticles(2)
            .linkDirectionalParticleSpeed(0.005)
            .onNodeClick(node => {
                togglePanel(true);
                document.getElementById('ins-label').innerText = node.label;
                document.getElementById('ins-id').innerText = node.id;
                document.getElementById('ins-type').innerText = node.type;
                document.getElementById('ins-type').style.background = COLORS[node.type];
                document.getElementById('ins-rationale').innerText = "Select a connecting edge for rationale.";
            })
            .onLinkClick(link => {
                togglePanel(true);
                document.getElementById('ins-label').innerText = "Vector Concept";
                const sId = typeof link.source === 'object' ? link.source.id : link.source;
                const tId = typeof link.target === 'object' ? link.target.id : link.target;
                document.getElementById('ins-id').innerText = sId + ' ➔ ' + tId;
                document.getElementById('ins-type').innerText = "RATIONALE";
                document.getElementById('ins-type').style.background = "#555";
                document.getElementById('ins-rationale').innerText = link.rationale || "No rationale defined.";
            });

        // Stabilize Physics
        Graph.d3Force('charge').strength(-120);
        Graph.d3Force('link').distance(50);
        Graph.numDimensions(3);

        function togglePanel(open) {
            if (open) sidePanel.classList.remove('panel-closed');
            else sidePanel.classList.add('panel-closed');
        }

        async function updateData() {
            try {
                // Check health first to detect connectivity issues early
                const healthRes = await fetch('http://localhost:3000/health');
                if (!healthRes.ok) throw new Error('Health check failed');

                const response = await fetch('http://localhost:3000/map');
                if (!response.ok) throw new Error('Daemon response not OK');
                const data = await response.json();
                
                const formattedData = {
                    nodes: data.nodes.map(n => ({ id: n.id, label: n.label, type: n.type })),
                    links: data.edges.map(e => ({ source: e.source, target: e.target, rationale: e.rationale })),
                    conflicts: data.conflicts || []
                };

                // Update UI conflicts list
                const listEl = document.getElementById('conflicts-list');
                if (formattedData.conflicts.length > 0) {
                    listEl.innerHTML = formattedData.conflicts.map(c => 
                        '<div class="conflict-item ' + (c.severity === 'WARNING' ? 'conflict-warning' : '') + '">' +
                            '<strong>' + c.severity + '</strong>: ' + c.description +
                        '</div>'
                    ).join('');
                } else {
                    listEl.innerHTML = '<p style="font-size: 12px; color: #888;">No active conflicts detected.</p>';
                }

                currentData = formattedData;
                Graph.graphData(formattedData);
                
                // Remove error overlay if it exists
                const errorOverlay = document.getElementById('error-overlay');
                if (errorOverlay) errorOverlay.remove();
            } catch (e) {
                console.error('Daemon not reachable');
                if (!document.getElementById('error-overlay')) {
                    const overlay = document.createElement('div');
                    overlay.id = 'error-overlay';
                    overlay.style.position = 'absolute';
                    overlay.style.top = '50%';
                    overlay.style.left = '50%';
                    overlay.style.transform = 'translate(-50%, -50%)';
                    overlay.style.background = 'rgba(255,0,0,0.8)';
                    overlay.style.padding = '20px';
                    overlay.style.borderRadius = '8px';
                    overlay.style.textAlign = 'center';
                    overlay.style.zIndex = '1000';
                    overlay.innerHTML = \`
                        <h2 style="margin:0">🚫 Daemon non raggiungibile</h2>
                        <p>Assicurati che <b>hybrid-genesis start</b> sia attivo nel terminale.</p>
                        <p style="font-size:12px">Premi <b>Ctl+Shift+P</b> -> <b>Ports: Focus on Ports View</b> e controlla che la porta <b>3000</b> sia inoltrata.</p>
                    \`;
                    document.body.appendChild(overlay);
                }
            }
        }

        setInterval(updateData, 2000);
        updateData(); // First run
    </script>
</body>
</html>`;
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map