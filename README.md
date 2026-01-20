# Agentic 3D Creator

A web-based 3D object creator using an innovative **Blueprint → Particles → Mesh** pipeline. Transform 2D silhouettes into beautiful 3D models directly in your browser.

## 🎯 Overview

Agentic 3D Creator implements a three-phase pipeline that transforms simple 2D blueprints into fully-realized 3D meshes:

1. **Blueprint Phase**: Agent Lee generates a clean, high-contrast 2D preview image that defines the exact silhouette (the "contract")
2. **Particle Assembly**: Particles assemble to match the blueprint, either as a fast 2.5D relief or an optional volumetric build for high-tier devices
3. **Mesh Solidification**: Particles solidify into a true 3D mesh, leaving a subtle aura or fading out

## ✨ Features

### Blueprint Generation
- Multiple preset shapes (Circle, Square, Triangle, Star, Heart)
- Custom drawing capability
- Adjustable size controls
- High-contrast silhouette output

### Particle Assembly
- Two modes:
  - **2.5D Relief (Fast)**: Quick assembly with minimal depth
  - **Volumetric (High Quality)**: Full 3D depth for powerful devices
- Adjustable particle count (500-5000)
- Real-time assembly progress
- Gradient color effects

### Mesh Solidification
- Smooth particle-to-mesh transition
- Optional aura effect with pulse animation
- Adjustable smoothness (0-10)
- Automatic particle fade-out

### Export Options
- **PNG Export**: High-quality image snapshots
- **GLB Export**: 3D model files for use in other applications
- **Project Save**: JSON format with all settings preserved

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/4citeB4U/Agentic-Creations-by-Agent.git
   cd Agentic-Creations-by-Agent
   ```

2. **Open in browser**:
   Simply open `index.html` in a modern web browser. No build step required!

3. **Create your first 3D object**:
   - Select a shape and size
   - Click "Generate Blueprint"
   - Click "Next" to move to Particle Assembly
   - Click "Assemble Particles"
   - Click "Next" to move to Mesh Solidification
   - Click "Solidify Mesh"
   - Export your creation!

## 📋 Requirements

- Modern web browser with WebGL support (Chrome, Firefox, Safari, Edge)
- Internet connection (for Three.js CDN)

## 🛠️ Technology Stack

- **HTML5 Canvas**: 2D blueprint generation
- **Three.js**: 3D rendering and particle systems
- **WebGL**: Hardware-accelerated graphics
- **Vanilla JavaScript**: No framework dependencies
- **CSS3**: Modern styling with gradients and animations

## 📐 Architecture

### Pipeline Flow

```
Blueprint (2D Canvas)
    ↓
Silhouette Extraction
    ↓
Particle System (Three.js Points)
    ↓
Mesh Generation (Three.js Mesh)
    ↓
Export (PNG/GLB)
```

### Key Components

- **AgenticCreator Class**: Main application controller
- **Blueprint Canvas**: 2D drawing and silhouette generation
- **Particle System**: Three.js points-based visualization
- **Mesh Generator**: Geometry creation from particle positions
- **Export Manager**: PNG and GLB file generation

## 🎨 Customization

### Adding New Shapes

Add new shape functions in `app.js`:

```javascript
drawCustomShape(x, y, size) {
    this.blueprintCtx.beginPath();
    // Your drawing code here
    this.blueprintCtx.fill();
}
```

### Adjusting Visual Effects

Modify particle colors, aura intensity, or mesh materials in the respective creation functions:

- `createParticleSystem()`: Particle appearance
- `addAuraEffect()`: Aura color and pulse settings
- `createSolidMesh()`: Mesh material properties

## 📊 Performance

- **2.5D Relief Mode**: Optimized for all devices, handles 5000+ particles smoothly
- **Volumetric Mode**: Best on devices with dedicated GPUs
- Recommended particle count: 2000-3000 for optimal balance

## 🔧 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📝 License

MIT License - Feel free to use and modify for your projects

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 🙏 Acknowledgments

- Three.js for the powerful 3D rendering library
- The WebGL community for excellent documentation
- All contributors and users of this project

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ by the Agentic Creations team**
