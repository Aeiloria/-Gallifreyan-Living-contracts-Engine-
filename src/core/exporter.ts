/**
 * @file exporter.ts
 * Procedural STL and SVG Exporters for Gallifreyan Matrix Engine
 * Enables 3D printing of the tactile double-sided medallion with hanging loop.
 */

import * as THREE from 'three';
import { GallifreyanMatrixModel } from '../types/engine';

/**
 * Procedural STL Exporter from Three.js Object3D
 * Converts any THREE.Mesh / THREE.Group into ASCII STL for 3D printing.
 */
export function exportToSTL(object: THREE.Object3D, filename: string = 'Gallifreyan_Medallion.stl') {
  const triangles: { normal: THREE.Vector3; a: THREE.Vector3; b: THREE.Vector3; c: THREE.Vector3 }[] = [];
  const _vA = new THREE.Vector3();
  const _vB = new THREE.Vector3();
  const _vC = new THREE.Vector3();
  const _cb = new THREE.Vector3();
  const _ab = new THREE.Vector3();

  object.updateMatrixWorld(true);

  object.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      const geom = child.geometry.clone();
      geom.applyMatrix4(child.matrixWorld);

      let positionAttr = geom.getAttribute('position');
      if (!positionAttr) return;

      const index = geom.getIndex();
      if (index) {
        for (let i = 0; i < index.count; i += 3) {
          const a = index.getX(i);
          const b = index.getX(i + 1);
          const c = index.getX(i + 2);

          _vA.fromBufferAttribute(positionAttr, a);
          _vB.fromBufferAttribute(positionAttr, b);
          _vC.fromBufferAttribute(positionAttr, c);

          _cb.subVectors(_vC, _vB);
          _ab.subVectors(_vA, _vB);
          _cb.cross(_ab).normalize();

          triangles.push({
            normal: _cb.clone(),
            a: _vA.clone(),
            b: _vB.clone(),
            c: _vC.clone(),
          });
        }
      } else {
        for (let i = 0; i < positionAttr.count; i += 3) {
          _vA.fromBufferAttribute(positionAttr, i);
          _vB.fromBufferAttribute(positionAttr, i + 1);
          _vC.fromBufferAttribute(positionAttr, i + 2);

          _cb.subVectors(_vC, _vB);
          _ab.subVectors(_vA, _vB);
          _cb.cross(_ab).normalize();

          triangles.push({
            normal: _cb.clone(),
            a: _vA.clone(),
            b: _vB.clone(),
            c: _vC.clone(),
          });
        }
      }
    }
  });

  // Build STL ASCII text
  let output = `solid Gallifreyan_Medallion\n`;
  for (const tri of triangles) {
    output += `  facet normal ${tri.normal.x.toExponential(6)} ${tri.normal.y.toExponential(6)} ${tri.normal.z.toExponential(6)}\n`;
    output += `    outer loop\n`;
    output += `      vertex ${tri.a.x.toExponential(6)} ${tri.a.y.toExponential(6)} ${tri.a.z.toExponential(6)}\n`;
    output += `      vertex ${tri.b.x.toExponential(6)} ${tri.b.y.toExponential(6)} ${tri.b.z.toExponential(6)}\n`;
    output += `      vertex ${tri.c.x.toExponential(6)} ${tri.c.y.toExponential(6)} ${tri.c.z.toExponential(6)}\n`;
    output += `    endloop\n`;
    output += `  endfacet\n`;
  }
  output += `endsolid Gallifreyan_Medallion\n`;

  const blob = new Blob([output], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Generate full SVG Vector Blueprint of the Gallifreyan Sigil
 */
export function exportToSVG(model: GallifreyanMatrixModel, filename: string = 'Gallifreyan_Sigil.svg') {
  const size = 800;
  const center = size / 2;
  const scale = (size * 0.4) / model.outerRadius;

  let svg = `<?xml version="1.0" standalone="no"?>\n`;
  svg += `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">\n`;
  svg += `  <rect width="100%" height="100%" fill="#050811"/>\n`;

  // Concentric Rings
  for (let r = 1; r <= model.concentricRings; r++) {
    const rad = (r / model.concentricRings) * model.outerRadius * scale;
    const strokeWidth = r === model.concentricRings ? 4 : (r % 2 === 0 ? 2 : 1.2);
    const stroke = r === model.concentricRings ? '#38bdf8' : '#0ea5e9';
    const dash = r % 2 === 1 ? 'stroke-dasharray="8 4"' : '';
    svg += `  <circle cx="${center}" cy="${center}" r="${rad}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" ${dash} opacity="0.85"/>\n`;
  }

  // Structural Hanging Loop at top
  const loopCenterY = center - (model.outerRadius + 1.2) * scale;
  svg += `  <!-- Structural Hanging Loop -->\n`;
  svg += `  <circle cx="${center}" cy="${loopCenterY}" r="${2.2 * scale}" fill="none" stroke="#38bdf8" stroke-width="4"/>\n`;
  svg += `  <circle cx="${center}" cy="${loopCenterY}" r="${1.2 * scale}" fill="none" stroke="#38bdf8" stroke-width="2"/>\n`;

  // Syntax chord rays
  for (const token of model.tokens) {
    const x1 = center + Math.cos(token.angle) * token.radius * scale;
    const y1 = center + Math.sin(token.angle) * token.radius * scale;

    for (const cId of token.chordConnections) {
      const target = model.tokens.find((t) => t.id === cId);
      if (target) {
        const x2 = center + Math.cos(target.angle) * target.radius * scale;
        const y2 = center + Math.sin(target.angle) * target.radius * scale;
        svg += `  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#38bdf8" stroke-width="1.5" opacity="0.6"/>\n`;
      }
    }
  }

  // Token Circles & Vowel divots
  for (const token of model.tokens) {
    const cx = center + Math.cos(token.angle) * token.radius * scale;
    const cy = center + Math.sin(token.angle) * token.radius * scale;
    const r = token.size * scale * 0.7;

    svg += `  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#0f172a" stroke="#f43f5e" stroke-width="2.5"/>\n`;
    svg += `  <circle cx="${cx}" cy="${cy}" r="${r * 0.4}" fill="none" stroke="#10b981" stroke-width="1.5"/>\n`;

    // Vowel markers
    for (let v = 0; v < token.vowelMarkers; v++) {
      const vAngle = token.angle + (v / Math.max(1, token.vowelMarkers)) * Math.PI * 2;
      const vx = cx + Math.cos(vAngle) * (r + 4);
      const vy = cy + Math.sin(vAngle) * (r + 4);
      svg += `  <circle cx="${vx}" cy="${vy}" r="3" fill="#38bdf8"/>\n`;
    }

    svg += `  <text x="${cx}" y="${cy + 3}" fill="#e2e8f0" font-size="9" font-family="monospace" text-anchor="middle">${token.text}</text>\n`;
  }

  // Metadata footer
  svg += `  <text x="24" y="${size - 24}" fill="#64748b" font-size="11" font-family="monospace">AEILORIA.CORE // ${model.title}</text>\n`;
  svg += `</svg>\n`;

  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
