/**
 * Agentic 3D Creator - Lightweight Version
 * Blueprint → Particles → Mesh Pipeline (No external dependencies)
 */

class AgenticCreator {
    constructor() {
        this.currentPhase = 'blueprint';
        this.blueprintData = null;
        this.particles = [];
        this.meshPoints = [];
        
        this.init();
    }

    init() {
        this.setupBlueprintCanvas();
        this.setupParticleCanvas();
        this.setupMeshCanvas();
        this.setupEventListeners();
        this.updatePhaseUI();
    }

    // ============= PHASE 1: BLUEPRINT =============
    setupBlueprintCanvas() {
        this.blueprintCanvas = document.getElementById('blueprint-canvas');
        this.blueprintCtx = this.blueprintCanvas.getContext('2d');
        
        this.blueprintCanvas.width = 600;
        this.blueprintCanvas.height = 400;
        
        this.blueprintCtx.fillStyle = '#ffffff';
        this.blueprintCtx.fillRect(0, 0, this.blueprintCanvas.width, this.blueprintCanvas.height);
    }

    generateBlueprint() {
        const shape = document.getElementById('shape-select').value;
        const size = parseInt(document.getElementById('size-slider').value);
        
        this.blueprintCtx.fillStyle = '#ffffff';
        this.blueprintCtx.fillRect(0, 0, this.blueprintCanvas.width, this.blueprintCanvas.height);
        
        this.blueprintCtx.fillStyle = '#000000';
        this.blueprintCtx.strokeStyle = '#000000';
        this.blueprintCtx.lineWidth = 2;
        
        const centerX = this.blueprintCanvas.width / 2;
        const centerY = this.blueprintCanvas.height / 2;
        
        switch(shape) {
            case 'circle':
                this.drawCircle(centerX, centerY, size);
                break;
            case 'square':
                this.drawSquare(centerX, centerY, size);
                break;
            case 'triangle':
                this.drawTriangle(centerX, centerY, size);
                break;
            case 'star':
                this.drawStar(centerX, centerY, size);
                break;
            case 'heart':
                this.drawHeart(centerX, centerY, size);
                break;
        }
        
        this.blueprintData = this.blueprintCtx.getImageData(0, 0, this.blueprintCanvas.width, this.blueprintCanvas.height);
        
        this.showStatus('Blueprint generated successfully! The contract is set.', 'success');
        document.getElementById('next-phase').disabled = false;
    }

    drawCircle(x, y, radius) {
        this.blueprintCtx.beginPath();
        this.blueprintCtx.arc(x, y, radius, 0, Math.PI * 2);
        this.blueprintCtx.fill();
    }

    drawSquare(x, y, size) {
        this.blueprintCtx.fillRect(x - size, y - size, size * 2, size * 2);
    }

    drawTriangle(x, y, size) {
        this.blueprintCtx.beginPath();
        this.blueprintCtx.moveTo(x, y - size);
        this.blueprintCtx.lineTo(x - size, y + size);
        this.blueprintCtx.lineTo(x + size, y + size);
        this.blueprintCtx.closePath();
        this.blueprintCtx.fill();
    }

    drawStar(x, y, size) {
        const spikes = 5;
        const outerRadius = size;
        const innerRadius = size * 0.5;
        
        this.blueprintCtx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI / spikes) * i - Math.PI / 2;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            
            if (i === 0) {
                this.blueprintCtx.moveTo(px, py);
            } else {
                this.blueprintCtx.lineTo(px, py);
            }
        }
        this.blueprintCtx.closePath();
        this.blueprintCtx.fill();
    }

    drawHeart(x, y, size) {
        const scale = size / 50;
        this.blueprintCtx.save();
        this.blueprintCtx.translate(x, y);
        this.blueprintCtx.scale(scale, scale);
        
        this.blueprintCtx.beginPath();
        this.blueprintCtx.moveTo(0, 15);
        this.blueprintCtx.bezierCurveTo(0, 10, -10, -5, -25, -5);
        this.blueprintCtx.bezierCurveTo(-45, -5, -50, 10, -50, 20);
        this.blueprintCtx.bezierCurveTo(-50, 35, -35, 50, 0, 70);
        this.blueprintCtx.bezierCurveTo(35, 50, 50, 35, 50, 20);
        this.blueprintCtx.bezierCurveTo(50, 10, 45, -5, 25, -5);
        this.blueprintCtx.bezierCurveTo(10, -5, 0, 10, 0, 15);
        this.blueprintCtx.fill();
        
        this.blueprintCtx.restore();
    }

    clearBlueprint() {
        this.blueprintCtx.fillStyle = '#ffffff';
        this.blueprintCtx.fillRect(0, 0, this.blueprintCanvas.width, this.blueprintCanvas.height);
        this.blueprintData = null;
        document.getElementById('next-phase').disabled = true;
    }

    // ============= PHASE 2: PARTICLE ASSEMBLY =============
    setupParticleCanvas() {
        this.particleCanvas = document.getElementById('particle-3d-canvas');
        this.particleCtx = this.particleCanvas.getContext('2d');
        
        this.particleCanvas.width = 800;
        this.particleCanvas.height = 500;
        
        this.particleRotation = 0;
    }

    assembleParticles() {
        if (!this.blueprintData) {
            this.showStatus('Please generate a blueprint first!', 'error');
            return;
        }
        
        const mode = document.getElementById('particle-mode').value;
        const particleCount = parseInt(document.getElementById('particle-count').value);
        
        const progressBar = document.getElementById('assembly-progress');
        const progressFill = progressBar.querySelector('.progress-fill');
        progressBar.style.display = 'block';
        
        const silhouettePoints = this.extractSilhouettePoints();
        
        this.particles = [];
        const step = Math.max(1, Math.floor(silhouettePoints.length / particleCount));
        
        for (let i = 0; i < silhouettePoints.length; i += step) {
            if (this.particles.length >= particleCount) break;
            
            const point = silhouettePoints[i];
            const x = (point.x - this.blueprintCanvas.width / 2) / 30;
            const y = (point.y - this.blueprintCanvas.height / 2) / 30;
            
            let z;
            if (mode === 'volumetric') {
                z = (Math.random() - 0.5) * 6;
            } else {
                z = (Math.random() - 0.5) * 1;
            }
            
            const colorHue = (i / silhouettePoints.length) * 60 + 240;
            
            this.particles.push({
                x, y, z,
                size: Math.random() * 3 + 2,
                color: `hsl(${colorHue}, 80%, 60%)`,
                opacity: 0.8
            });
            
            if (i % 100 === 0) {
                progressFill.style.width = (i / silhouettePoints.length) * 100 + '%';
            }
        }
        
        progressFill.style.width = '100%';
        
        setTimeout(() => {
            progressBar.style.display = 'none';
            this.showStatus('Particles assembled successfully!', 'success');
            document.getElementById('next-phase').disabled = false;
            this.animateParticles();
        }, 500);
    }

    extractSilhouettePoints() {
        const points = [];
        const data = this.blueprintData.data;
        const width = this.blueprintData.width;
        const height = this.blueprintData.height;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                
                if (r < 128 && g < 128 && b < 128) {
                    points.push({ x, y });
                }
            }
        }
        
        return points;
    }

    animateParticles() {
        if (this.currentPhase !== 'particles' || this.particles.length === 0) return;
        
        this.particleRotation += 0.01;
        this.renderParticles();
        
        requestAnimationFrame(() => this.animateParticles());
    }

    renderParticles() {
        this.particleCtx.fillStyle = '#0a0a1a';
        this.particleCtx.fillRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
        
        const centerX = this.particleCanvas.width / 2;
        const centerY = this.particleCanvas.height / 2;
        const scale = 20;
        
        const sortedParticles = [...this.particles].sort((a, b) => b.z - a.z);
        
        sortedParticles.forEach(particle => {
            const rotatedX = particle.x * Math.cos(this.particleRotation) - particle.z * Math.sin(this.particleRotation);
            const rotatedZ = particle.x * Math.sin(this.particleRotation) + particle.z * Math.cos(this.particleRotation);
            
            const perspective = 300 / (300 + rotatedZ * scale);
            const screenX = centerX + rotatedX * scale * perspective;
            const screenY = centerY - particle.y * scale * perspective;
            const size = particle.size * perspective;
            
            this.particleCtx.globalAlpha = particle.opacity;
            this.particleCtx.fillStyle = particle.color;
            this.particleCtx.beginPath();
            this.particleCtx.arc(screenX, screenY, size, 0, Math.PI * 2);
            this.particleCtx.fill();
        });
        
        this.particleCtx.globalAlpha = 1;
    }

    // ============= PHASE 3: MESH SOLIDIFICATION =============
    setupMeshCanvas() {
        this.meshCanvas = document.getElementById('mesh-3d-canvas');
        this.meshCtx = this.meshCanvas.getContext('2d');
        
        this.meshCanvas.width = 800;
        this.meshCanvas.height = 500;
        
        this.meshRotation = 0;
    }

    solidifyMesh() {
        if (!this.particles || this.particles.length === 0) {
            this.showStatus('Please assemble particles first!', 'error');
            return;
        }
        
        const enableAura = document.getElementById('aura-effect').checked;
        const smoothness = parseInt(document.getElementById('mesh-smoothness').value);
        
        this.showStatus('Solidifying mesh...', 'info');
        
        this.meshPoints = this.particles.map(p => ({
            ...p,
            size: p.size * (1 + smoothness / 10),
            opacity: 1,
            hasAura: enableAura
        }));
        
        this.fadeOutParticles();
        
        setTimeout(() => {
            this.showStatus('Mesh solidified successfully!', 'success');
            document.getElementById('export-png').disabled = false;
            document.getElementById('export-glb').disabled = false;
            this.animateMesh();
        }, 1000);
    }

    fadeOutParticles() {
        const fade = () => {
            this.particles.forEach(p => {
                p.opacity = Math.max(0, p.opacity - 0.02);
            });
            
            if (this.particles.some(p => p.opacity > 0)) {
                this.renderParticles();
                requestAnimationFrame(fade);
            } else {
                this.particles = [];
            }
        };
        fade();
    }

    animateMesh() {
        if (this.currentPhase !== 'mesh' || this.meshPoints.length === 0) return;
        
        this.meshRotation += 0.01;
        this.renderMesh();
        
        requestAnimationFrame(() => this.animateMesh());
    }

    renderMesh() {
        this.meshCtx.fillStyle = '#0a0a1a';
        this.meshCtx.fillRect(0, 0, this.meshCanvas.width, this.meshCanvas.height);
        
        const centerX = this.meshCanvas.width / 2;
        const centerY = this.meshCanvas.height / 2;
        const scale = 20;
        
        const sortedPoints = [...this.meshPoints].sort((a, b) => b.z - a.z);
        
        sortedPoints.forEach((point, index) => {
            const rotatedX = point.x * Math.cos(this.meshRotation) - point.z * Math.sin(this.meshRotation);
            const rotatedZ = point.x * Math.sin(this.meshRotation) + point.z * Math.cos(this.meshRotation);
            
            const perspective = 300 / (300 + rotatedZ * scale);
            const screenX = centerX + rotatedX * scale * perspective;
            const screenY = centerY - point.y * scale * perspective;
            const size = point.size * perspective;
            
            if (point.hasAura) {
                const auraSize = size * (1.3 + 0.1 * Math.sin(Date.now() / 500 + index));
                const gradient = this.meshCtx.createRadialGradient(screenX, screenY, size, screenX, screenY, auraSize);
                gradient.addColorStop(0, 'rgba(118, 75, 162, 0.5)');
                gradient.addColorStop(1, 'rgba(118, 75, 162, 0)');
                
                this.meshCtx.fillStyle = gradient;
                this.meshCtx.beginPath();
                this.meshCtx.arc(screenX, screenY, auraSize, 0, Math.PI * 2);
                this.meshCtx.fill();
            }
            
            this.meshCtx.fillStyle = '#667eea';
            this.meshCtx.beginPath();
            this.meshCtx.arc(screenX, screenY, size, 0, Math.PI * 2);
            this.meshCtx.fill();
            
            this.meshCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.meshCtx.lineWidth = 1;
            this.meshCtx.stroke();
        });
    }

    // ============= EXPORT FUNCTIONS =============
    exportPNG() {
        let canvas;
        if (this.meshCanvas && this.meshPoints.length > 0) {
            canvas = this.meshCanvas;
        } else if (this.particleCanvas && this.particles.length > 0) {
            canvas = this.particleCanvas;
        } else {
            canvas = this.blueprintCanvas;
        }
        
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'agentic-creation-' + Date.now() + '.png';
        link.href = dataURL;
        link.click();
        
        this.showStatus('PNG exported successfully!', 'success');
    }

    exportGLB() {
        if (!this.meshPoints || this.meshPoints.length === 0) {
            this.showStatus('No mesh to export! GLB format requires mesh data.', 'error');
            return;
        }
        
        const glbData = this.generateGLBData();
        const blob = new Blob([glbData], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'agentic-creation-' + Date.now() + '.glb';
        link.click();
        
        this.showStatus('GLB exported successfully!', 'success');
    }

    generateGLBData() {
        const positions = [];
        this.meshPoints.forEach(point => {
            positions.push(point.x, point.y, point.z);
        });
        
        const jsonData = {
            asset: { version: "2.0", generator: "Agentic 3D Creator" },
            scene: 0,
            scenes: [{ nodes: [0] }],
            nodes: [{ mesh: 0 }],
            meshes: [{
                primitives: [{
                    attributes: { POSITION: 0 },
                    mode: 0
                }]
            }],
            accessors: [{
                bufferView: 0,
                componentType: 5126,
                count: this.meshPoints.length,
                type: "VEC3",
                max: [10, 10, 10],
                min: [-10, -10, -10]
            }],
            bufferViews: [{
                buffer: 0,
                byteOffset: 0,
                byteLength: positions.length * 4
            }],
            buffers: [{
                byteLength: positions.length * 4
            }]
        };
        
        const jsonString = JSON.stringify(jsonData);
        const jsonBuffer = new TextEncoder().encode(jsonString);
        
        const positionBuffer = new Float32Array(positions);
        
        const totalLength = 12 + 8 + jsonBuffer.length + 8 + positionBuffer.byteLength;
        const glbBuffer = new ArrayBuffer(totalLength);
        const view = new DataView(glbBuffer);
        
        let offset = 0;
        view.setUint32(offset, 0x46546C67, true); offset += 4;
        view.setUint32(offset, 2, true); offset += 4;
        view.setUint32(offset, totalLength, true); offset += 4;
        
        view.setUint32(offset, jsonBuffer.length, true); offset += 4;
        view.setUint32(offset, 0x4E4F534A, true); offset += 4;
        
        new Uint8Array(glbBuffer, offset, jsonBuffer.length).set(jsonBuffer);
        offset += jsonBuffer.length;
        
        view.setUint32(offset, positionBuffer.byteLength, true); offset += 4;
        view.setUint32(offset, 0x004E4942, true); offset += 4;
        
        new Uint8Array(glbBuffer, offset).set(new Uint8Array(positionBuffer.buffer));
        
        return glbBuffer;
    }

    saveProject() {
        const projectData = {
            timestamp: Date.now(),
            blueprintImage: this.blueprintCanvas ? this.blueprintCanvas.toDataURL() : null,
            settings: {
                shape: document.getElementById('shape-select').value,
                size: document.getElementById('size-slider').value,
                particleMode: document.getElementById('particle-mode').value,
                particleCount: document.getElementById('particle-count').value,
                smoothness: document.getElementById('mesh-smoothness').value,
                auraEffect: document.getElementById('aura-effect').checked
            }
        };
        
        const dataStr = JSON.stringify(projectData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'agentic-project-' + Date.now() + '.json';
        link.click();
        
        this.showStatus('Project saved successfully!', 'success');
    }

    // ============= PHASE NAVIGATION =============
    nextPhase() {
        const phases = ['blueprint', 'particles', 'mesh'];
        const currentIndex = phases.indexOf(this.currentPhase);
        
        if (currentIndex < phases.length - 1) {
            this.currentPhase = phases[currentIndex + 1];
            this.updatePhaseUI();
        }
    }

    prevPhase() {
        const phases = ['blueprint', 'particles', 'mesh'];
        const currentIndex = phases.indexOf(this.currentPhase);
        
        if (currentIndex > 0) {
            this.currentPhase = phases[currentIndex - 1];
            this.updatePhaseUI();
        }
    }

    updatePhaseUI() {
        document.querySelectorAll('.phase-step').forEach(step => {
            step.classList.remove('active');
        });
        const phaseElement = document.querySelector(`[data-phase="${this.currentPhase}"]`);
        if (phaseElement) {
            phaseElement.classList.add('active');
        }
        
        document.querySelectorAll('.stage').forEach(stage => {
            stage.classList.remove('active');
        });
        
        // Map phase names to stage IDs
        const stageMap = {
            'blueprint': 'blueprint-stage',
            'particles': 'particle-stage',
            'mesh': 'mesh-stage'
        };
        
        const stageId = stageMap[this.currentPhase];
        const stageElement = document.getElementById(stageId);
        if (stageElement) {
            stageElement.classList.add('active');
        }
        
        const phases = ['blueprint', 'particles', 'mesh'];
        const currentIndex = phases.indexOf(this.currentPhase);
        
        document.getElementById('prev-phase').disabled = currentIndex === 0;
        
        if (this.currentPhase === 'blueprint') {
            document.getElementById('next-phase').disabled = !this.blueprintData;
        } else if (this.currentPhase === 'particles') {
            document.getElementById('next-phase').disabled = this.particles.length === 0;
        } else {
            document.getElementById('next-phase').disabled = true;
        }
    }

    // ============= EVENT LISTENERS =============
    setupEventListeners() {
        document.getElementById('generate-blueprint').addEventListener('click', () => {
            this.generateBlueprint();
        });
        
        document.getElementById('clear-blueprint').addEventListener('click', () => {
            this.clearBlueprint();
        });
        
        document.getElementById('size-slider').addEventListener('input', (e) => {
            document.getElementById('size-value').textContent = e.target.value;
        });
        
        document.getElementById('assemble-particles').addEventListener('click', () => {
            this.assembleParticles();
        });
        
        document.getElementById('particle-count').addEventListener('input', (e) => {
            document.getElementById('particle-count-value').textContent = e.target.value;
        });
        
        document.getElementById('solidify-mesh').addEventListener('click', () => {
            this.solidifyMesh();
        });
        
        document.getElementById('mesh-smoothness').addEventListener('input', (e) => {
            document.getElementById('smoothness-value').textContent = e.target.value;
        });
        
        document.getElementById('next-phase').addEventListener('click', () => {
            this.nextPhase();
        });
        
        document.getElementById('prev-phase').addEventListener('click', () => {
            this.prevPhase();
        });
        
        document.getElementById('export-png').addEventListener('click', () => {
            this.exportPNG();
        });
        
        document.getElementById('export-glb').addEventListener('click', () => {
            this.exportGLB();
        });
        
        document.getElementById('save-project').addEventListener('click', () => {
            this.saveProject();
        });
    }

    showStatus(message, type = 'info') {
        const statusEl = document.getElementById('status-message');
        statusEl.textContent = message;
        statusEl.className = `show ${type}`;
        
        setTimeout(() => {
            statusEl.classList.remove('show');
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new AgenticCreator();
});
