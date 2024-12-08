import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import SplitType from "split-type";
gsap.registerPlugin(ScrollTrigger);

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

/**
 * Textures
 */

/**
 * Test mesh
 */

const gltfLoader = new GLTFLoader();
gltfLoader.load("/black_chair.glb", (gltf) => {
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.rotation.z = 0.2;
    }
  });

  scene.add(gltf.scene);
});

// light

const ambientLight = new THREE.AmbientLight("lightblue");
ambientLight.intensity = 4;
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0.5, 7.5, 2.5).normalize();

let texts = [...document.querySelectorAll("[data-dom] li")];
console.log(texts);
texts.forEach((text) => {
  text.style.position = "relative";
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

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

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
controls.enableDamping = false;
controls.autoRotate = true;
controls.enableZoom = false;
controls.rotateSpeed = 0.6;

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

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
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
