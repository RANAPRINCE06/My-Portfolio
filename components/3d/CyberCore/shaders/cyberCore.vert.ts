/**
 * CyberCore GLSL Vertex Shader.
 * Computes multi-frequency 3D procedural noise displacement on vertices,
 * producing organic, rhythmic deformation with stable normals.
 */
export const cyberCoreVertexShader = /* glsl */ `
uniform float uTime;
uniform float uDisplacementStrength;
uniform float uNoiseFrequency;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;
varying float vDisplacement;
varying vec2 vUv;

// Efficient periodic 3D sinusoidal noise
float hashNoise(vec3 p) {
  vec3 s = sin(p * uNoiseFrequency + uTime * 0.7);
  vec3 c = cos(p.zxy * (uNoiseFrequency * 1.5) - uTime * 0.5);
  return (s.x * c.y + s.y * c.z + s.z * c.x) / 3.0;
}

// Multi-octave fractional Brownian noise (3 octaves for high visual quality at low GPU cost)
float calculateDisplacement(vec3 p) {
  float value = 0.0;
  float amplitude = 0.55;
  vec3 pos = p;

  for (int i = 0; i < 3; i++) {
    value += amplitude * hashNoise(pos);
    pos = pos * 2.1 + vec3(1.7, 9.2, 4.3);
    amplitude *= 0.45;
  }

  return value * uDisplacementStrength;
}

void main() {
  vUv = uv;

  // Calculate base displacement along surface normal
  float disp = calculateDisplacement(position);
  vDisplacement = disp;

  // Displace vertex along original geometric normal
  vec3 displacedPosition = position + normal * disp;

  // Pass transformed normal in view space
  vNormal = normalize(normalMatrix * normal);

  // Calculate world and view positions for lighting & fresnel calculation
  vec4 worldPosition = modelMatrix * vec4(displacedPosition, 1.0);
  vWorldPosition = worldPosition.xyz;

  vec4 mvPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
  vViewPosition = -mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
`;

