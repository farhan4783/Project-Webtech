import { useEffect, useRef } from 'react';

const ARScene = ({ onScan, arData, isScanning }) => {
  const sceneRef = useRef(null);

  // 💻 DESKTOP MODE: Set TRUE to test on laptop (Click screen to scan)
  // 📱 MOBILE MODE: Set FALSE to use Reticle on phone (Tap ring to scan)
  const IS_DESKTOP_DEV = true;

  useEffect(() => {
    const scene = sceneRef.current;
    const handleTap = () => {
      let spawnPos = { x: 0, y: 0, z: -2 };
      let spawnRot = { x: 0, y: 0, z: 0 };

      if (!IS_DESKTOP_DEV) {
        const reticle = document.getElementById('reticle');
        if (reticle && reticle.object3D.visible) {
          spawnPos = reticle.object3D.position.clone();
          spawnRot = reticle.object3D.rotation.clone();
        } else return;
      }
      onScan(spawnPos, spawnRot);
    };
    scene.addEventListener('click', handleTap);
    return () => scene.removeEventListener('click', handleTap);
  }, [onScan]);

  return (
    <a-scene
      ref={sceneRef}
      renderer="alpha: true; colorManagement: true;"
      vr-mode-ui="enabled: false"
      webxr={IS_DESKTOP_DEV ? false : "optionalFeatures: hit-test, dom-overlay; overlayElement: .ui-layer"}
    >
      <a-camera position="0 1.6 0" look-controls="enabled: true"></a-camera>

      <a-light type="point" intensity="2" position="0 2 0" color="#00E5FF" distance="5"></a-light>
      <a-light type="ambient" intensity="0.8"></a-light>

      {/* 1. SCANNING RING ANIMATION */}
      {isScanning && (
        <a-entity position="0 0 -2">
          <a-ring
            radius-inner="0.6" radius-outer="0.62" color="#00E5FF" opacity="0.6"
            animation="property: scale; from: 1 1 1; to: 1.1 1.1 1.1; dir: alternate; loop: true; dur: 400"
          ></a-ring>
          <a-ring
            radius-inner="0.5" radius-outer="0.55" color="#00E5FF" opacity="0.4" theta-length="270"
            animation="property: rotation; to: 0 0 -360; loop: true; dur: 2000; easing: linear"
          ></a-ring>
        </a-entity>
      )}

      {/* 2. TRACKED OBJECT UI */}
      {arData && (
        <a-entity position={`${arData.position.x} ${arData.position.y} ${arData.position.z}`}>
          {/* Main Billboard Group that faces the user */}
          <a-entity look-at="[camera]">

            {/* CENTER ANCHOR (The Object) */}
            <a-sphere radius="0.03" color="white" opacity="0.9" animation="property: scale; from: 0 0 0; to: 1 1 1; dur: 400; easing: easeOutBack"></a-sphere>
            <a-ring radius-inner="0.04" radius-outer="0.05" color="white" opacity="0.5" animation="property: scale; from: 0 0 0; to: 1.5 1.5 1.5; loop: true; dir: alternate; dur: 1000"></a-ring>

            {/* --- LINE CONNECTORS (Center to Cards) --- */}
            {/* 1. Center to Price (Left) */}
            {/* Vector: (-0.7, 0.25). Length: ~0.74. Angle: 160deg. RotZ: 70deg. Mid: (-0.35, 0.125) */}
            <a-cylinder
              color="#4ADE80" height="0.75" radius="0.003" opacity="0.8"
              position="-0.35 0.125 0" rotation="0 0 70"
              animation="property: scale; from: 1 0 1; to: 1 1 1; dur: 800; easing: easeOutExpo"
            ></a-cylinder>

            {/* 2. Center to Cost (Right Top) */}
            {/* Vector: (0.8, 0.35). Length: ~0.87. Angle: 23deg. RotZ: -67deg. Mid: (0.4, 0.175) */}
            <a-cylinder
              color="#67E8F9" height="0.88" radius="0.003" opacity="0.8"
              position="0.4 0.175 0" rotation="0 0 -67"
              animation="property: scale; from: 1 0 1; to: 1 1 1; dur: 800; delay: 100; easing: easeOutExpo"
            ></a-cylinder>

            {/* 3. Center to Impact (Right Bottom) */}
            {/* Vector: (0.8, -0.6). Length: ~1.0. Angle: -37deg. RotZ: -127deg. Mid: (0.4, -0.3) */}
            <a-cylinder
              color="#F87171" height="1.0" radius="0.003" opacity="0.8"
              position="0.4 -0.3 0" rotation="0 0 -127"
              animation="property: scale; from: 1 0 1; to: 1 1 1; dur: 800; delay: 200; easing: easeOutExpo"
            ></a-cylinder>


            {/* --- INFO CARDS --- */}

            {/* LEFT: PRICE TAG (Green) */}
            <a-entity position="-0.7 0.25 0" animation="property: position; from: 0 0 0; to: -0.7 0.25 0; dur: 800; easing: easeOutExpo">
              {/* Endpoint Dot */}
              <a-sphere radius="0.015" color="#4ADE80"></a-sphere>

              {/* Card Container */}
              <a-entity position="-0.25 0 0"> {/* Shift textual content left of the connection point */}
                <a-box width="1.4" height="0.6" depth="0.02" color="#022c22" opacity="0.8"></a-box>
                <a-box width="1.42" height="0.62" depth="0.01" color="#4ADE80" opacity="0.2" wireframe="true"></a-box>

                <a-text value="PRICE" align="center" position="0 0.15 0.05" scale="1 1 1" color="#86efac"></a-text>
                <a-text value={`Rs ${arData.price ? arData.price.toLocaleString() : '0'}`} align="center" position="0 -0.1 0.05" scale="2.2 2.2 2.2" color="white" font="kelsonsans"></a-text>
              </a-entity>
            </a-entity>


            {/* RIGHT TOP: REAL COST (Blue) */}
            <a-entity position="0.8 0.35 0" animation="property: position; from: 0 0 0; to: 0.8 0.35 0; dur: 800; delay: 100; easing: easeOutExpo">
              <a-sphere radius="0.015" color="#67E8F9"></a-sphere>

              <a-entity position="0.5 0 0">
                <a-box width="2.0" height="0.7" depth="0.02" color="#083344" opacity="0.8"></a-box>
                <a-box width="2.02" height="0.72" depth="0.01" color="#67E8F9" opacity="0.2" wireframe="true"></a-box>

                <a-text value="REAL COST (WORK HOURS)" align="center" position="0 0.15 0.05" scale="1 1 1" color="#A5F3FC"></a-text>
                <a-text value={`${arData.hours} Hours`} align="center" position="0 -0.1 0.05" scale="2 2 2" color="white" font="kelsonsans"></a-text>
              </a-entity>
            </a-entity>


            {/* RIGHT BOTTOM: IMPACT (Red) */}
            <a-entity position="0.8 -0.6 0" animation="property: position; from: 0 0 0; to: 0.8 -0.6 0; dur: 800; delay: 200; easing: easeOutExpo">
              <a-sphere radius="0.015" color="#F87171"></a-sphere>

              <a-entity position="0.5 0 0">
                <a-box width="2.0" height="0.9" depth="0.02" color="#450a0a" opacity="0.9"></a-box>
                <a-box width="2.02" height="0.92" depth="0.01" color="#EF4444" opacity="0.3" wireframe="true"></a-box>

                <a-text value="FINANCIAL IMPACT" align="center" position="0 0.25 0.05" scale="1.1 1.1 1.1" color="#FCA5A5"></a-text>
                <a-text value={arData.impact} align="center" position="0 -0.1 0.05" scale="1.2 1.2 1.2" color="white" wrap-count="22"></a-text>
              </a-entity>
            </a-entity>

          </a-entity>
        </a-entity>
      )}

      {/* Mobile Reticle */}
      {!IS_DESKTOP_DEV && (
        <a-entity id="reticle" ar-hit-test="target: #reticle; type: map" geometry="primitive: ring; radiusInner: 0.05; radiusOuter: 0.06" material="color: #00E5FF; shader: flat" rotation="-90 0 0" visible="false"></a-entity>
      )}

    </a-scene>
  );
};

export default ARScene;