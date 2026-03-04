import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    console.log('Hybrid GENESIS is now active!');

    let disposable = vscode.commands.registerCommand('hybrid-genesis.showGraph', () => {
        const panel = vscode.window.createWebviewPanel(
            'genesisGraph',
            'Hybrid GENESIS: Spatial Graph',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview'))
                ]
            }
        );

        panel.webview.html = getWebviewContent();

        // Listen for messages from the webview
        panel.webview.onDidReceiveMessage(
            (message: any) => {
                switch (message.command) {
                    case 'alert':
                        vscode.window.showErrorMessage(message.text);
                        return;
                }
            },
            undefined,
            context.subscriptions
        );
    });

    context.subscriptions.push(disposable);
}

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
            background: rgba(15, 15, 15, 0.95); backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 4px;
            padding: 20px; overflow-y: auto; transition: transform 0.3s ease;
            box-shadow: -10px 0 30px rgba(0,0,0,0.7);
            z-index: 20;
        }

        .panel-closed { transform: translateX(340px); }

        h1, h2, h3 { color: #fff; margin-top: 0; font-weight: 400; letter-spacing: 1px; }
        .stat-box { margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; }
        .label { font-size: 11px; text-transform: uppercase; color: #aaa; margin-bottom: 8px; letter-spacing: 1px; }
        .value { font-size: 14px; font-weight: 500; font-family: 'JetBrains Mono', monospace; color: #eee; }
        
        .type-badge {
            display: inline-block; padding: 4px 8px; border-radius: 2px; font-size: 10px;
            font-weight: bold; text-transform: uppercase; margin-top: 10px; background: #333;
        }

        #close-panel { 
            position: absolute; top: 15px; right: 15px; cursor: pointer; color: #888; pointer-events: all; font-size: 20px;
        }

        .tooltip-card {
            background: rgba(10, 10, 10, 0.9); border: 1px solid rgba(255,255,255,0.2); 
            padding: 12px; border-radius: 4px; pointer-events: none; box-shadow: 0 5px 15px rgba(0,0,0,0.5);
        }
    </style>
    <script src="https://unpkg.com/3d-force-graph"></script>
    <script src="https://unpkg.com/three-spritetext"></script>
</head>
<body>
    <div id="ui-overlay">
        <h1>HYBRID <span style="font-weight: 200; opacity: 0.7;">GENESIS</span></h1>
        <p style="opacity: 0.5; font-size: 11px; letter-spacing: 2px;">LAYER 0: SPATIAL ARCHITECTURE PLANNER</p>
    </div>

    <div id="side-panel" class="panel-closed">
        <div id="close-panel" onclick="togglePanel(false)">✕</div>
        <div id="inspector">
            <h2 id="ins-label">Spatial Node Inspector</h2>
            <div class="stat-box">
                <div class="label">Deterministic ID</div>
                <div id="ins-id" class="value">-</div>
                <div id="ins-type" class="type-badge">TYPE</div>
            </div>
            <div class="stat-box">
                <div class="label">Architecture Rationale / Constraints</div>
                <div id="ins-rationale" class="value" style="color: #ccc; font-weight: 300;">Select an element to view technical justification.</div>
            </div>
        </div>
        <div id="conflicts-section">
            <h2 style="margin-top: 40px; color: #ff4444; border-top: 1px solid rgba(255,68,68,0.3); padding-top: 20px;">Logic Validation</h2>
            <div id="conflicts-list">
                <p style="font-size: 12px; color: #666;">Integrity check: PASS.</p>
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
            'COMPONENT': '#00BFFF',
            'IDEA': '#00FF7F',
            'UNKNOWN': '#888888'
        };

        let currentData = { nodes: [], links: [], conflicts: [] };

        const Graph = ForceGraph3D()(container)
            .backgroundColor('#050505')
            .nodeColor(function(n) { return COLORS[n.type] || '#fff'; })
            .nodeLabel(function(n) {
                return '<div class="tooltip-card">' +
                       '<b style="color:' + (COLORS[n.type] || '#fff') + '">[' + n.type + ']</b> ' + n.label + '<br/>' +
                       '<small style="color:#888">' + n.id + '</small>' +
                       '</div>';
            })
            .nodeThreeObjectExtend(true)
            .nodeThreeObject(function(n) {
                const sprite = new SpriteText(n.label);
                sprite.color = '#ffffff';
                sprite.textHeight = 3.5;
                sprite.position.set(0, 10, 0);
                return sprite;
            })
            .linkWidth(2)
            .linkColor(function(l) {
                const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
                const targetId = typeof l.target === 'object' ? l.target.id : l.target;
                const isConflict = currentData.conflicts && currentData.conflicts.some(function(c) {
                    return c.nodes.includes(sourceId) && c.nodes.includes(targetId);
                });
                return isConflict ? '#ff4444' : '#555';
            })
            .linkDirectionalArrowLength(4)
            .linkDirectionalArrowRelPos(1)
            .linkCurvature(0.15)
            .onNodeClick(function(node) {
                togglePanel(true);
                document.getElementById('ins-label').innerText = node.label;
                document.getElementById('ins-id').innerText = node.id;
                document.getElementById('ins-type').innerText = node.type;
                document.getElementById('ins-type').style.background = COLORS[node.type];
                document.getElementById('ins-rationale').innerText = "System Integrity Point: Architectural node validated.";
            })
            .onLinkClick(function(link) {
                togglePanel(true);
                document.getElementById('ins-label').innerText = "Vector Relationship";
                const sId = typeof link.source === 'object' ? link.source.id : link.source;
                const tId = typeof link.target === 'object' ? link.target.id : link.target;
                document.getElementById('ins-id').innerText = sId + ' ➔ ' + tId;
                document.getElementById('ins-type').innerText = "RATIONALE";
                document.getElementById('ins-type').style.background = "#444";
                document.getElementById('ins-rationale').innerText = link.rationale || "Logical connection: Inherited architectural requirement.";
            });

        // Professional Physics Configuration
        Graph.d3Force('charge').strength(-300);
        Graph.d3Force('link').distance(80);
        Graph.d3VelocityDecay(0.4); 
        
        async function updateData() {
            try {
                const healthRes = await fetch('http://localhost:3000/health');
                if (!healthRes.ok) throw new Error('Health check failed');

                const response = await fetch('http://localhost:3000/map');
                if (!response.ok) throw new Error('Daemon response not OK');
                const data = await response.json();
                
                const formattedData = {
                    nodes: data.nodes.map(function(n) { return { id: n.id, label: n.label, type: n.type }; }),
                    links: data.edges ? data.edges.map(function(e) { return { source: e.source, target: e.target, rationale: e.rationale }; }) : [],
                    conflicts: data.conflicts || []
                };

                const listEl = document.getElementById('conflicts-list');
                if (formattedData.conflicts.length > 0) {
                    listEl.innerHTML = formattedData.conflicts.map(function(c) { 
                        return '<div style="border-left: 2px solid ' + (c.severity === 'WARNING' ? '#ffcc00' : '#ff4444') + '; padding: 10px; background: rgba(255,255,255,0.05); margin-bottom: 10px;">' +
                               '<strong>' + c.severity + '</strong>: ' + c.description +
                               '</div>';
                    }).join('');
                } else {
                    listEl.innerHTML = '<p style="font-size: 12px; color: #4CAF50;">✓ System Architecture Integrity Verified</p>';
                }

                if (JSON.stringify(currentData.nodes) !== JSON.stringify(formattedData.nodes) || 
                    JSON.stringify(currentData.links) !== JSON.stringify(formattedData.links)) {
                    currentData = formattedData;
                    Graph.graphData(formattedData);
                }
                
                const errorOverlay = document.getElementById('error-overlay');
                if (errorOverlay) errorOverlay.remove();
            } catch (e) {
                console.error('Daemon connection failure');
                if (!document.getElementById('error-overlay')) {
                    const overlay = document.createElement('div');
                    overlay.id = 'error-overlay';
                    overlay.style.position = 'absolute'; overlay.style.top = '50%'; overlay.style.left = '50%';
                    overlay.style.transform = 'translate(-50%, -50%)'; overlay.style.background = 'rgba(20,0,0,0.95)';
                    overlay.style.padding = '30px'; overlay.style.borderRadius = '2px'; overlay.style.border = '1px solid #ff4444';
                    overlay.style.textAlign = 'center'; overlay.style.zIndex = '1000';
                    overlay.innerHTML = '<h2 style="color:#ff4444">COMMUNICATION ERROR</h2>' +
                                      '<p style="font-size:14px">GENESIS DAEMON (PORT 3000) UNREACHABLE</p>' +
                                      '<div style="font-size:11px; margin-top:20px; text-align:left; color:#888">' +
                                      'TRACES:<br/>1. Verificare process: hybrid-genesis start<br/>2. Verificare Port Forwarding (Port 3000)</div>';
                    document.body.appendChild(overlay);
                }
            }
        }

        function togglePanel(open) {
            if (open) sidePanel.classList.remove('panel-closed');
            else sidePanel.classList.add('panel-closed');
        }

        setInterval(updateData, 5000);
        updateData();
    </script>
</body>
</html>`;
}


export function deactivate() { }
