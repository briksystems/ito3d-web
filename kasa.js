/* ==========================================================================
   ITO 3D · KASA, el taller de lámparas
   Visor 3D (three.js) con la base real y las 11 pantallas reales.
   - Las pantallas vienen como mapas de radio r(θ, z) (kasa/<id>.bin, uint16 en 1/100 mm)
     y se arman aquí mismo: pesan poco y salen idénticas al modelo que se imprime.
   - La base es el modelo real comprimido (kasa/base.glb).
   ========================================================================== */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const V = "20261124a";
const PANTALLAS = [
  { id: "ola", nombre: "Ola", frase: "Barril con costillas finas en S" },
  { id: "nube", nombre: "Nube", frase: "Tres nubes apiladas" },
  { id: "seda", nombre: "Seda", frase: "Torsión orgánica, lisa" },
  { id: "esfera", nombre: "Esfera", frase: "Globo de costillas verticales" },
  { id: "cesta", nombre: "Cesta", frase: "Anillos con textura de cesta" },
  { id: "duna", nombre: "Duna", frase: "Costillas que ondulan como dunas" },
  { id: "hongo", nombre: "Hongo", frase: "Tallo y sombrero" },
  { id: "petalo", nombre: "Pétalo", frase: "Tulipán de tres pliegues" },
  { id: "trenza", nombre: "Trenza", frase: "Surcos cruzados en espiral" },
  { id: "gota", nombre: "Gota", frase: "Gota alargada en giro suave" },
  { id: "piedras", nombre: "Piedras", frase: "Tres piedras apiladas" }
];
const BASES = [
  { id: "carbon", nombre: "Carbón", hex: "#2c2b29" },
  { id: "arena", nombre: "Arena", hex: "#c9b291" },
  { id: "salvia", nombre: "Salvia", hex: "#a3ae95" },
  { id: "bermellon", nombre: "Bermellón", hex: "#c8402a" },
  { id: "hueso", nombre: "Hueso", hex: "#ece7dd" }
];
const TONOS = [
  { id: "blanco", nombre: "Blanco", hex: "#f7f5f0" },
  { id: "hueso", nombre: "Hueso", hex: "#efe6d4" },
  { id: "arena", nombre: "Arena", hex: "#e8d6b4" }
];
const CALIDA = new THREE.Color("#ffb46b");
const MM = 0.001;
const ASIENTO = 15 * MM; // la pantalla entra 7 mm en la ranura (fondo a z = 15 mm)
const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s) => document.querySelector(s);

/* ---------- datos compartidos --------------------------------------------- */
let manifiesto = null;
const geomCache = new Map();
async function cargarManifiesto() {
  if (!manifiesto) manifiesto = await (await fetch(`kasa/pantallas.json?v=${V}`)).json();
  return manifiesto;
}
async function geometriaPantalla(id) {
  if (geomCache.has(id)) return geomCache.get(id);
  const prom = (async () => {
    const m = (await cargarManifiesto())[id];
    const buf = await (await fetch(`kasa/${id}.bin?v=${V}`)).arrayBuffer();
    const R = new Uint16Array(buf);
    const { nz, nt, H } = m;
    const pos = new Float32Array(nz * nt * 3);
    for (let i = 0; i < nz; i++) {
      const y = (H * i / (nz - 1)) * MM;
      for (let j = 0; j < nt; j++) {
        const th = -Math.PI + (2 * Math.PI * j) / nt;
        const r = R[i * nt + j] * 0.01 * MM;
        const k = (i * nt + j) * 3;
        // modelo (x, y, z) → three (x, z, -y): el frente (-Y, donde está el sello) queda hacia +Z
        pos[k] = r * Math.cos(th);
        pos[k + 1] = y;
        pos[k + 2] = -r * Math.sin(th);
      }
    }
    const idx = new Uint32Array((nz - 1) * nt * 6);
    let c = 0;
    for (let i = 0; i < nz - 1; i++) {
      for (let j = 0; j < nt; j++) {
        const a = i * nt + j, b = i * nt + ((j + 1) % nt), d = (i + 1) * nt + j, e = (i + 1) * nt + ((j + 1) % nt);
        idx[c++] = a; idx[c++] = d; idx[c++] = b;
        idx[c++] = b; idx[c++] = d; idx[c++] = e;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setIndex(new THREE.BufferAttribute(idx, 1));
    g.computeVertexNormals();
    g.userData = { H: H * MM, rmax: m.rmax * MM };
    return g;
  })();
  geomCache.set(id, prom);
  return prom;
}

let basePromesa = null;
function geometriaBase() {
  if (!basePromesa) {
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    basePromesa = loader.loadAsync(`kasa/base.glb?v=${V}`).then((gltf) => {
      let geo = null;
      gltf.scene.updateMatrixWorld(true);
      gltf.scene.traverse((o) => {
        if (o.isMesh && !geo) {
          // las posiciones vienen cuantizadas (enteros): se pasan a float antes de transformar
          const p = o.geometry.attributes.position, f = new Float32Array(p.count * 3);
          for (let i = 0; i < p.count; i++) { f[i * 3] = p.getX(i); f[i * 3 + 1] = p.getY(i); f[i * 3 + 2] = p.getZ(i); }
          geo = new THREE.BufferGeometry();
          geo.setAttribute("position", new THREE.BufferAttribute(f, 3));
          geo.setIndex(o.geometry.index);
          geo.applyMatrix4(o.matrixWorld);
        }
      });
      // el STL viene con Z arriba y en mm
      geo.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
      geo.scale(MM, MM, MM);
      geo.deleteAttribute("normal");
      geo = mergeCercanos(geo);
      geo.computeVertexNormals();
      return geo;
    });
  }
  return basePromesa;
}
function mergeCercanos(geo) {
  // une vértices duplicados para que el sombreado salga suave
  const p = geo.attributes.position, mapa = new Map(), nuevos = [], remap = new Uint32Array(p.count);
  for (let i = 0; i < p.count; i++) {
    const k = `${Math.round(p.getX(i) * 1e5)},${Math.round(p.getY(i) * 1e5)},${Math.round(p.getZ(i) * 1e5)}`;
    let n = mapa.get(k);
    if (n === undefined) { n = nuevos.length / 3; mapa.set(k, n); nuevos.push(p.getX(i), p.getY(i), p.getZ(i)); }
    remap[i] = n;
  }
  const idx = geo.index ? Array.from(geo.index.array, (i) => remap[i]) : Array.from(remap);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(nuevos, 3));
  g.setIndex(idx);
  return g;
}

/* ---------- material de pantalla: difusa de día, brilla de noche ----------- */
function materialPantalla(hex) {
  const m = new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), roughness: 0.72, metalness: 0, side: THREE.DoubleSide, transparent: true });
  m.userData.u = { uLuz: { value: 0 }, uH: { value: 0.17 }, uCal: { value: CALIDA.clone() } };
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, m.userData.u);
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vAlto;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvAlto = position.y;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vAlto;\nuniform float uLuz; uniform float uH; uniform vec3 uCal;")
      .replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
        float hh = clamp(vAlto / uH, 0.0, 1.0);
        float caida = mix(1.15, 0.5, smoothstep(0.0, 1.0, hh));
        float frente = abs(dot(normalize(normal), normalize(vViewPosition)));
        float lado = gl_FrontFacing ? 1.0 : 1.35;
        totalEmissiveRadiance += uCal * uLuz * caida * lado * (0.35 + 0.65 * pow(frente, 0.8)) * diffuseColor.rgb;`);
  };
  return m;
}

function texturaHalo() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, "rgba(255,190,120,1)");
  grd.addColorStop(0.35, "rgba(255,170,100,0.45)");
  grd.addColorStop(1, "rgba(255,160,90,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ---------- una lámpara completa (base + puck + cable + pantalla) --------- */
class Lampara {
  constructor(scene, baseHex) {
    this.grupo = new THREE.Group();
    scene.add(this.grupo);
    this.matBase = new THREE.MeshStandardMaterial({ color: baseHex, roughness: 0.6 });
    this.luz = 0;
    // puck: cuerpo gris + difusor
    this.puck = new THREE.Group();
    const cuerpo = new THREE.Mesh(new THREE.CylinderGeometry(29.7 * MM, 29.7 * MM, 7.5 * MM, 64), new THREE.MeshStandardMaterial({ color: "#b9bcbf", roughness: 0.4, metalness: 0.1 }));
    cuerpo.position.y = (13.2 + 3.75) * MM;
    this.matDifusor = new THREE.MeshStandardMaterial({ color: "#f7f6f2", roughness: 0.3, emissive: "#ffc58a", emissiveIntensity: 0 });
    const dif = new THREE.Mesh(new THREE.CylinderGeometry(26.2 * MM, 26.2 * MM, 1.2 * MM, 64), this.matDifusor);
    dif.position.y = (13.2 + 7.5 + 0.6) * MM;
    this.puck.add(cuerpo, dif);
    this.grupo.add(this.puck);
    // cable USB-C: sale por el canal trasero y se tiende sobre la mesa
    const r = 1.8 * MM;
    const pts = [[0, 2.6, -4], [0, 2.4, -35], [0, r / MM, -60], [20, r / MM, -100], [90, r / MM, -130], [200, r / MM, -125], [330, r / MM, -165], [700, r / MM, -330]]
      .map(([x, y, z]) => new THREE.Vector3(x * MM, y * MM, z * MM));
    this.matCable = new THREE.MeshStandardMaterial({ color: "#f1efea", roughness: 0.5 });
    this.cable = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, r, 10), this.matCable);
    this.cable.castShadow = true;
    const funda = new THREE.Mesh(new THREE.CylinderGeometry(2.8 * MM, 2.8 * MM, 12 * MM, 20), this.matCable);
    funda.rotation.x = Math.PI / 2;
    funda.position.set(0, 2.8 * MM, -56 * MM);
    this.grupo.add(this.cable, funda);
    // luz interior y halo sobre la mesa
    this.foco = new THREE.PointLight(0xffb46b, 0, 1.6, 1.6);
    this.foco.position.y = 0.06;
    this.grupo.add(this.foco);
    this.halo = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62), new THREE.MeshBasicMaterial({ map: texturaHalo(), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.halo.rotation.x = -Math.PI / 2;
    this.halo.position.y = 0.0006;
    this.grupo.add(this.halo);
    this.pantalla = null;
    this.base = null;
  }
  async ponerBase() {
    const g = await geometriaBase();
    this.base = new THREE.Mesh(g, this.matBase);
    this.base.castShadow = true;
    this.base.receiveShadow = true;
    this.grupo.add(this.base);
  }
  colorBase(hex) { this.matBase.color.set(hex); }
  colorCable(oscuro) { this.matCable.color.set(oscuro ? "#2a2928" : "#f1efea"); }
  crearPantalla(geo, hex) {
    const mat = materialPantalla(hex);
    mat.userData.u.uH.value = geo.userData.H;
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = true;
    m.position.y = ASIENTO;
    this.grupo.add(m);
    return m;
  }
  ponerLuz(v) {
    this.luz = v;
    this.foco.intensity = v * 0.9;
    this.foco.position.y = this.pantalla ? ASIENTO + this.pantalla.geometry.userData.H * 0.35 : 0.04;
    this.matDifusor.emissiveIntensity = v * 6;
    this.halo.material.opacity = v * 0.85;
    this.grupo.traverse((o) => { if (o.material && o.material.userData.u) o.material.userData.u.uLuz.value = v * 1.9; });
  }
}

/* ---------- escenario común ---------------------------------------------- */
function crearEscenario(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const camara = new THREE.PerspectiveCamera(30, 1, 0.01, 10);
  const sol = new THREE.DirectionalLight(0xffffff, 2.2);
  sol.position.set(0.35, 0.6, 0.45);
  sol.castShadow = true;
  sol.shadow.mapSize.set(1024, 1024);
  sol.shadow.camera.left = sol.shadow.camera.bottom = -0.35;
  sol.shadow.camera.right = sol.shadow.camera.top = 0.35;
  sol.shadow.radius = 6;
  sol.shadow.bias = -0.0004;
  scene.add(sol);
  const suelo = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.ShadowMaterial({ opacity: 0.16 }));
  suelo.rotation.x = -Math.PI / 2;
  suelo.receiveShadow = true;
  scene.add(suelo);
  const ajustar = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camara.aspect = w / h;
    camara.updateProjectionMatrix();
  };
  new ResizeObserver(ajustar).observe(canvas);
  ajustar();
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: "100px" }).observe(canvas);
  return { renderer, scene, camara, sol, suelo, visible: () => visible };
}

const ease = {
  out: (t) => 1 - Math.pow(1 - t, 3),
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  back: (t) => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
};
const tweens = new Set();
function tween(dur, fn, curva = ease.out) {
  return new Promise((res) => {
    const t0 = performance.now();
    const tw = { paso(now) { const t = Math.min(1, (now - t0) / (reducido ? 1 : dur)); fn(curva(t), t); if (t >= 1) { tweens.delete(tw); res(); } } };
    tweens.add(tw);
  });
}

/* ==========================================================================
   1. TALLER
   ========================================================================== */
const estado = { pantalla: "ola", base: "carbon", tono: "blanco", luz: false, intensidad: 0.8 };
(function leerDireccion() {
  const q = new URLSearchParams(location.search);
  if (PANTALLAS.some((p) => p.id === q.get("p"))) estado.pantalla = q.get("p");
  if (BASES.some((p) => p.id === q.get("b"))) estado.base = q.get("b");
  if (TONOS.some((p) => p.id === q.get("t"))) estado.tono = q.get("t");
})();
const porId = (lista, id) => lista.find((x) => x.id === id);

async function taller() {
  const canvas = $("#kz-lienzo");
  if (!canvas) return;
  const seccion = $("#taller");
  let esc;
  try { esc = crearEscenario(canvas); } catch (e) { sinWebGL(); return; }
  if (!esc.renderer.getContext()) { sinWebGL(); return; }
  const { renderer, scene, camara, sol } = esc;
  const controles = new OrbitControls(camara, canvas);
  controles.enableDamping = true;
  controles.enablePan = false;
  controles.minDistance = 0.32;
  controles.maxDistance = 1.4;
  controles.minPolarAngle = 0.35;
  controles.maxPolarAngle = 1.5;
  controles.autoRotate = !reducido;
  controles.autoRotateSpeed = 0.9;
  controles.enableZoom = false;
  let quieto;
  controles.addEventListener("start", () => {
    controles.autoRotate = false;
    $(".kz-escena__pista").classList.add("is-oculta");
    clearTimeout(quieto);
  });
  controles.addEventListener("end", () => { quieto = setTimeout(() => { controles.autoRotate = !reducido; }, 5000); });

  const lamp = new Lampara(scene, porId(BASES, estado.base).hex);
  lamp.colorCable(estado.base === "carbon");
  await lamp.ponerBase();
  const geo = await geometriaPantalla(estado.pantalla);
  lamp.pantalla = lamp.crearPantalla(geo, porId(TONOS, estado.tono).hex);
  let objetivo = encuadre(geo);
  camara.position.set(0.12, objetivo.y + 0.12, objetivo.d);
  controles.target.set(0, objetivo.y, 0);
  $("#kz-carga").classList.add("is-lista");

  // luz suave animada
  let luzActual = 0;
  const luzObjetivo = () => (estado.luz ? estado.intensidad : 0);

  function encuadre(g) {
    const h = ASIENTO + g.userData.H;
    const ancho = Math.max(g.userData.rmax, 0.052) * 2;
    const vfov = (camara.fov * Math.PI) / 180;
    const dh = (h * 1.75) / (2 * Math.tan(vfov / 2));
    const dw = (ancho * 2.1) / (2 * Math.tan(vfov / 2) * Math.max(camara.aspect, 0.5));
    return { y: h * 0.44, d: Math.max(dh, dw, 0.42) };
  }

  let ocupado = Promise.resolve();
  async function cambiarPantalla(id) {
    if (id === estado.pantalla && lamp.pantalla) return;
    estado.pantalla = id;
    pintarSeleccion();
    nombreGrande(porId(PANTALLAS, id).nombre);
    const nuevaGeo = geometriaPantalla(id);
    ocupado = ocupado.then(async () => {
      if (estado.pantalla !== id) return;
      const vieja = lamp.pantalla;
      const g = await nuevaGeo;
      // la que está sube y se desvanece
      await tween(380, (k) => {
        vieja.position.y = ASIENTO + k * 0.09;
        vieja.material.opacity = 1 - k;
        vieja.rotation.y = k * 0.25;
      }, ease.inOut);
      lamp.grupo.remove(vieja);
      vieja.material.dispose();
      const nueva = lamp.crearPantalla(g, porId(TONOS, estado.tono).hex);
      lamp.pantalla = nueva;
      lamp.ponerLuz(luzActual);
      nueva.material.opacity = 0;
      objetivo = encuadre(g);
      await tween(720, (k, t) => {
        nueva.position.y = ASIENTO + (1 - k) * 0.12;
        nueva.material.opacity = Math.min(1, t * 2.2);
        nueva.rotation.y = (1 - k) * -0.35;
      }, ease.back);
      nueva.material.transparent = false;
      nueva.material.needsUpdate = true;
      golpe();
    });
    return ocupado;
  }

  // pequeño destello en la base cuando la pantalla encaja
  const anillo = new THREE.Mesh(new THREE.RingGeometry(0.044, 0.047, 96), new THREE.MeshBasicMaterial({ color: 0xc8402a, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
  anillo.rotation.x = -Math.PI / 2;
  anillo.position.y = 0.0225;
  scene.add(anillo);
  function golpe() {
    tween(700, (k) => {
      anillo.scale.setScalar(1 + k * 0.9);
      anillo.material.opacity = (1 - k) * 0.9;
    });
  }

  function nombreGrande(txt) {
    const s = $("#kz-nombre-grande");
    s.classList.add("is-sale");
    setTimeout(() => { s.textContent = txt.toUpperCase(); s.classList.remove("is-sale"); }, 260);
  }

  function cambiarTono(id) {
    estado.tono = id;
    const c = new THREE.Color(porId(TONOS, id).hex);
    const ini = lamp.pantalla.material.color.clone();
    tween(400, (k) => lamp.pantalla.material.color.copy(ini).lerp(c, k));
    pintarSeleccion();
  }
  function cambiarBase(id) {
    estado.base = id;
    const c = new THREE.Color(porId(BASES, id).hex);
    const ini = lamp.matBase.color.clone();
    tween(400, (k) => lamp.matBase.color.copy(ini).lerp(c, k));
    lamp.colorCable(id === "carbon");
    pintarSeleccion();
  }
  function cambiarLuz(on) {
    estado.luz = on;
    seccion.dataset.luz = on ? "on" : "off";
    const b = $("#kz-interruptor");
    b.setAttribute("aria-pressed", String(on));
    b.querySelector(".kz-interruptor__txt").textContent = on ? "Apagar" : "Encender";
    document.querySelector('meta[name="theme-color"]').setAttribute("content", on ? "#15110d" : "#f3f1ec");
  }

  construirPanel({ pantalla: cambiarPantalla, base: cambiarBase, tono: cambiarTono, luz: cambiarLuz });
  pintarSeleccion();

  // la galería prueba pantallas aquí mismo
  window.kasaProbar = (id) => {
    $("#taller").scrollIntoView({ behavior: reducido ? "auto" : "smooth" });
    setTimeout(() => cambiarPantalla(id), reducido ? 0 : 450);
  };

  // precarga del resto en segundo plano
  const precargar = () => PANTALLAS.forEach((p, i) => setTimeout(() => geometriaPantalla(p.id), 400 * i));
  setTimeout(() => ("requestIdleCallback" in window ? requestIdleCallback(precargar) : precargar()), 1500);

  // momento "wow": se enciende sola una vez
  if (!reducido) setTimeout(() => { if (!estado.luz && !tocado) cambiarLuz(true); }, 1400);
  let tocado = false;
  seccion.addEventListener("pointerdown", () => { tocado = true; }, { once: true });

  /* ---- bucle ---- */
  const v3 = new THREE.Vector3();
  let antes = performance.now();
  renderer.setAnimationLoop((now) => {
    tweens.forEach((t) => t.paso(now));
    const dt = Math.min(0.1, (now - antes) / 1000); antes = now;
    if (!esc.visible()) return;
    const kk = 1 - Math.exp(-dt * 4);
    luzActual += (luzObjetivo() - luzActual) * kk * 1.2;
    if (Math.abs(luzActual - luzObjetivo()) < 0.001) luzActual = luzObjetivo();
    lamp.ponerLuz(luzActual);
    const noche = Math.min(1, luzActual / 0.5);
    sol.intensity = 2.2 * (1 - 0.92 * noche);
    scene.environmentIntensity = 1 - 0.85 * noche;
    esc.suelo.material.opacity = 0.16 * (1 - noche);
    // encuadre suave cuando cambia el alto de la pantalla
    controles.target.y += (objetivo.y - controles.target.y) * kk;
    const dist = camara.position.distanceTo(controles.target);
    if (Math.abs(dist - objetivo.d) > 0.002) {
      v3.copy(camara.position).sub(controles.target).setLength(dist + (objetivo.d - dist) * kk);
      camara.position.copy(controles.target).add(v3);
    }
    controles.update();
    renderer.render(scene, camara);
  });
}

function construirPanel(h) {
  /* ---- controles del panel ---- */
  const cont = $("#kz-pantallas");
  PANTALLAS.forEach((p) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "kz-pant";
    b.setAttribute("role", "radio");
    b.dataset.id = p.id;
    b.title = `${p.nombre}: ${p.frase}`;
    b.innerHTML = silueta(p.id) + `<span>${p.nombre}</span>`;
    b.addEventListener("click", () => h.pantalla(p.id));
    b.addEventListener("mouseenter", () => geometriaPantalla(p.id)); // la deja lista antes del clic
    cont.appendChild(b);
  });
  teclasRadio(cont, (id) => h.pantalla(id));
  const fila = (sel, lista, fn) => {
    const c = $(sel);
    lista.forEach((x) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "kz-color";
      b.setAttribute("role", "radio");
      b.setAttribute("aria-label", x.nombre);
      b.title = x.nombre;
      b.dataset.id = x.id;
      b.style.setProperty("--c", x.hex);
      b.addEventListener("click", () => fn(x.id));
      c.appendChild(b);
    });
    teclasRadio(c, fn);
  };
  fila("#kz-colores-base", BASES, h.base);
  fila("#kz-colores-pantalla", TONOS, h.tono);
  $("#kz-interruptor").addEventListener("click", () => h.luz(!estado.luz));
  $("#kz-intensidad").addEventListener("input", (e) => {
    estado.intensidad = e.target.value / 100;
    if (!estado.luz) h.luz(true);
  });
  $("#kz-nombre-grande").textContent = porId(PANTALLAS, estado.pantalla).nombre.toUpperCase();
}

function pintarSeleccion() {
  document.querySelectorAll("#kz-pantallas .kz-pant").forEach((b) => marcar(b, b.dataset.id === estado.pantalla));
  document.querySelectorAll("#kz-colores-base .kz-color").forEach((b) => marcar(b, b.dataset.id === estado.base));
  document.querySelectorAll("#kz-colores-pantalla .kz-color").forEach((b) => marcar(b, b.dataset.id === estado.tono));
  const P = porId(PANTALLAS, estado.pantalla), B = porId(BASES, estado.base), T = porId(TONOS, estado.tono);
  $("#kz-v-pantalla").textContent = P.nombre;
  $("#kz-v-base").textContent = B.nombre;
  $("#kz-v-tono").textContent = T.nombre;
  $("#kz-resumen").textContent = `${P.nombre} · base ${B.nombre} · pantalla ${T.nombre}`;
  const msg = `Hola, quiero esta lámpara KASA:\n- Pantalla: ${P.nombre}\n- Base: ${B.nombre}\n- Color de la pantalla: ${T.nombre}\n${enlace()}`;
  $("#kz-wa").href = "https://wa.me/573001299545?text=" + encodeURIComponent(msg);
  const q = `?p=${estado.pantalla}&b=${estado.base}&t=${estado.tono}`;
  history.replaceState(null, "", location.pathname + q + location.hash);
}

function enlace() {
  return `${location.origin}${location.pathname}?p=${estado.pantalla}&b=${estado.base}&t=${estado.tono}`;
}
function marcar(b, on) { b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; }
function teclasRadio(cont, fn) {
  cont.addEventListener("keydown", (e) => {
    const bs = [...cont.querySelectorAll("[role=radio]")];
    const i = bs.indexOf(document.activeElement);
    if (i < 0) return;
    const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = bs[(i + d + bs.length) % bs.length];
    n.focus();
    fn(n.dataset.id);
  });
}
function silueta(id) {
  const m = manifiesto && manifiesto[id];
  if (!m) return "<svg></svg>";
  const der = m.perfil.map(([r, z]) => `${r.toFixed(1)},${(-(z + 15)).toFixed(1)}`);
  const izq = m.perfil.slice().reverse().map(([r, z]) => `${(-r).toFixed(1)},${(-(z + 15)).toFixed(1)}`);
  return `<svg viewBox="-75 -200 150 202" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><path d="M${der.join(" L")} L${izq.join(" L")} Z"/><rect x="-51" y="-22" width="102" height="22" rx="5"/></svg>`;
}
function sinWebGL() {
  // sin 3D: el taller funciona igual con las fotos de cada lámpara
  const e = $(".kz-escena");
  $("#kz-carga").classList.add("is-lista");
  $(".kz-escena__pista").hidden = true;
  $("#kz-interruptor").hidden = true;
  $(".kz-paso--luz").hidden = true;
  e.insertAdjacentHTML("beforeend", '<img class="kz-foto" id="kz-foto" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain">');
  const foto = () => {
    const f = $("#kz-foto");
    f.src = `img/kasa/kasa-${estado.pantalla}.webp?v=${V}`;
    f.alt = `Lámpara KASA ${porId(PANTALLAS, estado.pantalla).nombre} encendida`;
  };
  foto();
  const simple = (k) => (id) => { estado[k] = id; pintarSeleccion(); if (k === "pantalla") { foto(); $("#kz-nombre-grande").textContent = porId(PANTALLAS, id).nombre.toUpperCase(); } };
  construirPanel({ pantalla: simple("pantalla"), base: simple("base"), tono: simple("tono"), luz: () => {} });
  pintarSeleccion();
  window.kasaProbar = (id) => { $("#taller").scrollIntoView({ behavior: "smooth" }); simple("pantalla")(id); };
  const v = $(".kz-sistema__visor");
  if (v) v.innerHTML = '<img src="img/kasa/kasa-escena-sistema.webp" alt="Base KASA con su luz y pantallas intercambiables" style="width:100%;height:100%;object-fit:contain">';
}

/* ==========================================================================
   2. CÓMO FUNCIONA: vista explotada
   ========================================================================== */
async function sistema() {
  const canvas = $("#kz-explota");
  if (!canvas) return;
  let esc;
  try { esc = crearEscenario(canvas); } catch (e) { return; }
  if (!esc.renderer.getContext()) return;
  const { renderer, scene, camara } = esc;
  const lamp = new Lampara(scene, "#c9b291");
  await lamp.ponerBase();
  const ronda = ["gota", "ola", "hongo", "cesta"];
  const geos = {};
  geos.gota = await geometriaPantalla("gota");
  lamp.pantalla = lamp.crearPantalla(geos.gota, "#f7f5f0");
  lamp.pantalla.castShadow = false;
  ronda.slice(1).forEach(async (id) => { geos[id] = await geometriaPantalla(id); });

  // posiciones por paso: [alto de la pantalla, alto del puck, opacidad pantalla, luz, giro, cámara y]
  const PASOS = [
    { pant: 0.16, puck: 0, op: 0.0, luz: 0, giro: 0.5, cy: 0.04, d: 0.42, et: ["base", "ranura"] },
    { pant: 0.16, puck: 0.045, op: 0.0, luz: 0.9, giro: 0.2, cy: 0.05, d: 0.42, et: ["luz", "cable"] },
    { pant: 0.06, puck: 0, op: 1, luz: 0.25, giro: -0.1, cy: 0.12, d: 0.8, et: ["pantalla", "ranura"] },
    { pant: 0, puck: 0, op: 1, luz: 0.6, giro: -0.3, cy: 0.1, d: 0.68, et: [] }
  ];
  const act = { pant: 0.16, puck: 0, op: 0, luz: 0, giro: 0.5, cy: 0.04, d: 0.42 };
  let paso = 0;
  const pasos = document.querySelectorAll(".kz-pasos__item");
  const obs = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (e.isIntersecting) {
        paso = +e.target.dataset.paso;
        pasos.forEach((p) => p.classList.toggle("is-on", p === e.target));
        document.querySelectorAll(".kz-et").forEach((t) => t.classList.toggle("is-on", PASOS[paso].et.includes(t.dataset.parte)));
      }
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  pasos.forEach((p) => obs.observe(p));

  // paso 4: la pantalla cambia sola
  let iRonda = 0, ultimoCambio = 0, cambiando = false;
  async function siguiente() {
    cambiando = true;
    const vieja = lamp.pantalla;
    await tween(380, (k) => { vieja.position.y = ASIENTO + k * 0.08; vieja.material.opacity = 1 - k; }, ease.inOut);
    lamp.grupo.remove(vieja);
    iRonda = (iRonda + 1) % ronda.length;
    const g = geos[ronda[iRonda]] || geos.gota;
    const n = lamp.crearPantalla(g, "#f7f5f0");
    n.castShadow = false;
    lamp.pantalla = n;
    await tween(650, (k, t) => { n.position.y = ASIENTO + (1 - k) * 0.1; n.material.opacity = Math.min(1, t * 2.2); }, ease.back);
    cambiando = false;
  }

  const etiquetas = [...document.querySelectorAll(".kz-et")];
  const v = new THREE.Vector3();
  const ancla = {
    pantalla: () => v.set(0.07, ASIENTO + act.pant + 0.12, 0),
    ranura: () => v.set(-0.07, 0.024, 0.02),
    luz: () => v.set(0, 0.03 + act.puck + 0.025, 0),
    base: () => v.set(0.07, 0.008, 0.03),
    cable: () => v.set(0.13, 0.004, -0.13)
  };
  let antes = performance.now();
  renderer.setAnimationLoop((now) => {
    tweens.forEach((t) => t.paso(now));
    const dt = Math.min(0.1, (now - antes) / 1000); antes = now;
    if (!esc.visible()) return;
    const P = PASOS[paso];
    const kk = 1 - Math.exp(-dt * 4.5);
    for (const k of ["pant", "puck", "op", "luz", "giro", "cy", "d"]) act[k] += (P[k] - act[k]) * kk;
    if (paso === 3 && !cambiando && now - ultimoCambio > 2200) { ultimoCambio = now; siguiente(); }
    if (!cambiando) {
      lamp.pantalla.position.y = ASIENTO + act.pant;
      lamp.pantalla.material.opacity = act.op;
      lamp.pantalla.visible = act.op > 0.01;
    }
    lamp.puck.position.y = act.puck;
    lamp.ponerLuz(act.luz);
    lamp.grupo.rotation.y = act.giro + Math.sin(now / 3000) * 0.08;
    const ang = 0.5;
    camara.position.set(Math.sin(ang) * act.d * 0.6, act.cy + act.d * 0.42, Math.cos(ang) * act.d);
    camara.lookAt(0, act.cy, 0);
    renderer.render(scene, camara);
    // etiquetas
    const w = canvas.clientWidth, h = canvas.clientHeight;
    etiquetas.forEach((t) => {
      if (!t.classList.contains("is-on")) return;
      const p = ancla[t.dataset.parte]();
      lamp.grupo.localToWorld(p);
      p.project(camara);
      const mx = t.offsetWidth / 2 + 8;
      t.style.left = Math.min(w - mx, Math.max(mx, ((p.x + 1) / 2) * w)) + "px";
      t.style.top = Math.min(h - 20, Math.max(20, ((1 - p.y) / 2) * h)) + "px";
    });
  });
  document.querySelectorAll(".kz-et").forEach((t) => t.classList.toggle("is-on", PASOS[0].et.includes(t.dataset.parte)));
}

/* ==========================================================================
   3. GALERÍA
   ========================================================================== */
function galeria() {
  const g = $("#kz-galeria");
  if (!g) return;
  PANTALLAS.forEach((p) => {
    const m = manifiesto ? manifiesto[p.id] : null;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "kz-card";
    b.setAttribute("aria-label", `Probar la pantalla ${p.nombre} en el taller`);
    b.innerHTML = `<img src="img/kasa/kasa-${p.id}.webp?v=${V}" alt="Lámpara KASA ${p.nombre} encendida" loading="lazy" decoding="async">
      <span class="kz-card__go">Probarla</span>
      <span class="kz-card__txt"><span class="kz-card__n">${p.nombre}</span><span class="kz-card__m">${m ? (m.H / 10).toFixed(1).replace(".", ",") + " cm" : ""}</span></span>`;
    b.addEventListener("click", () => window.kasaProbar && window.kasaProbar(p.id));
    g.appendChild(b);
  });
}

/* ==========================================================================
   4. PRECIOS Y CARRITO (lee catalogo.js)
   ========================================================================== */
function comercio() {
  const pesos = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
  const cat = window.ITO_CATALOGO;
  const prod = (id) => cat && cat.productos.find((p) => p.id === id);
  const kit = prod("kasa-kit"), pant = prod("kasa-pantalla");
  if (kit && kit.precio) $("#kz-precio-kit").textContent = pesos.format(kit.precio);
  if (pant && pant.precio) $("#kz-precio-pantalla").textContent = pesos.format(pant.precio);
  const nombre = (l, id) => porId(l, id).nombre;
  const abrir = () => { const c = document.querySelector("[data-abrir-carrito]"); if (c) c.click(); };
  $("#kz-agregar-kit").addEventListener("click", () => {
    if (!window.ITO_agregarAlCarrito) return;
    window.ITO_agregarAlCarrito("kasa-kit", `${nombre(PANTALLAS, estado.pantalla)} · Base ${nombre(BASES, estado.base)} · Pantalla ${nombre(TONOS, estado.tono)}`, "", 1);
    abrir();
  });
  $("#kz-agregar-pantalla").addEventListener("click", () => {
    if (!window.ITO_agregarAlCarrito) return;
    window.ITO_agregarAlCarrito("kasa-pantalla", `${nombre(PANTALLAS, estado.pantalla)} · ${nombre(TONOS, estado.tono)}`, "", 1);
    abrir();
  });
  $("#kz-compartir").addEventListener("click", async (e) => {
    const b = e.currentTarget, txt = b.lastChild.textContent;
    try { await navigator.clipboard.writeText(enlace()); b.lastChild.textContent = " ¡Enlace copiado! Compártelo con quien quieras."; }
    catch (err) { b.lastChild.textContent = " " + enlace(); }
    setTimeout(() => { b.lastChild.textContent = txt; }, 2600);
  });
}

/* ---------- arranque ------------------------------------------------------ */
(async function () {
  try { await cargarManifiesto(); } catch (e) { /* sin datos: la galería sale sin medidas */ }
  galeria();
  taller();
  sistema();
  if (window.ITO_CATALOGO) comercio();
  else window.addEventListener("DOMContentLoaded", comercio);
})();
