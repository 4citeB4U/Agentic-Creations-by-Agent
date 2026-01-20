# Quick Start Guide

## Getting Started

1. **Open the Application**
   - Open `index-lite.html` in your web browser (recommended - no dependencies)
   - Or open `index.html` if you have internet connection (uses Three.js CDN)

2. **Create Your First 3D Object**

### Phase 1: Blueprint
1. Select a shape (Circle, Square, Triangle, Star, or Heart)
2. Adjust the size using the slider (50-300)
3. Click **"Generate Blueprint"**
4. You'll see a high-contrast silhouette - this is your "contract"
5. Click **"Next →"** to proceed

### Phase 2: Particle Assembly
1. Choose your mode:
   - **2.5D Relief (Fast)**: Best for all devices, minimal depth
   - **Volumetric (High Quality)**: Full 3D depth, requires more processing
2. Adjust particle count (500-5000, recommended: 2000)
3. Click **"Assemble Particles"**
4. Watch particles assemble and rotate with gradient colors
5. Click **"Next →"** to proceed

### Phase 3: Mesh Solidification
1. Enable/disable aura effect (pulsing glow around mesh)
2. Adjust smoothness (0-10, higher = smoother)
3. Click **"Solidify Mesh"**
4. Particles will fade out as the mesh appears
5. Export your creation!

### Export Options
- **📷 Export PNG**: Download a snapshot image
- **📦 Export GLB**: Download 3D model file (can be used in Blender, Unity, etc.)
- **💾 Save Project**: Save your settings as JSON to recreate later

## Tips

- **Performance**: Start with 2000 particles in 2.5D Relief mode
- **Quality**: For final output, use 4000+ particles in Volumetric mode
- **Shapes**: Each shape creates different interesting results
- **Navigation**: Use **"← Previous"** to go back and change settings

## Keyboard Shortcuts

None currently - all controls are via UI buttons and sliders

## Troubleshooting

**Q: The 3D canvas is black**
A: This is normal before clicking "Assemble Particles" or "Solidify Mesh"

**Q: Particles aren't visible**
A: Make sure you generated a blueprint first, then click "Assemble Particles"

**Q: Export buttons are disabled**
A: Complete the mesh solidification step first

**Q: Performance is slow**
A: Reduce particle count or use 2.5D Relief mode

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

Requires HTML5 Canvas support.
