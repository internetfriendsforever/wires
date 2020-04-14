export default class Shader {
  setup (regl) {
    this.draw = regl({
      vert: this.constructor.vert,
      frag: this.constructor.frag,

      attributes: {
        position: regl.prop('position'),
        normal: regl.prop('normal')
      },

      uniforms: {
        dimensions: ({ viewportWidth, viewportHeight, pixelRatio }) => [
          viewportWidth / pixelRatio,
          viewportHeight / pixelRatio
        ]
      },

      count: (context, props) => {
        return props.position.length
      },

      primitive: 'triangle strip',

      depth: {
        enable: false
      }
    })
  }
}

Shader.vert = `
  precision mediump float;
  attribute vec2 position;
  attribute vec2 normal;
  uniform vec2 dimensions;
  varying vec2 uv;

  const vec2 flip = vec2(0.0, -0.0);

  void main () {
    uv = normal;
    float x = (position.x / dimensions.x) * 2.0 - 1.0;
    float y = -((position.y / dimensions.y) * 2.0 - 1.0);
    gl_Position = vec4(x, y, 0, 1);
  }
`

Shader.frag = `
  precision mediump float;
  varying vec2 uv;

  void main () {
    gl_FragColor = vec4(uv, 1.0, 1.0);
  }
`

// class LineShader extends Shader {}

// Shader.Line = LineShader





// const shape = regl({
//   vert: `
//     precision mediump float;
//     attribute vec2 position;
//     attribute vec2 normal;
//     uniform mat4 projection;
//     uniform mat4 view;
//     varying vec2 uv;

//     void main () {
//       uv = normal;
//       gl_Position = projection * view * vec4(position * 2.0 - 1.0, 0, 1);
//     }
//   `,

//   attributes: {
//     position: regl.prop('position'),
//     normal: regl.prop('normal')
//   },

//   uniforms: {
//     time: regl.prop('time')
//   },

//   count: (context, props) => {
//     return props.position.length
//   },

//   primitive: 'triangle strip',

//   depth: {
//     enable: false
//   },

//   blend: {
//     enable: true,
//     func: {
//       src: 'src alpha',
//       dst: 'one minus src alpha'
//     }
//   }
// })

// const debug = regl({
//   frag: `
//     precision mediump float;

//     void main () {
//       gl_FragColor = vec4(1, 1, 1, 1);
//     }
//   `,

//   primitive: 'line'
// })

// const edges = regl({
//   frag: `
//     precision mediump float;
//     uniform float time;
//     varying vec2 uv;

//     void main () {
//       vec3 color = vec3(0.0);
//       float edges = smoothstep(0.1, 0.00, uv.y) + smoothstep(0.9, 1.0, uv.y);
//       color += vec3(edges);
//       gl_FragColor = vec4(color, edges);
//     }
//   `
// })

// const styles = [
//   regl({
//     frag: `
//       precision mediump float;
//       uniform float time;
//       varying vec2 uv;

//       void main () {
//         vec3 color = vec3(0.0);
//         float flow = smoothstep(0.8, 1.0, sin(uv.y * 5.0 - 1.0 + sin((uv.x - time * 0.5) * 500.0)));
//         color += vec3(flow, flow * 0.2, flow * 0.4);
//         gl_FragColor = vec4(color, flow);
//       }
//     `
//   }),

//   regl({
//     frag: `
//       precision mediump float;
//       uniform float time;
//       varying vec2 uv;

//       void main () {
//         vec3 color = vec3(0.0);
//         float flow = smoothstep(0.5, 0.51, sin(uv.x * 1000.0 - time * 300.0) + cos(uv.y * 20.0 + 2.5));
//         color += vec3(flow * 1.0, flow * 1.0, flow * 0.4);
//         gl_FragColor = vec4(color, flow);
//       }
//     `
//   }),

//   regl({
//     frag: `
//       precision mediump float;
//       uniform float time;
//       varying vec2 uv;

//       void main () {
//         vec3 color = vec3(0.0);
//         float flow = smoothstep(0.9, 0.91, sin(uv.x * 800.0 - time * 200.0));
//         color += vec3(flow * 0.0, flow * 0.6, flow * 1.0);
//         gl_FragColor = vec4(color, flow);
//       }
//     `
//   }),

//   regl({
//     frag: `
//       precision mediump float;
//       uniform float time;
//       varying vec2 uv;

//       void main () {
//         vec3 color = vec3(0.0);
//         // color.r += smoothstep(0.5, 0.5001, sin(uv.x * 20.0 - time * 1.0));
//         // color.b += smoothstep(0.5, 0.5001, sin(uv.x * 30.0 - time * 2.0));
//         // color.g += smoothstep(0.5, 0.5001, sin(uv.x * 40.0 - time * 3.0));
//         color.r += smoothstep(0.8, 0.81, sin(uv.x * 20.0 - time * 100.0));
//         color.g += smoothstep(0.8, 0.81, sin(uv.x * 20.0 - time * 400.0));
//         color.b += smoothstep(0.8, 0.81, sin(uv.x * 20.0 - time * 700.0));
//         gl_FragColor = vec4(color, 1);
//       }
//     `
//   })
// ]