import * as THREE from "./three.js-r134-min/build/three.module.js";
import { GLTFLoader } from "./three.js-r134-min/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "./three.js-r134-min/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "./three.js-r134-min/examples/jsm/loaders/RGBELoader.js";
import { EffectComposer } from "./three.js-r134-min/examples/jsm/postprocessing/EffectComposer.js";
import { FXAAShader } from "./three.js-r134-min/examples/jsm/shaders/FXAAShader.js";
import { ShaderPass } from "./three.js-r134-min/examples/jsm/postprocessing/ShaderPass.js";
import { RenderPass } from "./three.js-r134-min/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "./three.js-r134-min/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ScrollTrigger } from "./gsap-public/esm/ScrollTrigger.js";
import { CSSPlugin } from "./gsap-public/esm/CSSPlugin.js";
import { CSSRulePlugin } from "./gsap-public/esm/CSSRulePlugin.js";
import { CustomEase } from "./gsap-public/src/CustomEase.js";
import { OrbitControls } from "./three.js-r134-min/examples/jsm/controls/OrbitControls.js";


var pointers = [];
var icLogo;

window.onload = function () {
  window.location.href = "./#home";


  function getDeviceWidth() {
    if (typeof window.innerWidth == "number") {
      //Non-IE
      return window.innerWidth;
    } else if (
      document.documentElement &&
      (document.documentElement.clientWidth ||
        document.documentElement.clientHeight)
    ) {
      //IE 6+ in 'standards compliant mode'
      return document.documentElement.clientWidth;
    } else if (
      document.body &&
      (document.body.clientWidth || document.body.clientHeight)
    ) {
      //IE 4 compatible
      return document.body.clientWidth;
    }
    return 0;
  }

  function getDeviceHeight() {
    if (typeof window.innerHeight == "number") {
      //Non-IE
      return window.innerHeight;
    } else if (
      document.documentElement &&
      (document.documentElement.clientHeight ||
        document.documentElement.clientWidth)
    ) {
      //IE 6+ in 'standards compliant mode'
      return document.documentElement.clientHeight;
    } else if (
      document.body &&
      (document.body.clientHeight || document.body.clientWidth)
    ) {
      //IE 4 compatible
      return document.body.clientHeight;
    }
    return 0;
  }

  /*                       THREEJS                             */

  var renderer,
    renderer2,
    camera,
    camera2,
    HEIGHT,
    WIDTH,
    aspectRatio,
    composer,
    composer2,
    controls;
  var ambientLight;
  var scene = null;
  var scene2 = null;
  var canvReference = null;
  var canvReference2 = null;
  var cameraCenter = new THREE.Vector3();
  var cameraHorzLimit = 0.05;
  var cameraVertLimit = 0.05;
  var mouse = new THREE.Vector2();
  var scene_anim = gsap.timeline();
  var template;
  // var container = document.querySelector("body");
  var container = document.body;
  var maxScrollTop = container.clientHeight;

  gsap.registerPlugin(ScrollTrigger, CSSPlugin, CSSRulePlugin, CustomEase);

  const raycaster = new THREE.Raycaster();
  let currentIntersect = null;

  init();

  animate();

  function init() {
    canvReference = document.getElementById("webgl");
    canvReference2 = document.querySelector(".canvasContainer");
    var box = canvReference2.getBoundingClientRect();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000524);

    scene2 = new THREE.Scene();

    const hdrTextureURL = new URL("./src/img/env.hdr", import.meta.url);

    //00061f
    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      20
    );
    camera.position.z = 4;
    cameraCenter.x = camera.position.x;
    cameraCenter.y = camera.position.y;

    camera2 = new THREE.PerspectiveCamera(60, box.width / box.height, 0.1, 20);
    camera2.updateProjectionMatrix();
    camera2.position.z = 1.5;

    if (getDeviceWidth() >= 1200) {
      controls = new OrbitControls(camera2, canvReference2);
      controls.update();
    }
    // Select the canvas from the document

    // Then pass it to the renderer constructor
    renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      canvas: canvReference,
      antialias: false,
    });

    renderer2 = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      canvas: canvReference2,
      antialias: false,
    });

    console.log(getDeviceWidth());
    console.log(getDeviceHeight());

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;

    renderer2.setClearColor(0x000a31, 0.6);
    renderer2.setSize(box.width, box.height);
    renderer2.setPixelRatio(2);
    //renderer2.outputEncoding = THREE.sRGBEncoding
    renderer2.toneMapping = THREE.ACESFilmicToneMapping;
    renderer2.toneMappingExposure = 1.5;

    /* LOADING MANAGER */
    const loadingManager = new THREE.LoadingManager(() => {
      const loadingScreen = document.getElementById("loading-screen");
      loadingScreen.classList.add("fade-out");

      // optional: remove loader from DOM via event listener

      loadingScreen.addEventListener("transitionend", onTransitionEnd);
    });

    loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
      const loadingScreen = document.getElementById("loading-screen");

      loadingScreen.innerText =
        ((itemsLoaded / itemsTotal) * 100).toFixed() + "%";
    };

    /* BLENDER IMPORTS */
    const loader = new GLTFLoader(loadingManager);

    const draco = new DRACOLoader(loadingManager);

    draco.setDecoderPath("./three.js-r134-min/examples/js/libs/draco/");

    loader.setDRACOLoader(draco);

    const rgbeLoader = new RGBELoader(loadingManager);

    rgbeLoader.load(hdrTextureURL, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      renderer.initTexture(texture);

      loader.load(
        "./src/roadMapModel.glb",
        (gltf) => {
          modelCurve = gltf.scene.children[0].clone();
          // modelCurve.frustumCulled = false;

          modelCurve.traverse((obj) => {
              if(obj.isMesh && obj.material.name === "Névtelen terv") {
                gsap.to(obj.scale, { x: 0.5, y: 0.5,  duration: 2, ease: 'elastic', repeat: -1, yoyo: true });
              }
          })

          modelCurve.position.set(0, -11.5, -30);
          modelCurve.scale.set(2, 2, 2);

          // if(modelCurve.children[9].children[2] != null)
          //  renderer.initTexture(modelCurve.children[9].children[2].material.map)

          //scene.add( cubeModel );

          scene.add(modelCurve);

          scene_anim.to(modelCurve.rotation, {
            y: "+=" + Math.PI * 4,
            scrollTrigger: {
              // , gltf.scene.children[1].position, gltf.scene.children[2].position
              trigger: ".projects",
              start: maxScrollTop * 5,
              end: maxScrollTop * 8,
              scrub: 1,
            },
          });

          if (
            getDeviceWidth() >= 768 &&
            getDeviceWidth() < 1199 &&
            getDeviceHeight() < 950
          ) {
            scene_anim.to(modelCurve.position, {
              z: -4.5,
              scrollTrigger: {
                //, gltf.scene.children[1].position, gltf.scene.children[2].position
                trigger: ".services",
                start: maxScrollTop * 4,
                end: maxScrollTop * 5,
                scrub: 1,
              },
            });
          } else if (
            getDeviceWidth() >= 768 &&
            getDeviceWidth() < 1199 &&
            getDeviceHeight() >= 950
          ) {
            scene_anim.to(modelCurve.position, {
              z: -5,
              scrollTrigger: {
                //, gltf.scene.children[1].position, gltf.scene.children[2].position
                trigger: ".services",
                start: maxScrollTop * 4,
                end: maxScrollTop * 5,
                scrub: 1,
              },
            });
          } else if (getDeviceWidth() < 767 && getDeviceHeight() < 1080) {
            scene_anim.to(modelCurve.position, {
              z: -5.1,
              scrollTrigger: {
                //, gltf.scene.children[1].position, gltf.scene.children[2].position
                trigger: ".projects",
                start: maxScrollTop * 4,
                end: maxScrollTop * 5,
                scrub: 1,
              },
            });
          } else {
            scene_anim.to(modelCurve.position, {
              z: -4.25,
              scrollTrigger: {
                //, gltf.scene.children[1].position, gltf.scene.children[2].position
                trigger: ".services",
                start: maxScrollTop * 4,
                end: maxScrollTop * 5,
                scrub: 1,
              },
            });
          }

          scene_anim.to(modelCurve.position, {
            y: "+=" + 3.5,
            scrollTrigger: {
              trigger: ".projects",
              start: maxScrollTop * 5,
              end: maxScrollTop * 8,
              scrub: 1,
            },
          });
        },
        undefined,
        function (error) {
          console.error(error);
        }
      );

      loader.load(
        "./src/template.glb",
        (gltf) => {
          const txt = new THREE.TextureLoader(loadingManager).load(
            "./src/img/bg.jpg"
          );

          renderer2.initTexture(txt);

          template = gltf.scene;
          template.name = "template";

          template.traverse((obj) => {

            if (obj.isMesh && obj.material.name === "backMaterial") {
              obj.material.roughness = 0.25;
              obj.material.metalness = 0.25;
              obj.material.map = txt;
              
            }
            if (
              obj.isMesh &&
              obj.name != "backPlain" &&
              obj.name != "Sphere003" &&
              obj.material.name != "textMaterial"
            ) {
              obj.material.roughness = 0.25;
              obj.material.metalness = 0.25;
            }

            if (obj.isMesh && obj.name === "icLogo") {
              obj.material.roughness = 0.25;
              obj.material.metalness = 1;
              icLogo = obj;
            }

            if (obj.isMesh && obj.material.name === "textMaterial") {
              obj.material.metalness = 0.5;
              obj.material.roughness = 0.2;
            }

            if (obj.isMesh && obj.name === "frontPlain") {
              obj.position.y -= 0.075;
            }

            if (obj.isMesh && obj.name === "Sphere003") {
              obj.material.roughness = 0;
              obj.material.metalness = 0.5;
            }

            if (
              obj.isMesh &&
              (obj.name === "WatchCubeOne" || obj.name === "WatchCubeSecond")
            ) {
              pointers.push(obj);
            }
            if (obj.isMesh) {
              obj.material.envMap = texture;
            }
          });

          template.rotateY(-Math.PI / 2);
          template.position.set(0, -0.05, 0);

          template.scale.set(1.25, 1.25, 1.25);

          if (getDeviceWidth() <= 768) {
            template.position.set(0, 0.15, 0);
          } else if (getDeviceWidth() >= 768 && getDeviceWidth() < 1200) {
            template.position.set(0, 0.1, 0);
          }

          // camera.lookAt(template.position)
          scene2.add(template);

          gsap.to(template.rotation, {
            y: "+=" + Math.PI * 2,
            duration: 7.5,
            repeat: -1,
            repeatDelay: 12.5,
            ease: CustomEase.create(
              "custom",
              "M0,0,C0,0,0.108,0.255,0.17,0.34,0.242,0.44,0.363,0.474,0.448,0.53,0.636,0.654,0.617,0.731,0.708,0.84,0.816,0.97,1,1,1,1"
            ),
          });
        },
        undefined,
        function (error) {
          console.error(error);
        }
      );
    });

    var tokenModel;

    loader.load(
      "./src/tokenModel.glb",
      (gltf) => {
        tokenModel = gltf.scene.clone();
        // tokenModel.frustumCulled = false;

        if (getDeviceWidth() >= 1280 && getDeviceWidth() < 1440) {
          tokenModel.scale.set(0.815, 0.815, 0.815);
          tokenModel.position.set(0, -13, 0);
          tokenModel.children[0].position.z = 1.65;
          tokenModel.children[1].position.z = -2;

          scene_anim.to(tokenModel.position, {
            y: -9.8,
            scrollTrigger: {
              // , gltf.scene.children[1].position, gltf.scene.children[2].position
              trigger: ".services",
              start: maxScrollTop * 2.5,
              end: maxScrollTop * 3.25,
              scrub: 1,
            },
          });
        } else if (getDeviceWidth() >= 1440 && getDeviceWidth() < 1600) {
          tokenModel.scale.set(0.9, 0.9, 0.9);
          tokenModel.position.set(0, -13, 0);
          tokenModel.children[0].position.z = 1.85;
          tokenModel.children[1].position.z = -2.2;

          scene_anim.to(tokenModel.position, {
            y: -10.2,
            scrollTrigger: {
              // , gltf.scene.children[1].position, gltf.scene.children[2].position
              trigger: ".services",
              start: maxScrollTop * 2.5,
              end: maxScrollTop * 3.25,
              scrub: 1,
            },
          });
        } else if (
          getDeviceWidth() <= 1199 &&
          getDeviceWidth() >= 768 &&
          getDeviceHeight() >= 950
        ) {
          tokenModel.scale.set(0.95, 0.95, 0.95);
          tokenModel.position.set(0, -15, -1);
          tokenModel.children[0].position.x = 0;
          tokenModel.children[1].position.x = 0;
          tokenModel.children[1].visible = false;

          let graphButton = document.querySelector("#graphButton");

          const tlToken = gsap.timeline({
            defaults: { ease: "power4.inOut", duration: 0.75 },
          });
          tlToken.to(tokenModel.children[1].rotation, { y: Math.PI * 2 });
          tlToken.reversed(true);

          const tlToken2 = gsap.timeline({
            defaults: { ease: "power4.inOut", duration: 0.75 },
          });
          tlToken2.to(tokenModel.children[0].rotation, { y: Math.PI * 2 });
          tlToken2.reversed(true);

          const tlToken3 = gsap.timeline({
            defaults: { ease: "power4.inOut", duration: 0.375 },
          });
          tlToken3.to("#graphButton", { innerText: "Token Distribution" });
          tlToken3.reversed(true);

          graphButton.addEventListener("click", tokenAnim);

          function tokenAnim(e) {
            e.preventDefault();
            tlToken.reversed(!tlToken.reversed());
            tlToken2.reversed(!tlToken2.reversed());
            tlToken3.reversed(!tlToken3.reversed());

            setTimeout((e) => {
              if (tokenModel.children[0].visible) {
                tokenModel.children[0].visible = false;
                tokenModel.children[1].visible = true;
              } else {
                tokenModel.children[0].visible = true;
                tokenModel.children[1].visible = false;
              }
            }, 375);
          }

          tokenModel.children[0].position.z = 0;
          tokenModel.children[1].position.z = 0;

          scene_anim.to(tokenModel.position, {
            y: -9.75,
            scrollTrigger: {
              // , gltf.scene.children[1].position, gltf.scene.children[2].position
              trigger: ".services",
              start: maxScrollTop * 2.5,
              end: maxScrollTop * 3.25,
              scrub: 1,
            },
          });
        } else if (getDeviceWidth() >= 768 && getDeviceWidth() < 1200) {
          tokenModel.scale.set(1, 1, 1);
          tokenModel.position.set(0, -15, 0);
          tokenModel.children[0].position.x = 0;
          tokenModel.children[1].position.x = 0;
          tokenModel.children[1].visible = false;

          let graphButton = document.querySelector("#graphButton");

          const tlToken = gsap.timeline({
            defaults: { ease: "power4.inOut", duration: 0.75 },
          });
          tlToken.to(tokenModel.children[1].rotation, { y: Math.PI * 2 });
          tlToken.reversed(true);

          const tlToken2 = gsap.timeline({
            defaults: { ease: "power4.inOut", duration: 0.75 },
          });
          tlToken2.to(tokenModel.children[0].rotation, { y: Math.PI * 2 });
          tlToken2.reversed(true);

          const tlToken3 = gsap.timeline({
            defaults: { ease: "power4.inOut", duration: 0.375 },
          });
          tlToken3.to("#graphButton", { innerText: "Token Distribution" });
          tlToken3.reversed(true);

          graphButton.addEventListener("click", tokenAnim);

          function tokenAnim(e) {
            e.preventDefault();
            tlToken.reversed(!tlToken.reversed());
            tlToken2.reversed(!tlToken2.reversed());
            tlToken3.reversed(!tlToken3.reversed());

            setTimeout((e) => {
              if (tokenModel.children[0].visible) {
                tokenModel.children[0].visible = false;
                tokenModel.children[1].visible = true;
              } else {
                tokenModel.children[0].visible = true;
                tokenModel.children[1].visible = false;
              }
            }, 375);
          }

          tokenModel.children[0].position.z = 0;
          tokenModel.children[1].position.z = 0;

          scene_anim.to(tokenModel.position, {
            y: -9.8,
            scrollTrigger: {
              // , gltf.scene.children[1].position, gltf.scene.children[2].position
              trigger: ".services",
              start: maxScrollTop * 2.5,
              end: maxScrollTop * 3.25,
              scrub: 1,
            },
          });
        } else if (getDeviceWidth() >= 300 && getDeviceWidth() < 768) {
          tokenModel.scale.set(1, 1, 1);
          tokenModel.position.set(0, -15, -2.5);
          tokenModel.children[1].visible = false;

          let graphButton = document.querySelector("#graphButton");

          const tlToken = gsap.timeline({
            defaults: { ease: "power4.inOut", duration: 0.75 },
          });
          tlToken.to(tokenModel.children[1].rotation, { y: Math.PI * 2 });
          tlToken.reversed(true);

          const tlToken2 = gsap.timeline({
            defaults: { ease: "power4.inOut", duration: 0.75 },
          });
          tlToken2.to(tokenModel.children[0].rotation, { y: Math.PI * 2 });
          tlToken2.reversed(true);

          const tlToken3 = gsap.timeline({
            defaults: { ease: "power4.inOut", duration: 0.375 },
          });
          tlToken3.to("#graphButton", { innerText: "Token Distribution" });
          tlToken3.reversed(true);

          graphButton.addEventListener("click", tokenAnim);

          function tokenAnim(e) {
            e.preventDefault();
            tlToken.reversed(!tlToken.reversed());
            tlToken2.reversed(!tlToken2.reversed());
            tlToken3.reversed(!tlToken3.reversed());

            setTimeout((e) => {
              if (tokenModel.children[0].visible) {
                tokenModel.children[0].visible = false;
                tokenModel.children[1].visible = true;
              } else {
                tokenModel.children[0].visible = true;
                tokenModel.children[1].visible = false;
              }
            }, 375);
          }

          tokenModel.children[0].position.z = 0;
          tokenModel.children[1].position.z = 0;

          scene_anim.to(tokenModel.position, {
            y: -9.5,
            scrollTrigger: {
              // , gltf.scene.children[1].position, gltf.scene.children[2].position
              trigger: ".services",
              start: maxScrollTop * 2.5,
              end: maxScrollTop * 3.25,
              scrub: 1,
            },
          });
        } else {
          tokenModel.position.set(0, -15, 0);
          scene_anim.to(tokenModel.position, {
            y: -10.2,
            scrollTrigger: {
              // , gltf.scene.children[1].position, gltf.scene.children[2].position
              trigger: ".services",
              start: maxScrollTop * 2.5,
              end: maxScrollTop * 3.25,
              scrub: 1,
            },
          });
        }

        tokenModel.rotation.set(0, Math.PI * 1.5, 0);

        scene_anim.to(tokenModel.position, {
          x: -10,
          scrollTrigger: {
            trigger: ".node",
            start: maxScrollTop * 3.15,
            end: maxScrollTop * 4,
            scrub: 1,
          },
        });

        scene.add(tokenModel);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    var nodeModel;

    loader.load(
      "./src/node.glb",
      (gltf) => {
        nodeModel = gltf.scene.clone();

        nodeModel.scale.set(0.2, 0.2, 0.2);
        nodeModel.position.set(5, -11.3, 1.25);

        nodeModel.children[0].children[0].material =
          new THREE.MeshBasicMaterial({
            map: gltf.scene.children[0].children[0].material.map,
            side: THREE.DoubleSide,
          });
        nodeModel.children[1].children[0].material =
          new THREE.MeshBasicMaterial({
            map: gltf.scene.children[1].children[0].material.map,
            side: THREE.DoubleSide,
          });
        nodeModel.children[0].material = new THREE.MeshBasicMaterial({
          color: 0x483d8b,
          wireframe: true,
        });
        nodeModel.children[1].material = new THREE.MeshBasicMaterial({
          color: 0x4169e1,
          wireframe: true,
        });
        renderer.initTexture(nodeModel.children[0].children[0].material.map);
        renderer.initTexture(nodeModel.children[1].children[0].material.map);

        scene_anim.to(nodeModel.position, {
          x: 0,
          scrollTrigger: {
            trigger: ".node",
            start: maxScrollTop * 3,
            end: maxScrollTop * 4,
            scrub: 1,
          },
        });

        scene.add(nodeModel);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    var modelCurve;

    renderer.compile(scene, camera);

    // LIGHTS

    ambientLight = new THREE.AmbientLight(0xffffff, 1);

    scene.add(ambientLight);

    // EFFECT COMPOSER + BLOOM EFFECT
    composer = new EffectComposer(renderer);
    composer2 = new EffectComposer(renderer2);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const renderPass2 = new RenderPass(scene2, camera2);
    composer2.addPass(renderPass2);

    var unRealBloomPass = new UnrealBloomPass(
      window.devicePixelRatio,
      0.375,
      0.325,
      0.1
    );

    composer.addPass(unRealBloomPass);
    composer2.addPass(unRealBloomPass);

    var effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms["resolution"].value.x =
      1 / (window.innerWidth * window.devicePixelRatio);
    effectFXAA.uniforms["resolution"].value.y =
      1 / (window.innerHeight * window.devicePixelRatio);
    composer.addPass(effectFXAA);

    if (getDeviceWidth() >= 1200) {
      document.addEventListener("pointermove", onDocumentMouseMove, false);
      document.addEventListener("click", onLinkClick, false);
    } else {
      document.addEventListener("touchstart", onDocumentMouseMove, false);
      document.addEventListener("click", onLinkClick, false);
    }

    window.addEventListener("resize", handleWindowResize, false);
  }

  function updateCamera() {
    //offset the camera x/y based on the mouse's position in the window
    camera.position.x = cameraCenter.x + cameraHorzLimit * mouse.x;
    camera.position.y = cameraCenter.y + cameraVertLimit * mouse.y;
  }

  let checker = false;

  function onDocumentMouseMove(event) {
    event.preventDefault();
    if (getDeviceWidth() >= 1200 && event.clientX != undefined) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    } else if (getDeviceWidth() >= 1200 && event.clientX === undefined) {
      mouse.x = (event.touches[0].pageX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.touches[0].pageY / window.innerHeight) * 2 + 1;
    } else if (
      getDeviceWidth() < 1200 &&
      event.clientX === undefined &&
      event.touches[0] != undefined
    ) {
      mouse.x = (event.touches[0].pageX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.touches[0].pageY / window.innerHeight) * 2 + 1;
    }

    if (checker) {
      container.style.cursor = "default";
      currentIntersect = null;
      checker = false;
    }
  }

  function onLinkClick(event) {
    if (currentIntersect) {
      window.open("https://t.me/+MwG8fmzoEbJjOTZk", "_blank");
      checker = true;
    }
  }

  function handleWindowResize(e) {
    // Az ablak átméretezése esetén a kamera vetítési paraméterek újraszámolása
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    var box = canvReference2.getBoundingClientRect();

    console.log("WIDTH=" + WIDTH + "; HEIGHT=" + HEIGHT);
    renderer2.setSize(box.width, box.height);
    camera2.aspect = box.width / box.height;
    camera2.updateProjectionMatrix();

    renderer.setSize(WIDTH, HEIGHT);
    composer.setSize(WIDTH, HEIGHT);
    aspectRatio = WIDTH / HEIGHT;
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();

    

     $("body").css("max-height", `${window.innerHeight}px`);
     maxScrollTop = container.clientHeight;
    // ScrollTrigger.refresh();
  }

  function animate() {
    if (getDeviceWidth() >= 1200) {
      updateCamera();
      controls.update();
    }
    requestAnimationFrame(animate);

    composer.render();
    composer2.render();
    // stats.update()
    // render();

    if (pointers[0] != null) {
      pointers[0].rotation.x -= 0.01;
      pointers[1].rotation.x -= 0.005;
    }

    if (icLogo != null) {
      icLogo.rotation.y += 0.005;
    }

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
      //console.log(intersects[ 0 ].object.name)
      if (intersects[0].object.name === "Névtelen_terv") {
        container.style.cursor = "pointer";
        currentIntersect = intersects[i].object;
      } else if (intersects[0].object.name != "Névtelen_terv") {
        container.style.cursor = "default";
        currentIntersect = null;
      }
    }
  }

  // ScrollTrigger animations

  ScrollTrigger.defaults({
    ease: "power1.inOut",
    scroller: "body",
    immediateRender: false,
    invalidateOnRefresh: true,
  });

  scene_anim.to([camera.position, cameraCenter], {
    y: "-=10.15",
    scrollTrigger: {
      trigger: ".about",
      start: 0,
      end: maxScrollTop * 3,
      scrub: 1,
    },
  });

  scene_anim.to([camera.position, cameraCenter], {
    z: "-=5",
    scrollTrigger: {
      trigger: ".node",
      start: maxScrollTop * 4,
      end: maxScrollTop * 5,
      scrub: 1,
    },
  });

  scene_anim.to([camera.position, cameraCenter], {
    x: "+=7.5",
    scrollTrigger: {
      trigger: ".projects",
      start: maxScrollTop * 8.15,
      end: maxScrollTop * 9,
      scrub: 1,
    },
  });

  let roadLayer = document.querySelector("#roadLayer");
  let bigRoads = document.querySelectorAll(".bigRoad");

  scene_anim.to([roadLayer, bigRoads], {
    yPercent: -1000,
    scrollTrigger: {
      trigger: ".projects",
      start: maxScrollTop * 8.15,
      end: maxScrollTop * 9,
      scrub: 0,
    },
  });

  /* TOKEN2 ANIMATION */

  let icoButton = document.querySelector("#icoButton");

  const tl = gsap.timeline({
    defaults: { ease: "power4.inOut", duration: 0.75 },
  });
  tl.to("#tokenContent", {
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
  });
  tl.reversed(true);

  const tl2 = gsap.timeline({
    defaults: { ease: "power4.inOut", duration: 0.75 },
  });
  tl2.to(".tokens", { top: 0 });
  tl2.reversed(true);

  icoButton.addEventListener("click", icoAnim);

  function icoAnim(e) {
    e.preventDefault();
    tl.reversed(!tl.reversed());
    tl2.reversed(!tl2.reversed());
  }

  /* MARKETPLACE SECTION */
  let stickys;

  if (getDeviceWidth() < 1200) {
    stickys = document.querySelectorAll("div.lilRoad");
  } else {
    stickys = document.querySelectorAll("div.bigRoad");
  }

  stickys[0].addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector("body").scrollTo({
      top: maxScrollTop * 5,
      behavior: "smooth",
    });
  });

  stickys[1].addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector("body").scrollTo({
      top: maxScrollTop * (5 + 0.1895),
      behavior: "smooth",
    });
  });

  stickys[2].addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector("body").scrollTo({
      top: maxScrollTop * (5 + 0.4),
      behavior: "smooth",
    });
  });

  stickys[3].addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector("body").scrollTo({
      top: maxScrollTop * (5 + 0.63),
      behavior: "smooth",
    });
  });

  stickys[4].addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector("body").scrollTo({
      top: maxScrollTop * (5 + 0.8775),
      behavior: "smooth",
    });
  });

  stickys[5].addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector("body").scrollTo({
      top: maxScrollTop * (5 + 1.15),
      behavior: "smooth",
    });
  });

  stickys[6].addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector("body").scrollTo({
      top: maxScrollTop * (5 + 1.495),
      behavior: "smooth",
    });
  });

  stickys[7].addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector("body").scrollTo({
      top: maxScrollTop * (5 + 1.945),
      behavior: "smooth",
    });
  });

  stickys[8].addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector("body").scrollTo({
      top: maxScrollTop * (5 + 2.875),
      behavior: "smooth",
    });
  });

  // 5.25 -> 8.25
  function onTransitionEnd(event) {
    event.target.remove();
  }

  /* HAMBURGER MENU FOR PHONE AND TABLETS */

  let hamburger = document.querySelector(".hamburgerLi");
  let checkBox = document.querySelector('#menu-toggle')

  const tlHamburger = gsap.timeline({
    defaults: { ease: "power4.inOut", duration: 0.6, delay: 0.2 },
  });
  tlHamburger.to(".linkContainer", {
    clipPath: "polygon(0 0, 100% 0, 100% 120%, 0 120%)",
  });
  tlHamburger.reversed(true);

  const tl2Hamburger = gsap.timeline({
    defaults: { ease: "power4.inOut", duration: 0.6, delay: 0.3 },
  });
  tl2Hamburger.to(".header-container", {
    height: "100vh",
    backgroundColor: "rgba(20, 18, 117, 0.95)",
  });
  tl2Hamburger.reversed(true);


  hamburger.addEventListener("click", hamburgerAnim);
  const linkContainer = document.querySelector(".linkContainer");

  function hamburgerAnim(e) {
    e.preventDefault();

    if (linkContainer.style.display != "grid")
      linkContainer.style.display = "grid";
    else linkContainer.style.display = "none";
    tlHamburger.reversed(!tlHamburger.reversed());
    tl2Hamburger.reversed(!tl2Hamburger.reversed());
    checkBox.checked = !checkBox.checked;
  }

  let eventButton3 = document.querySelector("#eventButton3");
  let eventButton = document.querySelector("#eventButton");
  let eventText = null;
  // let countDownDate = new Date("Nov 11, 2022 24:00:00").getTime();
  let approvedCountDownDate = new Date("2022-10-16T24:00:00").getTime();

  let x = setInterval(function () {
    // Get today's date and time
    let now = new Date().getTime();

    // Find the distance between now and the count down date
    let distance = approvedCountDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (days < 10) {
      days = "0" + days;
    }
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    // Display the result in the element with id="demo"

    eventText = days + " : " + hours + " : " + minutes + " : " + seconds;

    eventButton.innerHTML = eventText;
    eventButton3.innerHTML = eventText;

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(x);
      eventButton.innerHTML = "EXPIRED";
    }
  }, 1000);

  let cntr = false;
  setInterval(() => {
    cntr = !cntr;

    if (cntr) {
  
      gsap.to("#eventButton3", { clipPath: "circle(100%)", duration: 1.5 });
      gsap.to("#eventContainer2", { clipPath: "circle(0%)", duration: 1.5 });
      gsap.to("#eventButton", { clipPath: "circle(100%)", duration: 1.5 });
      gsap.to("#timerContainerSmall", { clipPath: "circle(0%)", duration: 1.5 });
    } else {

      gsap.to("#eventButton3", { clipPath: "circle(0%)", duration: 1.5 });
      gsap.to("#eventContainer2", { clipPath: "circle(100%)", duration: 1.5 });
      gsap.to("#eventButton", { clipPath: "circle(0%)", duration: 1.5 });
      gsap.to("#timerContainerSmall", { clipPath: "circle(100%)", duration: 1.5 });
    }
  }, 5000);

  let links = document.querySelectorAll(".li");

  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener("click", (e) => {
      if (getDeviceWidth() < 1200) linkContainer.style.display = "none";

      tlHamburger.reverse();
      tl2Hamburger.reverse();
      checkBox.checked = !checkBox.checked;
    });
  }
};



const productScroll = document.querySelector('.productSlider');
const dots = document.querySelectorAll('.dot');

// const maxScroll = productScroll.scrollLeftMax;
const maxScroll = productScroll.getBoundingClientRect().width * 2.0;


for(let i = 0; i < dots.length; i++) {
  let offset = 0;
  if(i === 0)  offset = 0
  if(i === 1)  offset = maxScroll / 2
  if(i === 2)  offset = maxScroll

  dots[i].addEventListener('click', (e) => {
    //  gsap.to(productScroll, { scrollLeft: offset, duration: 1, ease: 'power1.inOut' });
    productScroll.scrollTo({
      behavior: 'smooth',
      left: offset
    })

  })

}

productScroll.addEventListener('scroll', (e) => {

  if(productScroll.scrollLeft < (0 + 25)) {
    dots[0].classList.add('activeSlide');
    dots[1].classList.remove('activeSlide');
    dots[2].classList.remove('activeSlide');
  }

  if(productScroll.scrollLeft < ((maxScroll / 2) + 25) && productScroll.scrollLeft > (0 + 25)) {
    dots[1].classList.add('activeSlide');
    dots[0].classList.remove('activeSlide');
    dots[2].classList.remove('activeSlide');
  }

  if(productScroll.scrollLeft < (maxScroll + 25) && productScroll.scrollLeft > ((maxScroll / 2) + 25)) {
    dots[2].classList.add('activeSlide');
    dots[1].classList.remove('activeSlide');
    dots[0].classList.remove('activeSlide');
  }
})

document.querySelector('#eventContainer').addEventListener('click', (e) => {
    window.open("https://icelinked.ch", '_blank');
})






