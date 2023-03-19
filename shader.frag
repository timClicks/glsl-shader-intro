#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;


void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord / u_resolution.xy;

    // Time-based variables for smooth animation
    float t = u_time * 1.5;
    float t1 = sin(t) * 0.5 + 0.5;
    float t2 = cos(t) * 0.5 + 0.5;

    // Color components
    float r = sin(2.0 * uv.x + t1) * 0.5 + 0.5;
    float g = cos(3.0 * uv.y + t2) * 0.5 + 0.5;
    float b = sin(4.0 * (uv.x + uv.y) + t1 + t2) * 0.5 + 0.5;

    // Output the final color
    fragColor = vec4(r, g, b, 1.0);
}


void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}