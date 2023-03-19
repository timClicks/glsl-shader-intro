# glsl-intro-tutorial

![](https://img.youtube.com/vi/sMkgXh7ThT4/maxresdefault.jpg)

# About

An introduction to using the OpenGL Shading Language (GLSL) language
on the web via WebGL. 

# Usage

You should load the `glsl.html` file via a local web server.
For example, Python should work fine to start a server:

```console
$ python3 -m http.server
```

Now open a browser at <http://localhost:8000/glsl.html>.


# Discussion


I've always wanted to create a "shader" -- a graphics program that works really fast (it runs on your GPU) -- but I've always been put off because they seemed really difficult.

Shaders come in two forms: fragment shaders and vertex shaders. Fragment shaders are what we care about here, because they're more useful for drawing. A fragment shader is a type of shader that processes individual fragments (pixels) on the screen. It is responsible for determining the color of each pixel in the final rendered image. GLSL is a C-like language used for writing shaders in OpenGL.

All of this complexity has kept me away for a long time. Today I managed to put that fear aside and create this - a fun dynamic gradient background:


## Running the shader yourself..

### .. in ShaderToy

ShaderToy is an interactive web playground for running shaders.

```glsl
void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord / iResolution.xy;

    // Time-based variables for smooth animation
    float t = iTime * 1.5;
    float t1 = sin(t) * 0.5 + 0.5;
    float t2 = cos(t) * 0.5 + 0.5;

    // Color components
    float r = sin(3.0 * uv.x + t1) * 0.5 + 0.5;
    float g = cos(3.0 * uv.y + t2) * 0.5 + 0.5;
    float b = sin(4.0 * (uv.x + uv.y) + t1 + t2) * 0.5 + 0.5;

    // Output the final color
    fragColor = vec4(r, g, b, 1.0);
}
```

To use this shader, follow these steps:

1. Go to <https://www.shadertoy.com/new>.
1. Replace the existing code in the "`mainImage`" function with the code provided above.
1. Click the "Play" button.

### .. locally 

If you want to learn how to use a shader in your own projects, you'll need to do a little more work to set things up.

The project has two files:

- `glsl.html` - the main webpage
- `shader.frag` - a _fragment shader_

`glsl.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>GLSL/WebGL Shader Example</title>
    <meta name="author" content="Tim McNamara">
    <meta property=”og:url content=”https://github.com/timClicks/glsl-shader-intro” />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script type="text/javascript" src="https://rawgit.com/patriciogonzalezvivo/glslCanvas/master/dist/GlslCanvas.js"></script>
    <style>
        html, body {
          width:  100%;
          height: 100%;
          margin: 0;
        }
        canvas {
            display: block;
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <canvas class="glslCanvas" data-fragment-url="shader.frag"></canvas>
    <script>
        const canvas = document.querySelector('.glslCanvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const sandbox = new GlslCanvas(canvas);
    </script>
</body>
</html>
```

`shader.frag`:

```glsl
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
```

Note: the variables in WebGL are different than those available in ShaderToy. ShaderToy's `iResolution` becomes `u_resolution` and its `iTime` becomes `u_time`.

## Explaining the code

The GLSL code in `shader.frag` is relatively short, but still fairly off-putting. Let's break it down.

**Preprocessor**

To start, we have a "Preprocessor directive". The compiler has stages, and one of the initial stages is called the "Preprocessor". 

  ```glsl
  #ifdef GL_ES
  precision mediump float;
  #endif
  ```

  This part checks if the shader is running on OpenGL ES (Embedded Systems), a subset of OpenGL for mobile and embedded devices. If so, it sets the default floating-point precision to "medium." Precision indicates the accuracy and range of floating-point variables. "Medium" precision offers a balance between performance and accuracy.

**Creating two "uniform" (global) variables**

```glsl
uniform float u_time;
uniform vec2 u_resolution;
```

Uniform variables are global variables that can be set from outside the shader, usually from the application code. In this case, `u_time` represents the elapsed time, and `u_resolution` represents the screen resolution as a 2D vector (width, height).

**mainImage function**

```glsl
void mainImage(out vec4 fragColor, in vec2 fragCoord)
```

The `mainImage` function processes the fragment color (`fragColor`) based on the fragment coordinates (`fragCoord`). It takes an "output variable" `fragColor` of type `vec4` rather than use a return value to set the color of the fragment (pixel) and an input variable `fragCoord` of type `vec2` that describes the fragment's coordinates.

**Normalize pixel coordinates**

```glsl
vec2 uv = fragCoord / u_resolution.xy;
```
This line translates the fragment's coordinates between absolute position and a relative position between 0 and 100%. I use the term normalized because the coordinates `uv` are independent from the device that is rendering the shader, whereas `fragCoord` is device-specific. The code calculates `uv` by dividing the fragment coordinates by the resolution. The uv coordinates will range from (0, 0) to (1, 1), representing the bottom-left and top-right corners of the screen, respectively.

**Changing what's displayed over time**

```glsl
float t = u_time * 1.5;
float t1 = sin(t) * 0.5 + 0.5;
float t2 = cos(t) * 0.5 + 0.5;
```

These lines create time-based variables for smooth animation. The `t` variable scales the elapsed time (`u_time`), while `t1` and `t2` use sine and cosine functions to create smoothly changing values that oscillate between 0 and 1. 

Changing the constant being multiplied with `u_time` changes how quickly the image changes. Adjusting how `t1` and `t2` behave will affect the cycle that produces the colors.

**Calculate color components (red, green, blue)**

```glsl
float r = sin(2.0 * uv.x + t1) * 0.5 + 0.5;
float g = cos(3.0 * uv.y + t2) * 0.5 + 0.5;
float b = sin(4.0 * (uv.x + uv.y) + t1 + t2) * 0.5 + 0.5;
```

These lines calculate the red, green, and blue color components for each fragment using the time-based variables and the normalized pixel coordinates. The sine and cosine functions generate smoothly varying values, creating color gradients on the screen.

**Set the pixel's color**

```glsl
fragColor = vec4(r, g, b, 1.0);
```

This line sets the output `fragColor` with the calculated color components (`r`, `g`, `b`) and an alpha (transparency) value of 1.0 (fully opaque).

**Main function**

```glsl
void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
```

The `main` function is the entry point of the shader. Its only job is to call the `mainImage` function that we've just chatted about. I've included `mainImage` to simplify refactoring and translating between your own HTML and ShaderToy's hosted environment.


## Expanding the shader

You can further experiment with this shader by adjusting the parameters, such as the coefficients in the sine (`sin`) and cosine (`cos`) functions that produce color components, to create different effects.


# Legal

Copyright owner: Tim McNamara <tim@mcnamara.nz>

Code available for re-use under the MIT-0 licence.

Documentation available for re-use under the CC-BY-4.0 licence.

