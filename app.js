/**
 * Agentic 3D Creator - Blueprint to Mesh Pipeline
 * Pipeline: Blueprint → Particles → Mesh → Export
 */

class AgenticCreator {
    constructor() {
        this.currentPhase = 'blueprint';
        this.blueprintData = null;
        this.particleSystem = null;
        this.meshObject = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        this.init();
    }

    init() {
        this.setupBlueprintCanvas();
        this.setupEventListeners();
        this.updatePhaseUI();
    }

    // ============= PHASE 1: BLUEPRINT =============
    setupBlueprintCanvas() {
        this.blueprintCanvas = document.getElementById('blueprint-canvas');
        this.blueprintCtx = this.blueprintCanvas.getContext('2d');
        
        // Set canvas size
        this.blueprintCanvas.width = 600;
        this.blueprintCanvas.height = 400;
        
        // Clear with white background
        this.blueprintCtx.fillStyle = '#ffffff';
        this.blueprintCtx.fillRect(0, 0, this.blueprintCanvas.width, this.blueprintCanvas.height);
    }

    generateBlueprint() {
        const shape = document.getElementById('shape-select').value;
        const size = parseInt(document.getElementById('size-slider').value);
        
        // Clear canvas
        this.blueprintCtx.fillStyle = '#ffffff';
        this.blueprintCtx.fillRect(0, 0, this.blueprintCanvas.width, this.blueprintCanvas.height);
        
        // Draw high-contrast silhouette
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
        
        // Store blueprint data
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
    setupParticleStage() {
        const container = document.getElementById('particle-canvas');
        
        // Create Three.js scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a1a);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 15;
        this.camera.position.y = 5;
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.innerHTML = '';
        container.appendChild(this.renderer.domElement);
        
        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        
        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        this.scene.add(directionalLight);
        
        // Start animation loop
        this.animate();
    }

    assembleParticles() {
        if (!this.blueprintData) {
            this.showStatus('Please generate a blueprint first!', 'error');
            return;
        }
        
        const mode = document.getElementById('particle-mode').value;
        const particleCount = parseInt(document.getElementById('particle-count').value);
        
        // Show progress
        const progressBar = document.getElementById('assembly-progress');
        const progressFill = progressBar.querySelector('.progress-fill');
        progressBar.style.display = 'block';
        
        // Extract silhouette points from blueprint
        const points = this.extractSilhouettePoints(particleCount);
        
        // Create particle system
        this.createParticleSystem(points, mode, (progress) => {
            progressFill.style.width = progress + '%';
        });
        
        setTimeout(() => {
            progressBar.style.display = 'none';
            this.showStatus('Particles assembled successfully!', 'success');
            document.getElementById('next-phase').disabled = false;
        }, 2000);
    }

    extractSilhouettePoints(count) {
        const points = [];
        const data = this.blueprintData.data;
        const width = this.blueprintData.width;
        const height = this.blueprintData.height;
        
        // Find all black pixels (silhouette)
        const silhouettePixels = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                
                // Check if pixel is black (or dark enough)
                if (r < 128 && g < 128 && b < 128) {
                    silhouettePixels.push({ x, y });
                }
            }
        }
        
        // Sample points from silhouette
        const step = Math.max(1, Math.floor(silhouettePixels.length / count));
        for (let i = 0; i < silhouettePixels.length; i += step) {
            if (points.length >= count) break;
            
            const pixel = silhouettePixels[i];
            // Convert to 3D coordinates (centered)
            const x = (pixel.x - width / 2) / 50;
            const y = -(pixel.y - height / 2) / 50;
            const z = 0;
            
            points.push(new THREE.Vector3(x, y, z));
        }
        
        return points;
    }

    createParticleSystem(points, mode, progressCallback) {
        // Remove old particles if any
        if (this.particleSystem) {
            this.scene.remove(this.particleSystem);
        }
        
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const sizes = [];
        
        points.forEach((point, index) => {
            // Position
            if (mode === 'volumetric') {
                // Add depth variation for volumetric
                const depth = (Math.random() - 0.5) * 3;
                positions.push(point.x, point.y, point.z + depth);
            } else {
                // 2.5D relief - slight depth only
                const depth = (Math.random() - 0.5) * 0.5;
                positions.push(point.x, point.y, point.z + depth);
            }
            
            // Color - gradient effect
            const colorValue = index / points.length;
            const color = new THREE.Color();
            color.setHSL(0.6 + colorValue * 0.2, 1.0, 0.6);
            colors.push(color.r, color.g, color.b);
            
            // Size variation
            sizes.push(Math.random() * 0.1 + 0.05);
            
            // Update progress
            if (index % 100 === 0) {
                progressCallback((index / points.length) * 100);
            }
        });
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
        
        progressCallback(100);
    }

    // ============= PHASE 3: MESH SOLIDIFICATION =============
    setupMeshStage() {
        // Reuse the same scene, just update the container reference
        const container = document.getElementById('mesh-canvas');
        
        if (!this.scene) {
            // If scene doesn't exist, create it (shouldn't happen in normal flow)
            this.setupParticleStage();
        }
        
        // Move renderer to mesh canvas
        container.innerHTML = '';
        container.appendChild(this.renderer.domElement);
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        
        // Update camera aspect ratio
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
    }

    solidifyMesh() {
        if (!this.particleSystem) {
            this.showStatus('Please assemble particles first!', 'error');
            return;
        }
        
        const enableAura = document.getElementById('aura-effect').checked;
        const smoothness = parseInt(document.getElementById('mesh-smoothness').value);
        
        this.showStatus('Solidifying mesh...', 'info');
        
        // Extract points from particle system
        const positions = this.particleSystem.geometry.attributes.position.array;
        const points = [];
        
        for (let i = 0; i < positions.length; i += 3) {
            points.push(new THREE.Vector3(
                positions[i],
                positions[i + 1],
                positions[i + 2]
            ));
        }
        
        // Create mesh from points using convex hull or marching cubes approximation
        // For simplicity, we'll create a mesh using a different approach
        this.createSolidMesh(points, smoothness, enableAura);
        
        setTimeout(() => {
            this.showStatus('Mesh solidified successfully!', 'success');
            // Enable export buttons
            document.getElementById('export-png').disabled = false;
            document.getElementById('export-glb').disabled = false;
        }, 1000);
    }

    createSolidMesh(points, smoothness, enableAura) {
        // Fade out particles
        if (this.particleSystem) {
            const fadeOut = () => {
                if (this.particleSystem.material.opacity > 0) {
                    this.particleSystem.material.opacity -= 0.05;
                    setTimeout(fadeOut, 50);
                } else {
                    this.scene.remove(this.particleSystem);
                }
            };
            fadeOut();
        }
        
        // Create a simplified mesh representation
        // Using a convex hull approach or combining spheres
        const geometry = new THREE.BufferGeometry();
        geometry.setFromPoints(points);
        
        // Create mesh with smooth shading
        const material = new THREE.MeshPhongMaterial({
            color: 0x667eea,
            shininess: 100,
            flatShading: smoothness < 5
        });
        
        // For a proper mesh, we'll create a surface
        // Using a simple approach with merged geometry
        const meshGeometry = this.createMeshGeometry(points, smoothness);
        
        this.meshObject = new THREE.Mesh(meshGeometry, material);
        this.scene.add(this.meshObject);
        
        // Add aura effect if enabled
        if (enableAura) {
            this.addAuraEffect();
        }
    }

    createMeshGeometry(points, smoothness) {
        // Create a mesh by connecting nearby points
        // This is a simplified approach - in production, use proper meshing algorithms
        
        // For now, create a combined geometry from small spheres at each point
        const mergedGeometry = new THREE.BufferGeometry();
        const geometries = [];
        
        const sphereGeometry = new THREE.SphereGeometry(0.15, 8 + smoothness, 8 + smoothness);
        
        points.forEach(point => {
            const clonedGeometry = sphereGeometry.clone();
            clonedGeometry.translate(point.x, point.y, point.z);
            geometries.push(clonedGeometry);
        });
        
        // Merge geometries (simplified - would use BufferGeometryUtils in production)
        const mergedPositions = [];
        const mergedNormals = [];
        
        geometries.forEach(geo => {
            const pos = geo.attributes.position.array;
            const norm = geo.attributes.normal.array;
            
            for (let i = 0; i < pos.length; i++) {
                mergedPositions.push(pos[i]);
                mergedNormals.push(norm[i]);
            }
        });
        
        mergedGeometry.setAttribute('position', new THREE.Float32BufferAttribute(mergedPositions, 3));
        mergedGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(mergedNormals, 3));
        
        return mergedGeometry;
    }

    addAuraEffect() {
        // Create a glowing aura around the mesh
        if (!this.meshObject) return;
        
        const auraGeometry = this.meshObject.geometry.clone();
        const auraMaterial = new THREE.MeshBasicMaterial({
            color: 0x764ba2,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        
        const aura = new THREE.Mesh(auraGeometry, auraMaterial);
        aura.scale.multiplyScalar(1.1);
        
        this.meshObject.add(aura);
        
        // Animate aura (pulse effect)
        let pulseDirection = 1;
        const pulseAura = () => {
            if (!aura.parent) return;
            
            aura.scale.x += 0.002 * pulseDirection;
            aura.scale.y += 0.002 * pulseDirection;
            aura.scale.z += 0.002 * pulseDirection;
            
            if (aura.scale.x > 1.15 || aura.scale.x < 1.05) {
                pulseDirection *= -1;
            }
            
            requestAnimationFrame(pulseAura);
        };
        pulseAura();
    }

    // ============= ANIMATION =============
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.controls) {
            this.controls.update();
        }
        
        // Rotate particle system or mesh slowly
        if (this.particleSystem && this.particleSystem.parent) {
            this.particleSystem.rotation.y += 0.002;
        }
        
        if (this.meshObject && this.meshObject.parent) {
            this.meshObject.rotation.y += 0.002;
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    // ============= EXPORT FUNCTIONS =============
    exportPNG() {
        if (!this.renderer) {
            this.showStatus('No scene to export!', 'error');
            return;
        }
        
        this.renderer.render(this.scene, this.camera);
        const dataURL = this.renderer.domElement.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.download = 'agentic-creation-' + Date.now() + '.png';
        link.href = dataURL;
        link.click();
        
        this.showStatus('PNG exported successfully!', 'success');
    }

    exportGLB() {
        if (!this.meshObject) {
            this.showStatus('No mesh to export!', 'error');
            return;
        }
        
        const exporter = new THREE.GLTFExporter();
        
        exporter.parse(
            this.meshObject,
            (gltf) => {
                const blob = new Blob([gltf], { type: 'application/octet-stream' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'agentic-creation-' + Date.now() + '.glb';
                link.click();
                
                this.showStatus('GLB exported successfully!', 'success');
            },
            { binary: true }
        );
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
            
            // Setup stage if needed
            if (this.currentPhase === 'particles') {
                this.setupParticleStage();
            } else if (this.currentPhase === 'mesh') {
                this.setupMeshStage();
            }
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
        // Update phase indicators
        document.querySelectorAll('.phase-step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector(`[data-phase="${this.currentPhase}"]`).classList.add('active');
        
        // Update stage visibility
        document.querySelectorAll('.stage').forEach(stage => {
            stage.classList.remove('active');
        });
        document.getElementById(`${this.currentPhase}-stage`).classList.add('active');
        
        // Update navigation buttons
        const phases = ['blueprint', 'particles', 'mesh'];
        const currentIndex = phases.indexOf(this.currentPhase);
        
        document.getElementById('prev-phase').disabled = currentIndex === 0;
        
        // Next button is enabled based on phase completion
        if (this.currentPhase === 'blueprint') {
            document.getElementById('next-phase').disabled = !this.blueprintData;
        } else if (this.currentPhase === 'particles') {
            document.getElementById('next-phase').disabled = !this.particleSystem;
        } else {
            document.getElementById('next-phase').disabled = true;
        }
    }

    // ============= EVENT LISTENERS =============
    setupEventListeners() {
        // Blueprint controls
        document.getElementById('generate-blueprint').addEventListener('click', () => {
            this.generateBlueprint();
        });
        
        document.getElementById('clear-blueprint').addEventListener('click', () => {
            this.clearBlueprint();
        });
        
        document.getElementById('size-slider').addEventListener('input', (e) => {
            document.getElementById('size-value').textContent = e.target.value;
        });
        
        // Particle controls
        document.getElementById('assemble-particles').addEventListener('click', () => {
            this.assembleParticles();
        });
        
        document.getElementById('particle-count').addEventListener('input', (e) => {
            document.getElementById('particle-count-value').textContent = e.target.value;
        });
        
        // Mesh controls
        document.getElementById('solidify-mesh').addEventListener('click', () => {
            this.solidifyMesh();
        });
        
        document.getElementById('mesh-smoothness').addEventListener('input', (e) => {
            document.getElementById('smoothness-value').textContent = e.target.value;
        });
        
        // Navigation
        document.getElementById('next-phase').addEventListener('click', () => {
            this.nextPhase();
        });
        
        document.getElementById('prev-phase').addEventListener('click', () => {
            this.prevPhase();
        });
        
        // Export
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

    // ============= UTILITY =============
    showStatus(message, type = 'info') {
        const statusEl = document.getElementById('status-message');
        statusEl.textContent = message;
        statusEl.className = `show ${type}`;
        
        setTimeout(() => {
            statusEl.classList.remove('show');
        }, 3000);
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AgenticCreator();
});
