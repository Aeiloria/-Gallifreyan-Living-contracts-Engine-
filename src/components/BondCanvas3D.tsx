/**
 * @file BondCanvas3D.tsx
 * Three.js 3D Procedural Scene for Gallifreyan Matrix Engine
 * Laboratory-grade double-sided embossed medallion, astrolabe gimbals,
 * structural hanging loop, and 4-stage freedom bond vector lattice.
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GallifreyanMatrixModel, MaterialFinish, PlaybackStage, StateClassification, SyntaxToken, ViewportSettings } from '../types/engine';
import { matrixAudio } from '../core/audio';

interface BondCanvas3DProps {
  model: GallifreyanMatrixModel;
  playbackProgress: number; // 0 to 1
  stage: PlaybackStage;
  effectiveClassification: StateClassification;
  settings: ViewportSettings;
  onSelectToken: (token: SyntaxToken | null) => void;
  onCanvasReady?: (group: THREE.Group, renderer: THREE.WebGLRenderer) => void;
}

// Module-level pre-allocated scratch objects to ensure zero GC in animation loop
const _vec3A = new THREE.Vector3();
const _vec3B = new THREE.Vector3();
const _mouse = new THREE.Vector2();

export const BondCanvas3D: React.FC<BondCanvas3DProps> = ({
  model,
  playbackProgress,
  effectiveClassification,
  settings,
  onSelectToken,
  onCanvasReady,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Store mutable refs to avoid re-initializing Three.js on React re-renders
  const stateRef = useRef({
    model,
    playbackProgress,
    effectiveClassification,
    settings,
    explodedCurrent: 0,
    targetFlipAngle: 0,
    currentFlipAngle: 0,
    hoveredTokenId: null as string | null,
    isDragging: false,
    prevPointer: { x: 0, y: 0 },
    camRot: { x: 0.15, y: 0 },
    camTargetRot: { x: 0.15, y: 0 },
    camZoom: 32,
    camTargetZoom: 32,
  });

  // Keep stateRef in sync with incoming props
  useEffect(() => {
    stateRef.current.model = model;
    stateRef.current.playbackProgress = playbackProgress;
    stateRef.current.effectiveClassification = effectiveClassification;
    stateRef.current.settings = settings;
  }, [model, playbackProgress, effectiveClassification, settings]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Renderer Setup (Physical PBR & ACES Filmic) ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // --- Scene & Camera ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050811);
    scene.fog = new THREE.FogExp2(0x050811, 0.015);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, -6, 32);
    camera.lookAt(0, 0, 0);

    // Studio Environment Reflections via PMREMGenerator & RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // --- Studio Lighting Rig (Key, Fill, Rim) ---
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    keyLight.position.set(15, 20, 25);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 5;
    keyLight.shadow.camera.far = 60;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0x38bdf8, 0x050811, 1.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x0284c7, 1.6);
    rimLight.position.set(-18, -12, -15);
    scene.add(rimLight);

    // Soft Radial Contact Shadow Disc
    const shadowGeo = new THREE.PlaneGeometry(36, 36);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x02040a,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.position.set(0, -15, -6);
    contactShadow.rotation.x = -Math.PI / 2.3;
    scene.add(contactShadow);

    // --- Master Medallion Assembly (THREE.Group: 3–12 Procedural Parts) ---
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Sub-groups for Exploded View separation
    const loopGroup = new THREE.Group();     // Layer +3 (Hanging loop & mount collar)
    const frontGroup = new THREE.Group();    // Layer +2 (Front faceplate & extruded Gallifreyan rings)
    const astrolabeGroup = new THREE.Group();// Layer +1 (Gimbal rings & gear teeth)
    const coreGroup = new THREE.Group();     // Layer 0  (Central core crystal & state lattice)
    const reverseGroup = new THREE.Group();  // Layer -2 (Reverse faceplate & reciprocal keylontic grid)
    const chassisGroup = new THREE.Group();  // Layer -1 (Heavy chassis rim bezel)

    masterGroup.add(chassisGroup);
    masterGroup.add(reverseGroup);
    masterGroup.add(coreGroup);
    masterGroup.add(astrolabeGroup);
    masterGroup.add(frontGroup);
    masterGroup.add(loopGroup);

    // Raycast interactive objects registry
    const interactiveMeshes: { mesh: THREE.Mesh; token: SyntaxToken }[] = [];

    // Helper: Material Generator based on Finish
    function createMaterials(finish: MaterialFinish) {
      let mainColor = 0xd97706; // brass default
      let metalness = 0.85;
      let roughness = 0.22;
      let emissive = 0x000000;

      if (finish === 'ASTRAL_TITANIUM') {
        mainColor = 0x94a3b8;
        metalness = 0.95;
        roughness = 0.16;
      } else if (finish === 'VOID_OBSIDIAN') {
        mainColor = 0x1e293b;
        metalness = 0.45;
        roughness = 0.4;
      } else if (finish === 'KEYLONTIC_IRIDESCENT') {
        mainColor = 0xe0f2fe;
        metalness = 0.7;
        roughness = 0.12;
      }

      const metalMat = new THREE.MeshStandardMaterial({
        color: mainColor,
        metalness,
        roughness,
        emissive,
      });

      const crystalMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.92,
        ior: 1.6,
        thickness: 1.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        attenuationColor: new THREE.Color(0x0284c7),
        attenuationDistance: 1.5,
      });

      const runeMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.2,
      });

      const darkMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.6,
        roughness: 0.35,
      });

      return { metalMat, crystalMat, runeMat, darkMat };
    }

    let mats = createMaterials(stateRef.current.settings.materialFinish);

    // ==========================================
    // 1. PART 1: Chassis Outer Stepped Bezel
    // ==========================================
    const chassisGeo = new THREE.CylinderGeometry(12.6, 12.6, 0.8, 64, 1, true);
    const chassisMesh = new THREE.Mesh(chassisGeo, mats.metalMat);
    chassisMesh.rotation.x = Math.PI / 2;
    chassisMesh.castShadow = true;
    chassisMesh.receiveShadow = true;
    chassisGroup.add(chassisMesh);

    // Knurled tactile edge ring
    const knurlTorus = new THREE.Mesh(new THREE.TorusGeometry(12.6, 0.25, 16, 64), mats.metalMat);
    chassisGroup.add(knurlTorus);

    // ==========================================
    // 2. PART 2: Structural Hanging Loop at Zenith
    // ==========================================
    // DO integrate structural hanging loops and double-sided embossing so the generated sigils function as tactile, wearable, or display-ready medallions.
    const loopTorus = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.45, 16, 48), mats.metalMat);
    loopTorus.position.set(0, 13.8, 0);
    loopTorus.castShadow = true;
    loopGroup.add(loopTorus);

    // Mounting Collar Bracket anchoring loop to chassis
    const collarGeo = new THREE.CylinderGeometry(0.8, 1.1, 1.4, 24);
    const collarMesh = new THREE.Mesh(collarGeo, mats.metalMat);
    collarMesh.position.set(0, 12.2, 0);
    collarMesh.castShadow = true;
    loopGroup.add(collarMesh);

    // Secondary suspension swivel ring inside main loop
    const innerSwivel = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.18, 12, 32), mats.metalMat);
    innerSwivel.position.set(0, 13.8, 0);
    loopGroup.add(innerSwivel);

    // ==========================================
    // 3. PART 3: Front Double-Sided Embossed Faceplate
    // ==========================================
    // Outer boundary ring with extruded thickness
    const frontBasePlate = new THREE.Mesh(
      new THREE.CylinderGeometry(12.3, 12.3, 0.22, 64),
      mats.darkMat
    );
    frontBasePlate.rotation.x = Math.PI / 2;
    frontBasePlate.position.z = 0.2;
    frontGroup.add(frontBasePlate);

    // Concentric Gallifreyan Boundary Rings
    for (let r = 1; r <= model.concentricRings; r++) {
      const radius = (r / model.concentricRings) * 11.2;
      const ringWidth = r === model.concentricRings ? 0.28 : 0.14;
      const ringMesh = new THREE.Mesh(
        new THREE.RingGeometry(radius - ringWidth, radius + ringWidth, 64),
        mats.metalMat
      );
      ringMesh.position.z = 0.32;
      ringMesh.castShadow = true;
      frontGroup.add(ringMesh);

      // Radial chapter ticks for temporal governance markings
      if (r === model.concentricRings) {
        const tickCount = 48;
        const tickGeo = new THREE.BoxGeometry(0.12, 0.55, 0.08);
        for (let t = 0; t < tickCount; t++) {
          const tAngle = (t / tickCount) * Math.PI * 2;
          const tick = new THREE.Mesh(tickGeo, mats.runeMat);
          tick.position.set(Math.cos(tAngle) * radius, Math.sin(tAngle) * radius, 0.34);
          tick.rotation.z = tAngle;
          frontGroup.add(tick);
        }
      }
    }

    // Front Circular Syntax Nodes (Gallifreyan Word Clusters & Divots)
    model.tokens.forEach((token) => {
      const tokenGroup = new THREE.Group();
      const posX = Math.cos(token.angle) * token.radius;
      const posY = Math.sin(token.angle) * token.radius;
      tokenGroup.position.set(posX, posY, 0.35);

      // Outer token ring
      const outerRing = new THREE.Mesh(
        new THREE.RingGeometry(token.size * 0.75, token.size * 0.95, 32),
        mats.metalMat
      );
      outerRing.castShadow = true;
      tokenGroup.add(outerRing);

      // Inner disc
      const innerDisc = new THREE.Mesh(
        new THREE.CircleGeometry(token.size * 0.72, 32),
        mats.darkMat
      );
      tokenGroup.add(innerDisc);

      // Vowel divots (interlocking circular ornamentation markers)
      for (let v = 0; v < token.vowelMarkers; v++) {
        const vAngle = token.angle + (v / Math.max(1, token.vowelMarkers)) * Math.PI * 2;
        const vDist = token.size * 0.98;
        const vDot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.15, 16), mats.runeMat);
        vDot.rotation.x = Math.PI / 2;
        vDot.position.set(Math.cos(vAngle) * vDist, Math.sin(vAngle) * vDist, 0.05);
        tokenGroup.add(vDot);
      }

      // Invisible Raycast Proxy Mesh for crisp hit testing
      const hitProxy = new THREE.Mesh(
        new THREE.CircleGeometry(token.size * 1.1, 16),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      tokenGroup.add(hitProxy);
      interactiveMeshes.push({ mesh: hitProxy, token });

      frontGroup.add(tokenGroup);
    });

    // Interlocking Chord Connections (Non-linear syntax vector bridges)
    const chordMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65 });
    model.tokens.forEach((token) => {
      const x1 = Math.cos(token.angle) * token.radius;
      const y1 = Math.sin(token.angle) * token.radius;

      token.chordConnections.forEach((targetId) => {
        const target = model.tokens.find((t) => t.id === targetId);
        if (target) {
          const x2 = Math.cos(target.angle) * target.radius;
          const y2 = Math.sin(target.angle) * target.radius;
          const points = [new THREE.Vector3(x1, y1, 0.36), new THREE.Vector3(x2, y2, 0.36)];
          const chordGeo = new THREE.BufferGeometry().setFromPoints(points);
          const chordLine = new THREE.Line(chordGeo, chordMat);
          frontGroup.add(chordLine);
        }
      });
    });

    // ==========================================
    // 4. PART 4: Reverse Faceplate (Double-Sided Embossing)
    // ==========================================
    // DO integrate double-sided embossing so the generated sigils function as tactile, wearable, or display-ready medallions.
    const reverseBasePlate = new THREE.Mesh(
      new THREE.CylinderGeometry(12.3, 12.3, 0.22, 64),
      mats.darkMat
    );
    reverseBasePlate.rotation.x = -Math.PI / 2;
    reverseBasePlate.position.z = -0.2;
    reverseGroup.add(reverseBasePlate);

    // Reverse Reciprocal Keylontic Scalar Grid
    for (let r = 1; r <= 4; r++) {
      const revRadius = (r / 4) * 10.8;
      const revRing = new THREE.Mesh(
        new THREE.RingGeometry(revRadius - 0.18, revRadius + 0.18, 48),
        mats.metalMat
      );
      revRing.position.z = -0.32;
      revRing.rotation.y = Math.PI;
      reverseGroup.add(revRing);
    }

    // Reverse Embossed 12-Ray Solar/Temporal Astrolabe Cross
    for (let i = 0; i < 12; i++) {
      const rayAngle = (i / 12) * Math.PI * 2;
      const rayGeo = new THREE.BoxGeometry(0.14, 9.8, 0.08);
      const rayMesh = new THREE.Mesh(rayGeo, mats.metalMat);
      rayMesh.position.set(0, 0, -0.33);
      rayMesh.rotation.z = rayAngle;
      reverseGroup.add(rayMesh);
    }

    // Central Reciprocal Seal on Reverse
    const revSeal = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.3, 16, 32), mats.runeMat);
    revSeal.position.z = -0.34;
    reverseGroup.add(revSeal);

    // ==========================================
    // 5. PART 5: Astrolabe Gimbal Rings & Counter-Rotating Gears
    // ==========================================
    const astrolabeOuterRing = new THREE.Mesh(
      new THREE.TorusGeometry(7.5, 0.32, 16, 48),
      mats.metalMat
    );
    astrolabeOuterRing.castShadow = true;
    astrolabeGroup.add(astrolabeOuterRing);

    const astrolabeInnerRing = new THREE.Mesh(
      new THREE.TorusGeometry(5.2, 0.28, 16, 40),
      mats.metalMat
    );
    astrolabeGroup.add(astrolabeInnerRing);

    // Radial gear teeth on intermediate astrolabe ring
    const gearTeethCount = 28;
    const toothGeo = new THREE.BoxGeometry(0.24, 0.6, 0.2);
    for (let g = 0; g < gearTeethCount; g++) {
      const gAngle = (g / gearTeethCount) * Math.PI * 2;
      const tooth = new THREE.Mesh(toothGeo, mats.metalMat);
      tooth.position.set(Math.cos(gAngle) * 5.2, Math.sin(gAngle) * 5.2, 0);
      tooth.rotation.z = gAngle;
      astrolabeGroup.add(tooth);
    }

    // ==========================================
    // 6. PART 6: Central Core Crystal & State Lattice
    // ==========================================
    const crystalGeo = new THREE.OctahedronGeometry(2.4, 0);
    const coreCrystalMesh = new THREE.Mesh(crystalGeo, mats.crystalMat);
    coreCrystalMesh.castShadow = true;
    coreGroup.add(coreCrystalMesh);

    // Surrounding crystal cage brackets
    const cageGeo = new THREE.IcosahedronGeometry(3.0, 1);
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const crystalCage = new THREE.Mesh(cageGeo, cageMat);
    coreGroup.add(crystalCage);

    // ==========================================
    // 7. PART 7: Freedom Bond State Vector Nodes (Node A & Node B)
    // ==========================================
    // Node A (Primary Sovereignty Node)
    const nodeAGroup = new THREE.Group();
    const nodeASphere = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), mats.crystalMat);
    nodeAGroup.add(nodeASphere);
    const nodeAAura = new THREE.Mesh(
      new THREE.RingGeometry(1.4, 1.7, 32),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
    );
    nodeAGroup.add(nodeAAura);
    nodeAGroup.position.set(-5.5, 0, 0);
    coreGroup.add(nodeAGroup);

    // Node B (Coupled Target Autonomy Node)
    const nodeBGroup = new THREE.Group();
    const nodeBSphere = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), mats.crystalMat);
    nodeBGroup.add(nodeBSphere);
    const nodeBAura = new THREE.Mesh(
      new THREE.RingGeometry(1.4, 1.7, 32),
      new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
    );
    nodeBGroup.add(nodeBAura);
    nodeBGroup.position.set(5.5, 0, 0);
    coreGroup.add(nodeBGroup);

    // Connecting State Vector Beam / Crystal Lattice
    // When SELF_SUSTAINING: Iridescent cyan-white crystal lattice!
    // When FORCED: Collapsing dashed grey trace!
    const latticePoints = 32;
    const latticePositions = new Float32Array(latticePoints * 3);
    const latticeGeo = new THREE.BufferGeometry();
    latticeGeo.setAttribute('position', new THREE.BufferAttribute(latticePositions, 3));
    
    const latticeMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.6,
      gapSize: 0.3,
      linewidth: 2,
    });
    const latticeLine = new THREE.Line(latticeGeo, latticeMat);
    latticeLine.computeLineDistances();
    coreGroup.add(latticeLine);

    // Inform parent of ready state
    if (onCanvasReady) {
      onCanvasReady(masterGroup, renderer);
    }

    // --- Interactive Pointer & Raycasting Events ---
    const raycaster = new THREE.Raycaster();

    const handlePointerDown = (e: MouseEvent) => {
      stateRef.current.isDragging = true;
      stateRef.current.prevPointer = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Orbit camera dragging
      if (stateRef.current.isDragging) {
        const deltaX = e.clientX - stateRef.current.prevPointer.x;
        const deltaY = e.clientY - stateRef.current.prevPointer.y;
        stateRef.current.prevPointer = { x: e.clientX, y: e.clientY };

        stateRef.current.camTargetRot.y += deltaX * 0.008;
        stateRef.current.camTargetRot.x = Math.max(-1.2, Math.min(1.2, stateRef.current.camTargetRot.x + deltaY * 0.008));
      }

      // Raycast test on interactive syntax tokens
      raycaster.setFromCamera(_mouse, camera);
      const meshes = interactiveMeshes.map((im) => im.mesh);
      const intersects = raycaster.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const match = interactiveMeshes.find((im) => im.mesh === hit.object);
        if (match && match.token.id !== stateRef.current.hoveredTokenId) {
          stateRef.current.hoveredTokenId = match.token.id;
          container.style.cursor = 'pointer';
          matrixAudio.playAstrolabeTick();
        }
      } else {
        if (stateRef.current.hoveredTokenId !== null) {
          stateRef.current.hoveredTokenId = null;
          container.style.cursor = 'grab';
        }
      }
    };

    const handlePointerUp = (e: MouseEvent) => {
      stateRef.current.isDragging = false;
      const rect = container.getBoundingClientRect();
      _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(_mouse, camera);
      const meshes = interactiveMeshes.map((im) => im.mesh);
      const intersects = raycaster.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const match = interactiveMeshes.find((im) => im.mesh === hit.object);
        if (match) {
          onSelectToken(match.token);
          matrixAudio.playCrystalChime(720);
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      stateRef.current.camTargetZoom = Math.max(16, Math.min(60, stateRef.current.camTargetZoom + e.deltaY * 0.035));
    };

    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // ==========================================
    // 8. Animation & Kinematics Loop
    // ==========================================
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      const { settings: currentSettings, effectiveClassification: currentClass, playbackProgress: progress } = stateRef.current;

      // 1. Damped Camera Orbit & Zoom Interpolation
      const dampFactor = 1 - Math.exp(-12 * delta);
      stateRef.current.camRot.x += (stateRef.current.camTargetRot.x - stateRef.current.camRot.x) * dampFactor;
      stateRef.current.camRot.y += (stateRef.current.camTargetRot.y - stateRef.current.camRot.y) * dampFactor;
      stateRef.current.camZoom += (stateRef.current.camTargetZoom - stateRef.current.camZoom) * dampFactor;

      // Spherical camera positioning
      const cy = Math.cos(stateRef.current.camRot.x);
      camera.position.x = Math.sin(stateRef.current.camRot.y) * cy * stateRef.current.camZoom;
      camera.position.y = Math.sin(stateRef.current.camRot.x) * stateRef.current.camZoom;
      camera.position.z = Math.cos(stateRef.current.camRot.y) * cy * stateRef.current.camZoom;
      camera.lookAt(0, 0, 0);

      // 2. Damped Exploded View Separation along Z
      stateRef.current.explodedCurrent += (currentSettings.explodedView - stateRef.current.explodedCurrent) * dampFactor;
      const expl = stateRef.current.explodedCurrent * 7.5; // Max 7.5 unit separation

      frontGroup.position.z = expl * 1.5;
      astrolabeGroup.position.z = expl * 0.8;
      coreGroup.position.z = 0;
      reverseGroup.position.z = -expl * 1.5;
      chassisGroup.position.z = -expl * 0.4;
      loopGroup.position.z = expl * 0.5;

      // 3. Astrolabe Rotation (Rotational kinematics)
      if (currentSettings.isAutoRotate) {
        masterGroup.rotation.z += 0.003 * currentSettings.rotationSpeed;
      }
      astrolabeOuterRing.rotation.z += 0.006 * currentSettings.rotationSpeed;
      astrolabeInnerRing.rotation.z -= 0.009 * currentSettings.rotationSpeed;
      crystalCage.rotation.x = elapsed * 0.25;
      crystalCage.rotation.y = elapsed * 0.35;
      coreCrystalMesh.rotation.y = -elapsed * 0.4;

      // 4. Update Node A and Node B positions according to 4-Stage state vectors
      // Stage A (progress <= 0.05): Initial state x
      // Stage B (progress <= 0.33): Applied influence V1
      // Stage C (progress <= 0.66): State delta Δz
      // Stage D (progress > 0.66): Removal of V1 (Self-sustaining vs Forced collapse)
      let distA = 5.5;
      let distB = 5.5;
      let auraOpacityA = 0.8;
      let auraOpacityB = 0.8;

      if (progress <= 0.33) {
        // Applying V1
        const t = progress / 0.33;
        distA = 5.5 - t * 0.6;
        distB = 5.5 + t * 0.8;
      } else if (progress <= 0.66) {
        // Delta phase
        distA = 4.9;
        distB = 6.3;
      } else {
        // Stage D: Persistence removal
        const t = (progress - 0.66) / 0.34;
        if (currentClass === 'FORCED') {
          // Violent collapse to degraded state
          distA = 4.9 + t * 2.5;
          distB = 6.3 - t * 3.8;
          auraOpacityB = Math.max(0.1, 0.8 - t * 0.7);
        } else if (currentClass === 'ADAPTED') {
          // Settles into steady adapted orbit
          distA = 4.9 + t * 0.3;
          distB = 6.3 - t * 0.4;
        } else {
          // Self-sustaining iridescent freedom bond!
          distA = 4.9;
          distB = 6.3;
          auraOpacityB = 0.95;
        }
      }

      nodeAGroup.position.x = -distA;
      nodeBGroup.position.x = distB;
      nodeAAura.scale.setScalar(1 + Math.sin(elapsed * 3) * 0.06);
      nodeBAura.scale.setScalar(1 + Math.cos(elapsed * 3) * 0.06);

      // 5. Update State Lattice Vector Beam Representation
      // Render state classifications strictly as:
      // SELF_SUSTAINING: iridescent cyan-white crystal lattice
      // FORCED: collapsing dashed grey trace
      // ADAPTED: amber harmonic transition
      // BASELINE: neutral blue calibration
      const posAttr = latticeGeo.getAttribute('position') as THREE.BufferAttribute;
      const pA = nodeAGroup.position;
      const pB = nodeBGroup.position;

      for (let i = 0; i < latticePoints; i++) {
        const u = i / (latticePoints - 1);
        _vec3A.lerpVectors(pA, pB, u);

        // Add harmonic wave oscillation
        let wave = Math.sin(u * Math.PI * 4 + elapsed * 6) * 0.35;
        if (currentClass === 'FORCED' && progress > 0.66) {
          // Broken/decaying oscillation
          wave *= (1 - (progress - 0.66) / 0.34);
        }

        posAttr.setXYZ(i, _vec3A.x, _vec3A.y + wave, _vec3A.z);
      }
      posAttr.needsUpdate = true;
      latticeLine.computeLineDistances();

      // Dynamic Material & Color Tweaks based on Classification
      if (currentClass === 'SELF_SUSTAINING') {
        latticeMat.color.setHex(0xa5f3fc); // Iridescent cyan-white crystal lattice
        mats.crystalMat.color.setHex(0x38bdf8);
        mats.crystalMat.attenuationColor.setHex(0xa5f3fc);
        crystalCage.material.color.setHex(0xa5f3fc);
        latticeMat.dashSize = 0.8;
        latticeMat.gapSize = 0.15;
      } else if (currentClass === 'FORCED') {
        latticeMat.color.setHex(0x64748b); // Collapsing dashed grey trace
        mats.crystalMat.color.setHex(0x475569);
        crystalCage.material.color.setHex(0x64748b);
        latticeMat.dashSize = 0.3;
        latticeMat.gapSize = 0.5;
      } else if (currentClass === 'ADAPTED') {
        latticeMat.color.setHex(0xf59e0b); // Amber harmonic transition
        mats.crystalMat.color.setHex(0xfbbf24);
        crystalCage.material.color.setHex(0xf59e0b);
      } else {
        latticeMat.color.setHex(0x0ea5e9); // Neutral blue baseline
        mats.crystalMat.color.setHex(0x38bdf8);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup WebGL on component unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);

      // Deep geometry and material disposal
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [model.rawSyntax, settings.materialFinish]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden"
    />
  );
};
