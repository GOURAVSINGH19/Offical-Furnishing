import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import SplitType from "split-type";
import { Group } from "three";
import { animate } from "https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm";
gsap.registerPlugin(ScrollTrigger);

// Post-Processing
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { NoiseShader } from "./shaders/noise-shader.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

// lenis
const lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

let currentEffect = 0;
let aimEffect = 0;
let timeoutEffect;

/**
 * Textures
 */

/**
 * Test mesh
 */
const gltfLoader = new GLTFLoader();
const loadedgroup = new Group();
loadedgroup.position.y = -10;

const scrollGroup = new Group();
scrollGroup.add(loadedgroup);

scene.add(scrollGroup);

gltfLoader.load(
  "/black_chair.glb",
  (gltf) => {
    gltf.scene.rotation.z = 0.2;
    loadedgroup.add(gltf.scene);

    gsap.to(loadedgroup.position, {
      y: 0,
      duration: 2,
      delay: .1,
      ease: "power3.out",
    });
  },
  undefined, 
  (error) => {
    console.error("Error loading model:", error);
  }
);

// light

const ambience = new THREE.AmbientLight(0x404040);
scene.add(ambience);

const keyLight = new THREE.DirectionalLight(0xffffff, 1);
keyLight.position.set(-1, 1, 3);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
fillLight.position.set(1, 1, 3);
scene.add(fillLight);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(-1, 3, -1);
scene.add(backLight);

let texts = [...document.querySelectorAll("[data-dom] li")];
texts.forEach((text) => {
  text.style.position = "relative";
  texts[0].classList.add("active");
  text.addEventListener("click", () => {
    texts.forEach((item) => {
      item.classList.remove("active");
      gsap.to(item, {
        duration: 0.5,
        ease: "power2.inOut",
      });
    });

    text.classList.add("active");
  });
});

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  20,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 14;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableZoom = false;
controls.enablePan = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 2;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// post processing

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const clock = new THREE.Clock();

const Shader = new ShaderPass(NoiseShader);
Shader.uniforms.time.value = clock.getElapsedTime();
Shader.uniforms.effect.value = currentEffect;
Shader.uniforms.aspectRatio.value = window.innerWidth / window.innerHeight;
composer.addPass(Shader);

const outputPass = new OutputPass();
composer.addPass(outputPass);

/**
 * Animate
 */

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  scrollGroup.rotation.set(0, window.scrollY * 0.001, 0);
  currentEffect += (aimEffect - currentEffect) * 0.05;

  Shader.uniforms.time.value = elapsedTime;
  Shader.uniforms.effect.value = currentEffect;

  // Update controls
  controls.update();

  window.requestAnimationFrame(tick);
  // Render
  composer.render();
  // Call tick again on the next frame
};

tick();

const headingtext = document.querySelector(".heading-little-text");
const headerSection = document.querySelector(".header");
const splitText = document.querySelector(".split-text h3");
const Section = document.querySelector(".section-footer");

const splitHeading = new SplitType(headingtext, {
  types: "lines",
  wordsClass: "lines",
});

const splitext = new SplitType(splitText, {
  types: "lines",
  lineClass: "line",
});

const Bigheading = [...document.querySelectorAll("[data-a-mod]")];

const Bigheadingsplit = new SplitType(Bigheading, {
  types: "words",
  lineClass: "words",
});

Bigheadingsplit.words.forEach((words) => {
  words.style.overflow = "hidden";
  const text = words.innerHTML;
  words.innerHTML = `<h3 style=" display:block ,transform: translateY(70px)" > ${text} </h3>`;
});

gsap.fromTo(
  Bigheadingsplit.words,
  {
    translateY: 100,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    stagger: { amount: 0.5 },
  },
  {
    translateY: 0,
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    stagger: { amount: 0.5 },
  }
);

splitHeading.lines.forEach((line) => {
  line.style.overflow = "hidden";
  const text = line.innerHTML;
  line.innerHTML = `<h3 style=" display:block ,transform: translateY(70px)" > ${text} </h3>`;
});

ScrollTrigger.create({
  trigger: headerSection,
  start: "center top",
  scrub: true,
  onEnter: () => {
    gsap.to(".middle-text  .line h3", {
      translateY: 70,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1,
      force3D: true,
      marker: true,
    });
  },

  onLeaveBack: () => {
    gsap.to(".middle-text  .line h3", {
      translateY: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1,
      force3D: true,
    });
  },

  toggleActions: "play reverse play reverse",
});

splitext.lines.forEach((line) => {
  line.style.overflow = "hidden";
  const text = line.innerHTML;
  line.innerHTML = `<h3 style=" display:block ,transform: translateY(70px)" > ${text} </h3>`;
});

ScrollTrigger.create({
  trigger: Section,
  start: "top center",
  onEnter: () => {
    gsap.to(".section-footer h3 .line h3", {
      translateY: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1,
      force3D: true,
    });
  },

  onLeaveBack: () => {
    gsap.to(".section-footer h3 .line h3", {
      translateY: 70,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1,
      force3D: true,
    });
  },

  toggleActions: "play reverse play reverse",
});

const scroll = () => {
  clearTimeout(timeoutEffect);

  aimEffect = 1;

  timeoutEffect = setTimeout(() => {
    aimEffect = 0;
  }, 100);
};
/**
 * Sizes
 */

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  Shader.uniforms.aspectRatio.value = window.innerWidth / window.innerHeight;

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("scroll", scroll);
