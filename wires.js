// import createREGL from 'https://dev.jspm.io/regl'
// import Bezier from 'https://dev.jspm.io/bezier-js'
// import mat4 from 'https://dev.jspm.io/gl-mat4'
// import { run } from 'https://unpkg.com/permutable@0.2.19?module'

// const canvas = document.createElement('canvas')

// canvas.width = 1000
// canvas.height = 1000

// document.body.appendChild(canvas)

// const regl = createREGL(canvas)

// const subdivisions = 5
// const thickness = 0.005
// const amplitude = 0.25

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

// const curve = new Bezier(
//   0.05, 0.5,
//   0.25, 0.5 - amplitude,
//   0.75, 0.5 + amplitude,
//   0.95, 0.5
// )

// const pointToArray = point => [point.x, point.y]

// const segments = curve.reduce()

// const outlines = segments.map(segment => segment.outlineshapes(thickness)[0])

// const positions = outlines.map(shape => {
//   const f = shape.forward.getLUT(subdivisions)
//   const b = shape.back.getLUT(subdivisions).reverse()
//   return Array(subdivisions * 2).fill()
//     .map((_, i) => (i % 2 ? f : b)[Math.floor(i / 2)])
//     .map(pointToArray)
// })

// let offset = 0

// const normals = segments.map(segment => {
//   return Array(subdivisions).fill().flatMap((_, i) => {
//     const split = segment.split(i / subdivisions, (i + 1) / subdivisions)
//     const normal = [[offset, 0], [offset, 1]]
    
//     if (i < subdivisions - 1) {
//       offset += split.length() * (1 / curve.length())
//     }

//     return normal
//   })
// })

// const camera = regl({
//   uniforms: {
//     view: regl.prop('view'),
//     projection: regl.prop('projection')
//   }
// })

// let aspect, view, projection

// function render (time) {
//   const currentAspect = canvas.height / canvas.width

//   if (aspect !== currentAspect) {
//     aspect = currentAspect
//     projection = mat4.ortho([], -1, 1, -1 * aspect, 1 * aspect, -1, 1)
//     view = mat4.lookAt([], [0, 0, 1], [0, 0, 0], [0, 1, 0])
//   }

//   regl.poll()
  
//   regl.clear({
//     color: [0, 0, 0, 0],
//     depth: 1
//   })

//   camera({
//     projection,
//     view
//   }, () => {
//     shape(positions.map((position, i) => ({
//       position,
//       normal: normals[i],
//       time: 1
//     })), () => {
//       styles[0]()
//       edges()
//       debug()
//     })
//   })

//   // window.requestAnimationFrame(render)
// }

// render()