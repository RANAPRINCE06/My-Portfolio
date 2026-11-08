/**
 * CyberCore GLSL Fragment Shader.
 * Generates an Apple-grade, chromatic-dispersed cybernetic energy volume:
 * - Dual-angle Fresnel rim (Cyan / Violet chromatic split)
 * - Deep dark core base with subtle procedural energy ribbons
 * - Controlled emissive radiance without flat neon saturation
 */
export const cyberCoreFragmentShader = /* glsl */ `
uniform float uTime;
uniform vec3 uCyanColor;
uniform vec3 uVioletColor;
uniform vec3 uDarkBaseColor;
uniform float uFresnelPower;
uniform float uIntensity;
uniform float uOpacity;
uniform float uPulseSpeed;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;
varying float vDisplacement;
varying vec2 vUv;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);

  // 1. Dual-Angle Fresnel Calculation (Simulating Chromatic Edge Dispersion)
  float baseFresnel = 1.0 - clamp(dot(normal, viewDir), 0.0, 1.0);
  // Cyan rim forms the outer razor-thin fringe
  float fresnelCyan = pow(baseFresnel, uFresnelPower * 0.9);
  // Violet rim forms the deeper inner glow
  float fresnelViolet = pow(baseFresnel, uFresnelPower * 1.25);

  // 2. Procedural Energy Ribbons & Harmonics
  // Animated vertical and diagonal traveling energy bands
  float ribbonWave = sin(vWorldPosition.y * 5.5 - uTime * uPulseSpeed + vDisplacement * 8.0);
  float ribbon = smoothstep(-0.25, 0.75, ribbonWave);

  // Subtle latitudinal harmonic scanning lattice
  float scanLattice = sin(vWorldPosition.y * 22.0 + uTime * 1.4) * 0.5 + 0.5;
  scanLattice = pow(scanLattice, 3.5) * 0.18;

  // 3. Deep Dark Base Composition
  // Deep void tone (#050814) blending into electric violet in displacement hollows
  float displacementFactor = clamp(vDisplacement * 3.0 + 0.35, 0.0, 1.0);
  vec3 baseColor = mix(uDarkBaseColor, uVioletColor * 0.45, displacementFactor);

  // Blend in cyan energy along the dynamic pulse ribbons and lattice lines
  vec3 coreColor = mix(baseColor, uCyanColor * 0.85, ribbon * 0.5 + scanLattice);

  // 4. Chromatic Edge Illumination
  coreColor += uCyanColor * fresnelCyan * 0.75;
  coreColor += uVioletColor * fresnelViolet * 0.85;

  // 5. Alpha & Emission Control
  // Translucent volume: higher opacity on the rim gives crystalline depth
  float alpha = clamp(uOpacity * (0.65 + 0.35 * baseFresnel), 0.0, 1.0);

  gl_FragColor = vec4(coreColor * uIntensity, alpha);
}
`;

