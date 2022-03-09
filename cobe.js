// node_modules/phenomenon/dist/phenomenon.mjs
var t = ["x", "y", "z"];
var e = function(t2) {
  Object.assign(this, { uniforms: {}, geometry: { vertices: [{ x: 0, y: 0, z: 0 }] }, mode: 0, modifiers: {}, attributes: [], multiplier: 1, buffers: [] }), Object.assign(this, t2), this.prepareProgram(), this.prepareUniforms(), this.prepareAttributes();
};
e.prototype.compileShader = function(t2, e2) {
  var i2 = this.gl.createShader(t2);
  return this.gl.shaderSource(i2, e2), this.gl.compileShader(i2), i2;
}, e.prototype.prepareProgram = function() {
  var t2 = this.gl, e2 = this.vertex, i2 = this.fragment, r = t2.createProgram();
  t2.attachShader(r, this.compileShader(35633, e2)), t2.attachShader(r, this.compileShader(35632, i2)), t2.linkProgram(r), t2.useProgram(r), this.program = r;
}, e.prototype.prepareUniforms = function() {
  for (var t2 = Object.keys(this.uniforms), e2 = 0; e2 < t2.length; e2 += 1) {
    var i2 = this.gl.getUniformLocation(this.program, t2[e2]);
    this.uniforms[t2[e2]].location = i2;
  }
}, e.prototype.prepareAttributes = function() {
  this.geometry.vertices !== void 0 && this.attributes.push({ name: "aPosition", size: 3 }), this.geometry.normal !== void 0 && this.attributes.push({ name: "aNormal", size: 3 }), this.attributeKeys = [];
  for (var t2 = 0; t2 < this.attributes.length; t2 += 1)
    this.attributeKeys.push(this.attributes[t2].name), this.prepareAttribute(this.attributes[t2]);
}, e.prototype.prepareAttribute = function(e2) {
  for (var i2 = this.geometry, r = this.multiplier, s = i2.vertices, n = i2.normal, a = new Float32Array(r * s.length * e2.size), o = 0; o < r; o += 1)
    for (var h = e2.data && e2.data(o, r), u = o * s.length * e2.size, f = 0; f < s.length; f += 1)
      for (var c = 0; c < e2.size; c += 1) {
        var l = this.modifiers[e2.name];
        a[u] = l !== void 0 ? l(h, f, c, this) : e2.name === "aPosition" ? s[f][t[c]] : e2.name === "aNormal" ? n[f][t[c]] : h[c], u += 1;
      }
  this.attributes[this.attributeKeys.indexOf(e2.name)].data = a, this.prepareBuffer(this.attributes[this.attributeKeys.indexOf(e2.name)]);
}, e.prototype.prepareBuffer = function(t2) {
  var e2 = t2.data, i2 = t2.name, r = t2.size, s = this.gl.createBuffer();
  this.gl.bindBuffer(34962, s), this.gl.bufferData(34962, e2, 35044);
  var n = this.gl.getAttribLocation(this.program, i2);
  this.gl.enableVertexAttribArray(n), this.gl.vertexAttribPointer(n, r, 5126, false, 0, 0), this.buffers[this.attributeKeys.indexOf(t2.name)] = { buffer: s, location: n, size: r };
}, e.prototype.render = function(t2) {
  var e2 = this, i2 = this.uniforms, r = this.multiplier, s = this.gl;
  s.useProgram(this.program);
  for (var n = 0; n < this.buffers.length; n += 1) {
    var a = this.buffers[n], o = a.location, h = a.buffer, u = a.size;
    s.enableVertexAttribArray(o), s.bindBuffer(34962, h), s.vertexAttribPointer(o, u, 5126, false, 0, 0);
  }
  Object.keys(t2).forEach(function(e3) {
    i2[e3].value = t2[e3].value;
  }), Object.keys(i2).forEach(function(t3) {
    var r2 = i2[t3];
    e2.uniformMap[r2.type](r2.location, r2.value);
  }), s.drawArrays(this.mode, 0, r * this.geometry.vertices.length), this.onRender && this.onRender(this);
}, e.prototype.destroy = function() {
  for (var t2 = 0; t2 < this.buffers.length; t2 += 1)
    this.gl.deleteBuffer(this.buffers[t2].buffer);
  this.gl.deleteProgram(this.program), this.gl = null;
};
var i = function(t2) {
  var e2 = this, i2 = t2 || {}, r = i2.canvas;
  r === void 0 && (r = document.querySelector("canvas"));
  var s = i2.context;
  s === void 0 && (s = {});
  var n = i2.contextType;
  n === void 0 && (n = "experimental-webgl");
  var a = i2.settings;
  a === void 0 && (a = {});
  var o = r.getContext(n, Object.assign({ alpha: false, antialias: false }, s));
  Object.assign(this, { gl: o, canvas: r, uniforms: {}, instances: new Map(), shouldRender: true }), Object.assign(this, { devicePixelRatio: 1, clearColor: [1, 1, 1, 1], position: { x: 0, y: 0, z: 2 }, clip: [1e-3, 100] }), Object.assign(this, a), this.uniformMap = { float: function(t3, e3) {
    return o.uniform1f(t3, e3);
  }, vec2: function(t3, e3) {
    return o.uniform2fv(t3, e3);
  }, vec3: function(t3, e3) {
    return o.uniform3fv(t3, e3);
  }, vec4: function(t3, e3) {
    return o.uniform4fv(t3, e3);
  }, mat2: function(t3, e3) {
    return o.uniformMatrix2fv(t3, false, e3);
  }, mat3: function(t3, e3) {
    return o.uniformMatrix3fv(t3, false, e3);
  }, mat4: function(t3, e3) {
    return o.uniformMatrix4fv(t3, false, e3);
  } }, o.enable(o.DEPTH_TEST), o.depthFunc(o.LEQUAL), o.getContextAttributes().alpha === false && (o.clearColor.apply(o, this.clearColor), o.clearDepth(1)), this.onSetup && this.onSetup(o), window.addEventListener("resize", function() {
    return e2.resize();
  }), this.resize(), this.render();
};
i.prototype.resize = function() {
  var t2 = this.gl, e2 = this.canvas, i2 = this.devicePixelRatio, r = this.position;
  e2.width = e2.clientWidth * i2, e2.height = e2.clientHeight * i2;
  var s = t2.drawingBufferWidth, n = t2.drawingBufferHeight, a = s / n;
  t2.viewport(0, 0, s, n);
  var o = Math.tan(Math.PI / 180 * 22.5), h = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, r.x, r.y, (a < 1 ? 1 : a) * -r.z, 1];
  this.uniforms.uProjectionMatrix = { type: "mat4", value: [0.5 / o, 0, 0, 0, 0, a / o * 0.5, 0, 0, 0, 0, -(this.clip[1] + this.clip[0]) / (this.clip[1] - this.clip[0]), -1, 0, 0, -2 * this.clip[1] * (this.clip[0] / (this.clip[1] - this.clip[0])), 0] }, this.uniforms.uViewMatrix = { type: "mat4", value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] }, this.uniforms.uModelMatrix = { type: "mat4", value: h };
}, i.prototype.toggle = function(t2) {
  t2 !== this.shouldRender && (this.shouldRender = t2 !== void 0 ? t2 : !this.shouldRender, this.shouldRender && this.render());
}, i.prototype.render = function() {
  var t2 = this;
  this.gl.clear(16640), this.instances.forEach(function(e2) {
    e2.render(t2.uniforms);
  }), this.onRender && this.onRender(this), this.shouldRender && requestAnimationFrame(function() {
    return t2.render();
  });
}, i.prototype.add = function(t2, i2) {
  i2 === void 0 && (i2 = { uniforms: {} }), i2.uniforms === void 0 && (i2.uniforms = {}), Object.assign(i2.uniforms, JSON.parse(JSON.stringify(this.uniforms))), Object.assign(i2, { gl: this.gl, uniformMap: this.uniformMap });
  var r = new e(i2);
  return this.instances.set(t2, r), r;
}, i.prototype.remove = function(t2) {
  var e2 = this.instances.get(t2);
  e2 !== void 0 && (e2.destroy(), this.instances.delete(t2));
}, i.prototype.destroy = function() {
  var t2 = this;
  this.instances.forEach(function(e2, i2) {
    e2.destroy(), t2.instances.delete(i2);
  }), this.toggle(false);
};
var phenomenon_default = i;

// src/index.js
var OPT_PHI = "phi";
var OPT_THETA = "theta";
var OPT_DOTS = "mapSamples";
var OPT_MAP_BRIGHTNESS = "mapBrightness";
var OPT_BASE_COLOR = "baseColor";
var OPT_MARKER_COLOR = "markerColor";
var OPT_GLOW_COLOR = "glowColor";
var OPT_MARKERS = "markers";
var OPT_DIFFUSE = "diffuse";
var OPT_DPR = "devicePixelRatio";
var OPT_DARK = "dark";
var OPT_MAPPING = {
  [OPT_PHI]: "z",
  [OPT_THETA]: "A",
  [OPT_DOTS]: "j",
  [OPT_MAP_BRIGHTNESS]: "C",
  [OPT_BASE_COLOR]: "J",
  [OPT_MARKER_COLOR]: "K",
  [OPT_GLOW_COLOR]: "x",
  [OPT_DIFFUSE]: "D",
  [OPT_DARK]: "E"
};
var { PI, sin, cos } = Math;
var mapMarkers = (markers) => {
  return [].concat(...markers.map((m) => {
    let [a, b] = m.location;
    a = a * PI / 180;
    b = b * PI / 180 - PI;
    const cx = cos(a);
    return [-cx * cos(b), sin(a), cx * sin(b), m.size];
  }), [0, 0, 0, 0]);
};
var src_default = (canvas, opts) => {
  const createUniform = (type, name) => {
    return {
      type,
      value: opts[name]
    };
  };
  const p = new phenomenon_default({
    canvas,
    context: {
      alpha: true,
      stencil: false,
      antialias: true,
      depth: false,
      preserveDrawingBuffer: false
    },
    settings: {
      [OPT_DPR]: opts[OPT_DPR] || 1,
      onSetup: (gl) => {
        const RGBFormat = gl.RGB;
        const srcType = gl.UNSIGNED_BYTE;
        const TEXTURE_2D = gl.TEXTURE_2D;
        const texture = gl.createTexture();
        gl.bindTexture(TEXTURE_2D, texture);
        gl.texImage2D(TEXTURE_2D, 0, RGBFormat, 1, 1, 0, RGBFormat, srcType, new Uint8Array([0, 0, 0, 0]));
        const image = new Image();
        image.onload = () => {
          gl.bindTexture(TEXTURE_2D, texture);
          gl.texImage2D(TEXTURE_2D, 0, RGBFormat, RGBFormat, srcType, image);
          gl.generateMipmap(TEXTURE_2D);
          const program = gl.getParameter(gl.CURRENT_PROGRAM);
          const textureLocation = gl.getUniformLocation(program, "F");
          gl.texParameteri(TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
          gl.texParameteri(TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
          gl.uniform1i(textureLocation, 0);
        };
        image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAACAAQAAAADMzoqnAAAAAXNSR0IArs4c6QAABA5JREFUeNrV179uHEUAx/Hf3JpbF+E2VASBsmVKTBcpKJs3SMEDcDwBiVJAAewYEBUivIHT0uUBIt0YCovKD0CRjUC4QfHYh8hYXu+P25vZ2Zm9c66gMd/GJ/tz82d3bk8GN4SrByYF2366FNTACIAkivVAAazQdnf3MvAlbNUQfOPAdQDvSAimMWhwy4I2g4SU+Kp04ISLpPBAKLxPyic3O/CCi+Y7rUJbiodcpDOFY7CgxCEXmdYD2EYK2s5lApOx5pEDDYCUwM1XdJUwBV11QQMg59kePSCaPAASQMEL2hwo6TJFgxpg+TgC2ymXPbuvc40awr3D1QCFfbH9kcoqAOkZozpQo0aqAGQRKCog/+tjkgbNFEtg2FffBvBGlSxHoAaAa1u6X4PBAwDiR8FFsrQgeUhfJTSALaB9jy5NCybJPn1SVFiWk7ywN+KzhH1aKAuydhGkbEF4lWohLXDXavlyFgHY7LBnLRdlAP6BS5Cc8RfVDXbkwN/oIvmY+6obbNeBP0JwTuMGu9gTzy1Q4RS/cWpfzszeYwd+CAFrtBW/Hur0gLbJGlD+/OjVwe/drfBxkbbg63dndEDfiEBlAd7ac0BPe1D6Jd8dfbLH+RI0OzseFB5s01/M+gMdAeluLOCAuaUA9Lezo/vSgXoCX9rtEiXnp7Q1W/CNyWcd8DXoS6jH/YZ5vAJEWY2dXFQe2TUgaFaNejCzJ98g6HnlVrsE58sDcYqg+9XY75fPqdoh/kRQWiXKg8MWlJQxUFMPjqnyujhFBE7UxIMjyszk0QwQlFsezImsyvUYYYVED2pk6m0Tg8T04Fwjk2kdAwSACqlM6gRRt3vQYAFGX0Ah7Ebx1H+MDRI5ui0QldH4j7FGcm90XdxD2Jg1AOEAVAKhEFXSn4cKUELurIAKwJ3MArypPscQaLhJFICJ0ohjDySAdH8AhDtCiTuMycH8CXzhH9jUACAO5uMhoAwA5i+T6WAKmmAqnLy80wxHqIPFYpqCwxGaYLt4Dyievg5kEoVEUAhs6pqKgFtDQYOuaXypaWKQfIuwwoGSZgfLsu/XAtI8cGN+h7Cc1A5oLOMhwlIPXuhu48AIvsSBkvtV9wsJRKCyYLfq5lTrQMFd1a262oqBck9K1V0YjQg0iEYYgpS1A9GlXQV5cykwm4A7BzVsxQqo7E+zCegO7Ma7yKgsuOcfKbMBwLC8wvVNYDsANYalEpOAa6zpWjTeMKGwEwC1CiQewJc5EKfgy7GmRAZA4vUVGwE2dPM/g0xuAInE/yG5aZ8ISxWGfYigUVbdyBElTHh2uCwGdfCkOLGgQVBh3Ewp+/QK4CDlR5Ws/Zf7yhCf8pH7vinWAvoVCQ6zz0NX5V/6GkAVV+2/5qsJ/gU8bsxpM8IeAQAAAABJRU5ErkJggg==";
      }
    }
  });
  p.add("", {
    vertex: `attribute vec3 aPosition;uniform mat4 uProjectionMatrix;uniform mat4 uModelMatrix;uniform mat4 uViewMatrix;void main(){gl_Position=uProjectionMatrix*uModelMatrix*uViewMatrix*vec4(aPosition,1.);}`,
    fragment: "precision highp float;uniform vec2 u;uniform vec3 J,K,x;uniform vec4 y[64];uniform float z,A,j,B,C,D,E;uniform sampler2D F;float G=1./j;mat3 H(float a,float b){float c=cos(a),d=cos(b),e=sin(a),f=sin(b);return mat3(d,f*e,-f*c,0.,c,e,f,d*-e,d*c);}vec3 v(vec3 a,out float w){a=a.xzy;float n=max(2.,floor(log2(2.236068*j*3.141593*(1.-a.z*a.z))*.72021));vec2 e=floor(pow(1.618034,n)/2.236068*vec2(1.,1.618034)+.5),b=fract((e+1.)*.618034)*6.283185-3.883222,c=-2.*e,d=vec2(atan(a.y,a.x),a.z-1.),o=floor(vec2(c.y*d.x-b.y*(d.y*j+1.),-c.x*d.x+b.x*(d.y*j+1.))/(b.x*c.y-c.x*b.y));float l=3.141593;vec3 p;for(float f=0.;f<4.;f+=1.){vec2 q=vec2(mod(f,2.),floor(f*.5));float h=dot(e,o+q);if(h>j)continue;int r=int(h)*-1640531527;float s=float(r)*2.328306e-10,i=s*6.283185,g=1.-2.*h*G,k=sqrt(1.-g*g);vec3 m=vec3(cos(i)*k,sin(i)*k,g);float t=length(a-m);if(t<l)l=t,p=m;}w=l;return p.xzy;}void main(){vec2 a=gl_FragCoord.xy/u*2.-1.;a.x*=u.x/u.y;float c=dot(a,a),b;vec3 d=vec3(0.,0.,1.),e=normalize(vec3(a,sqrt(.64-c)));if(c<=.64){vec3 f=e*H(A,z),g=v(f,b);float k=asin(g.y),h=acos(-g.x/cos(k));h=g.z<0.?-h:h;float s=texture2D(F,vec2(h*.5/3.141593,-(k/3.141593+.5))).x,t=smoothstep(8e-3,0.,b),l=dot(e,d),r=pow(l,D)*C,m=s*t*r,L=mix((1.-m)*pow(l,.4),m,E)+.1;gl_FragColor=vec4(J*L,1.);int M=int(B);float n=0.;for(int i=0;i<64;i++){if(i>=M)break;vec4 o=y[i];vec3 p=o.xyz,w=p-f;float q=o.w;if(dot(w,w)>q*q*4.)continue;vec3 N=v(p,b);b=length(N-f),b<q?n+=smoothstep(q*.5,0.,b):0.;}n=min(1.,n*r),gl_FragColor.xyz=mix(gl_FragColor.xyz,K,n),gl_FragColor.xyz+=pow(1.-dot(e,d),4.)*x;}float I=pow(dot(normalize(vec3(-a,sqrt(1.-c))),d),4.)*smoothstep(.1,1.,.2/(c-.64));gl_FragColor+=vec4(I*x,I);}",
    uniforms: {
      ["u"]: {
        type: "vec2",
        value: [opts.width, opts.height]
      },
      ["z"]: createUniform("float", OPT_PHI),
      ["A"]: createUniform("float", OPT_THETA),
      ["j"]: createUniform("float", OPT_DOTS),
      ["C"]: createUniform("float", OPT_MAP_BRIGHTNESS),
      ["J"]: createUniform("vec3", OPT_BASE_COLOR),
      ["K"]: createUniform("vec3", OPT_MARKER_COLOR),
      ["D"]: createUniform("float", OPT_DIFFUSE),
      ["x"]: createUniform("vec3", OPT_GLOW_COLOR),
      ["E"]: createUniform("float", OPT_DARK),
      ["y"]: {
        type: "vec4",
        value: mapMarkers(opts[OPT_MARKERS])
      },
      ["B"]: {
        type: "float",
        value: opts[OPT_MARKERS].length
      }
    },
    mode: 4,
    geometry: {
      vertices: [
        { x: -100, y: 100, z: 0 },
        { x: -100, y: -100, z: 0 },
        { x: 100, y: 100, z: 0 },
        { x: 100, y: -100, z: 0 },
        { x: -100, y: -100, z: 0 },
        { x: 100, y: 100, z: 0 }
      ]
    },
    onRender: ({ uniforms }) => {
      const state = {};
      if (opts.onRender) {
        opts.onRender(state);
        for (let k in OPT_MAPPING) {
          if (state[k] !== void 0) {
            uniforms[OPT_MAPPING[k]].value = state[k];
          }
        }
        if (state[OPT_MARKERS] !== void 0) {
          uniforms["y"].value = mapMarkers(state[OPT_MARKERS]);
          uniforms["B"].value = state[OPT_MARKERS].length;
        }
        if (state.width && state.height) {
          uniforms["u"].value = [state.width, state.height];
        }
      }
    }
  });
  return p;
};
export {
  src_default as default
};
