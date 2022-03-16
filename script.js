import * as THREE from "./three.js-r134-min/build/three.module.js";
import { GLTFLoader } from './three.js-r134-min/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from './three.js-r134-min/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './three.js-r134-min/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from './three.js-r134-min/examples/jsm/postprocessing/GlitchPass.js';
import { UnrealBloomPass } from './three.js-r134-min/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ScrollTrigger } from "./gsap-public/esm/ScrollTrigger.js";
import { CSSPlugin } from "./gsap-public/esm/CSSPlugin.js";
import { CSSRulePlugin } from "./gsap-public/esm/CSSRulePlugin.js";
import  Stats  from './three.js-r134-min/examples/jsm/libs/stats.module.js';


window.onload = function() {
 

  window.location.href = "./#home";

  function getDeviceWidth() {
    if (typeof (window.innerWidth) == 'number') {
        //Non-IE
        return window.innerWidth;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        return document.documentElement.clientWidth;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        //IE 4 compatible
        return document.body.clientWidth;
    }
    return 0;
}

function getDeviceHeight() {
  if (typeof (window.innerHeight) == 'number') {
      //Non-IE
      return window.innerHeight;
  } else if (document.documentElement && (document.documentElement.clientHeight || document.documentElement.clientWidth)) {
      //IE 6+ in 'standards compliant mode'
      return document.documentElement.clientHeight;
  } else if (document.body && (document.body.clientHeight || document.body.clientWidth)) {
      //IE 4 compatible
      return document.body.clientHeight;
  }
  return 0;
}

    

  /*                       THREEJS                             */

  var renderer,  camera, HEIGHT, WIDTH, aspectRatio, composer;
  var ambientLight;
  var scene = null;
  var canvReference = null;
  var cameraCenter = new THREE.Vector3();
  var cameraHorzLimit = 0.05;
  var cameraVertLimit = 0.05;
  var mouse = new THREE.Vector2();
  var scene_anim = gsap.timeline();
  var subLine1, subLine2, subLine3, subLine4, subLine5, subLine6, subLine7, subLine8;
  var mainCube;
  var stats;
  var cubeRotation = gsap.timeline();
  var particleRotation = gsap.timeline();
  var container = document.querySelector('.container');
  var maxScrollTop = container.clientHeight;
  
  

  gsap.registerPlugin(ScrollTrigger, CSSPlugin, CSSRulePlugin );


    init();
    animate();
 
    

  function addStatsObject() {
    stats = new Stats();
    stats.setMode(0);

    stats.domElement.style.position = 'fixed';
    stats.domElement.style.left = 0 + 'px';
    stats.domElement.style.top = 0 + 'px';
    stats.domElement.style.zIndex = 100;

    document.body.appendChild( stats.domElement );
}
  

  function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000524)
    //00061f
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20 );
    camera.position.z = 4;
    cameraCenter.x = camera.position.x;
    cameraCenter.y = camera.position.y;
    
    let bigDevice = getDeviceWidth() >= 1600;
    let mediumDevice = getDeviceWidth() <= 1600 && getDeviceWidth() >= 1200;
    let smallDevice = getDeviceWidth() < 1200;
    // Select the canvas from the document
    canvReference = document.getElementById("webgl");
  
    // Then pass it to the renderer constructor
      renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      canvas: canvReference,
      antialias: false
      
  });
 
  console.log(getDeviceWidth())
  console.log(getDeviceHeight())

  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio( window.devicePixelRatio );

  
  
 // document.body.appendChild( renderer.domElement );

  // addStatsObject();

  /* LOADING MANAGER */
  const loadingManager = new THREE.LoadingManager( () => {
	
		const loadingScreen = document.getElementById( 'loading-screen' );
		loadingScreen.classList.add( 'fade-out' );
		
		// optional: remove loader from DOM via event listener
		loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
		
	} );

  // Objects
  

  const particlesGeometry = new THREE.BufferGeometry();
  const particlesGeometryLower = new THREE.BufferGeometry();
  const particlesGeometryLowerLower = new THREE.BufferGeometry();
  const particlesGeometryLowerLowerRight = new THREE.BufferGeometry();
  var particlesCnt;
  if(getDeviceWidth() < 1200 ) particlesCnt = 100;
  else particlesCnt = 300;
  

  const posArray = new Float32Array(particlesCnt * 3);
  const posArrayLower = new Float32Array(particlesCnt * 3);
  const posArrayLowerLower = new Float32Array(particlesCnt * 3);
  const posArrayLowerLowerRight = new Float32Array(particlesCnt * 3);


  for(let i = 0; i < particlesCnt * 3; i++){
      posArray[i] = (Math.random() - 0.5) * 10
  }

  for(let i = 0; i < particlesCnt * 3; i+=3){
    posArrayLower[i] = (Math.random() - 0.5) * 10;
    posArrayLower[i+1] = ((Math.random() - 0.5) * 10) - 5;
    posArrayLower[i+2] = (Math.random() - 0.5) * 10;
    posArrayLowerLower[i] = posArrayLower[i];
    posArrayLowerLower[i+1] = posArrayLower[i+1] - 5;
    posArrayLowerLower[i+2] = posArrayLower[i+2];
    posArrayLowerLowerRight[i] = posArrayLower[i] + 7.5;
    posArrayLowerLowerRight[i+1] = posArrayLower[i+1] - 5;
    posArrayLowerLowerRight[i+2] = posArrayLower[i+2];
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeometryLower.setAttribute('position', new THREE.BufferAttribute(posArrayLower, 3));
  particlesGeometryLowerLower.setAttribute('position', new THREE.BufferAttribute(posArrayLowerLower, 3));
  particlesGeometryLowerLowerRight.setAttribute('position', new THREE.BufferAttribute(posArrayLowerLowerRight, 3));

  // Materials
  //const particlematerial = new THREE.MeshBasicMaterial( {  color:  0x00ecff00, wireframe: true } );
  const texture = new THREE.TextureLoader(loadingManager).load('./src/iceTexture.png');
  const textureAlpha = new THREE.TextureLoader(loadingManager).load('./src/alpha.png');
  const particlesMaterial = new THREE.PointsMaterial({ color: 0x4f8fe5 ,size: 0.25, map: texture, alphaMap: textureAlpha, alphaTest: 0.25, transparent: false});
  
  renderer.initTexture(texture);
  renderer.initTexture(textureAlpha);

  // Mesh
 // const cube = new THREE.Points( geometry, tmaterial );
 
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  
  const particlesMeshLower = new THREE.Points(particlesGeometryLower, particlesMaterial);
  const particlesMeshLowerLower = new THREE.Points(particlesGeometryLowerLower, particlesMaterial);
  const particlesMeshLowerLowerRight = new THREE.Points(particlesGeometryLowerLowerRight, particlesMaterial);

    
  

  /* BLENDER IMPORTS */
  const loader = new GLTFLoader(loadingManager);


  var tokenModel;
  
  loader.load('./src/tokenModel.glb', (gltf) => {

    tokenModel = gltf.scene.clone();
    // tokenModel.frustumCulled = false;
    
    if(getDeviceWidth() >= 1280 && getDeviceWidth() < 1440) {
      tokenModel.scale.set( 0.815, 0.815, 0.815 );
      tokenModel.position.set(0, -13, 0 );
      tokenModel.children[0].position.z = 1.65;
      tokenModel.children[1].position.z = -2;

      scene_anim.to(tokenModel.position, { y: -9.8, scrollTrigger: {
        // , gltf.scene.children[1].position, gltf.scene.children[2].position
      trigger: ".services",
      start: maxScrollTop * 2.5,
      end: maxScrollTop * 3.25,
      scrub: 1,
      }});
    }
    else if(getDeviceWidth() >= 1440 && getDeviceWidth() < 1600) {
      tokenModel.scale.set( 0.9, 0.9, 0.9 );
      tokenModel.position.set(0, -13, 0 );
      tokenModel.children[0].position.z = 1.85;
      tokenModel.children[1].position.z = -2.2;

      scene_anim.to(tokenModel.position, { y: -10.2, scrollTrigger: {
        // , gltf.scene.children[1].position, gltf.scene.children[2].position
      trigger: ".services",
      start: maxScrollTop * 2.5,
      end: maxScrollTop * 3.25,
      scrub: 1,
      }});
    }

    else if(getDeviceWidth() <= 1199 && getDeviceWidth() >= 768 && getDeviceHeight() >= 950) {

      tokenModel.scale.set( 0.95, 0.95, 0.95);
      tokenModel.position.set(0, -15, 0 );
      tokenModel.children[0].position.x = 0;
      tokenModel.children[1].position.x = -10;
      tokenModel.children[1].visible = false;

      let graphButton = document.querySelector('#graphButton');

    const tlToken = gsap.timeline({
      defaults: { ease: "power4.inOut", duration: 0.75 }
    });
    tlToken.to(tokenModel.children[1].position, { x: 0 });
    tlToken.reversed(true);

    const tlToken2 = gsap.timeline({
      defaults: { ease: "power4.inOut", duration: 0.75 }
    });
    tlToken2.to(tokenModel.children[0].position, { x: -10 });
    tlToken2.reversed(true);

    const tlToken3 = gsap.timeline({
      defaults: { ease: "power4.inOut", duration: 0.375 }
    });
    tlToken3.to('#graphButton', { innerText: "Token Distribution" });
    tlToken3.reversed(true);


    graphButton.addEventListener('click', tokenAnim);

    function tokenAnim(e) {
      e.preventDefault();
      tlToken.reversed(!tlToken.reversed());
      tlToken2.reversed(!tlToken2.reversed());
      tlToken3.reversed(!tlToken3.reversed());
      if(tokenModel.children[0].visible) {

        tokenModel.children[0].visible = false;
        tokenModel.children[1].visible = true;
      }
      
      else {
        tokenModel.children[0].visible = true;
        tokenModel.children[1].visible = false;
      }

    }

      tokenModel.children[0].position.z = 0;
      tokenModel.children[1].position.z = 0;

      scene_anim.to(tokenModel.position, { y: -9.95, scrollTrigger: {
        // , gltf.scene.children[1].position, gltf.scene.children[2].position
      trigger: ".services",
      start: maxScrollTop * 2.5,
      end: maxScrollTop * 3.25,
      scrub: 1,
      }});

    }

    else if(getDeviceWidth() >= 768 && getDeviceWidth() < 1200 && getDeviceHeight() < 950) {
      tokenModel.scale.set( 1, 1, 1);
      tokenModel.position.set(0, -15, 0 );
      tokenModel.children[0].position.x = 0;
      tokenModel.children[1].position.x = -10;
      tokenModel.children[1].visible = false;

      let graphButton = document.querySelector('#graphButton');

    const tlToken = gsap.timeline({
      defaults: { ease: "power4.inOut", duration: 0.75 }
    });
    tlToken.to(tokenModel.children[1].position, { x: 0 });
    tlToken.reversed(true);

    const tlToken2 = gsap.timeline({
      defaults: { ease: "power4.inOut", duration: 0.75 }
    });
    tlToken2.to(tokenModel.children[0].position, { x: -10 });
    tlToken2.reversed(true);

    const tlToken3 = gsap.timeline({
      defaults: { ease: "power4.inOut", duration: 0.375 }
    });
    tlToken3.to('#graphButton', { innerText: "Token Distribution" });
    tlToken3.reversed(true);


    graphButton.addEventListener('click', tokenAnim);

    function tokenAnim(e) {
      e.preventDefault();
      tlToken.reversed(!tlToken.reversed());
      tlToken2.reversed(!tlToken2.reversed());
      tlToken3.reversed(!tlToken3.reversed());
      if(tokenModel.children[0].visible) {

        tokenModel.children[0].visible = false;
        tokenModel.children[1].visible = true;
      }
      
      else {
        tokenModel.children[0].visible = true;
        tokenModel.children[1].visible = false;
      }

    }

      tokenModel.children[0].position.z = 0;
      tokenModel.children[1].position.z = 0;

      scene_anim.to(tokenModel.position, { y: -9.8, scrollTrigger: {
        // , gltf.scene.children[1].position, gltf.scene.children[2].position
      trigger: ".services",
      start: maxScrollTop * 2.5,
      end: maxScrollTop * 3.25,
      scrub: 1,
      }});
    }

    else if(getDeviceWidth() >= 300 && getDeviceWidth() < 768 && getDeviceHeight() <= 1080) {
      tokenModel.scale.set( 1, 1, 1);
      tokenModel.position.set(0, -15, 0 );
      tokenModel.children[0].position.x = -2.5;
      tokenModel.children[1].position.x = -10;
      tokenModel.children[1].visible = false;

      let graphButton = document.querySelector('#graphButton');

    const tlToken = gsap.timeline({
      defaults: { ease: "power4.inOut", duration: 0.75 }
    });
    tlToken.to(tokenModel.children[1].position, { x: -1.5 });
    tlToken.reversed(true);

    const tlToken2 = gsap.timeline({
      defaults: { ease: "power4.inOut", duration: 0.75 }
    });
    tlToken2.to(tokenModel.children[0].position, { x: -10 });
    tlToken2.reversed(true);

    const tlToken3 = gsap.timeline({
      defaults: { ease: "power4.inOut", duration: 0.375 }
    });
    tlToken3.to('#graphButton', { innerText: "Token Distribution" });
    tlToken3.reversed(true);


    graphButton.addEventListener('click', tokenAnim);

    function tokenAnim(e) {
      e.preventDefault();
      tlToken.reversed(!tlToken.reversed());
      tlToken2.reversed(!tlToken2.reversed());
      tlToken3.reversed(!tlToken3.reversed());
      if(tokenModel.children[0].visible) {

        tokenModel.children[0].visible = false;
        tokenModel.children[1].visible = true;
      }
      
      else {
        tokenModel.children[0].visible = true;
        tokenModel.children[1].visible = false;
      }

    }

      tokenModel.children[0].position.z = 0;
      tokenModel.children[1].position.z = 0;

      scene_anim.to(tokenModel.position, { y: -10.1, scrollTrigger: {
        // , gltf.scene.children[1].position, gltf.scene.children[2].position
      trigger: ".services",
      start: maxScrollTop * 2.5,
      end: maxScrollTop * 3.25,
      scrub: 1,
      }});
    }


    else {
      tokenModel.position.set(0, -15, 0 );
      scene_anim.to(tokenModel.position, { y: -10.2, scrollTrigger: {
        // , gltf.scene.children[1].position, gltf.scene.children[2].position
      trigger: ".services",
      start: maxScrollTop * 2.5,
      end: maxScrollTop * 3.25,
      scrub: 1,
      }});
    }

    
    tokenModel.rotation.set(0, Math.PI * 1.5, 0);

    

    scene_anim.to(tokenModel.position , { x: -10, scrollTrigger: {

      trigger: ".node",
      start: maxScrollTop * 3.15,
      end: maxScrollTop * 4,
      scrub: 1,
      }});


    scene.add( tokenModel );



  } , undefined, function ( error ) {

    console.error( error );
    
    });

    var nodeModel;

  

    loader.load('./src/node.glb', (gltf) => {

      nodeModel = gltf.scene.clone();
      nodeModel.scale.set(.2, .2, .2)
      nodeModel.position.set(5, -11.3, 1.25);

      nodeModel.children[0].children[0].material = new THREE.MeshBasicMaterial({ map: gltf.scene.children[0].children[0].material.map, side: THREE.DoubleSide});
      nodeModel.children[1].children[0].material = new THREE.MeshBasicMaterial({ map: gltf.scene.children[1].children[0].material.map, side: THREE.DoubleSide});
      nodeModel.children[0].material = new THREE.MeshBasicMaterial({ color: 0x483D8B, wireframe: true });
      nodeModel.children[1].material = new THREE.MeshBasicMaterial({ color: 0x4169E1, wireframe: true });
     renderer.initTexture(nodeModel.children[0].children[0].material.map);
     renderer.initTexture(nodeModel.children[1].children[0].material.map);

      
      scene_anim.to(nodeModel.position , { x: 0, scrollTrigger: {

        trigger: ".node",
        start: maxScrollTop * 3,
        end: maxScrollTop * 4,
        scrub: 1,
        }});

  
      scene.add( nodeModel );
  
  
  
    } , undefined, function ( error ) {
  
      console.error( error );
      
      });

  var modelCurve;
  

  loader.load("./src/roadMapModel.glb", (gltf) => {

      modelCurve = gltf.scene.children[0].clone();
      // modelCurve.frustumCulled = false;
      
      modelCurve.position.set(0, -11.5, -30);
      modelCurve.scale.set(2, 2, 2);

      //scene.add( cubeModel );
      scene.add( modelCurve );
      
      
      scene_anim.to(modelCurve.rotation, { y: "+=" + Math.PI * 4, scrollTrigger: {
        // , gltf.scene.children[1].position, gltf.scene.children[2].position
      trigger: ".projects",
      start: maxScrollTop * 5,
      end: maxScrollTop * 8,
      scrub: 1,
      }});

      if( getDeviceWidth() >= 768 && getDeviceWidth() < 1199 && getDeviceHeight() < 950) {

          scene_anim.to(modelCurve.position, { z: -4.5, scrollTrigger: {
            //, gltf.scene.children[1].position, gltf.scene.children[2].position
          trigger: ".services",
          start: maxScrollTop * 4,
        end: maxScrollTop * 5,
        scrub: 1,

        }});
      }

      else if(getDeviceWidth() >= 768 && getDeviceWidth() < 1199 && getDeviceHeight() >= 950) {
        scene_anim.to(modelCurve.position, { z: -5, scrollTrigger: {
            //, gltf.scene.children[1].position, gltf.scene.children[2].position
          trigger: ".services",
          start: maxScrollTop * 4,
        end: maxScrollTop * 5,
        scrub: 1,
        }});
      }

      else if(getDeviceWidth() < 767 && getDeviceHeight() < 1080) {
        scene_anim.to(modelCurve.position, { z: -5.1, scrollTrigger: {
            //, gltf.scene.children[1].position, gltf.scene.children[2].position
          trigger: ".projects",
          start: maxScrollTop * 4,
          end: maxScrollTop * 5,
          scrub: 1,
        }});
      }

      else {
          scene_anim.to(modelCurve.position, { z: -4.25, scrollTrigger: {
            //, gltf.scene.children[1].position, gltf.scene.children[2].position
          trigger: ".services",
          start: maxScrollTop * 4,
        end: maxScrollTop * 5,
        scrub: 1,
        }});
      }
        
      
      scene_anim.to(modelCurve.position, { y: "+=" + 3.5, scrollTrigger: {
      trigger: ".projects",
      start: maxScrollTop * 5,
      end: maxScrollTop * 8,
      scrub: 1,
      }});
      


}, undefined, function ( error ) {

console.error( error );

});




  

  loader.load("./src/mainCube.glb", (gltf) => {
        let offsetX = null;
        mainCube = gltf.scene.children[0].clone();
   
        if(getDeviceWidth() < 1600 && getDeviceWidth() >= 1200) {
          offsetX = 1.5;
          mainCube.position.set(1.5, 0, 0);
        }
        else if(getDeviceWidth() < 1199 && getDeviceWidth() >= 768 && getDeviceHeight() < 950) {
            mainCube.scale.set(.6, .6, .6);
            mainCube.position.set(1.4, 0, 0);
            mainCube.rotation.set(Math.PI * 0.125, 0, 0);
        }

        else if(getDeviceWidth() < 1200 && getDeviceWidth() >= 768 && getDeviceHeight() >= 950) {
          mainCube.scale.set(.5, .5, .5);
          mainCube.position.set(0.85, 0, 0);
          mainCube.rotation.set(Math.PI * 0.125, 0, 0);
      }

      else if(getDeviceWidth() < 768 && getDeviceWidth() >= 300 && getDeviceHeight() <= 1280) {
        mainCube.scale.set(.5, .5, .5);
        mainCube.position.set(0, 0, 0);
        mainCube.rotation.set(Math.PI * 0.0, 0, 0);
      }

        else {
          offsetX = 1.25;
          mainCube.position.set(1.25, 0, 0);
        }
        
        // y -1.8


        if(getDeviceWidth() >= 1200) mainCube.rotation.set(Math.PI * 0.125, 0, 0);
       
        mainCube.material.transparent = true;
        mainCube.children[0].material.transparent = true;
        mainCube.children[1].material.transparent = true;
        mainCube.children[0].material.alphaTest = 0.10;
       
    
          if(mainCube.children[0].material.opacity != 0 && cubeRotation ) {

        cubeRotation.to([
              
              mainCube.rotation,
            ],
            { duration: 30, y: Math.PI * 2, repeat: -1, ease: "none", });
            }
        
            if(getDeviceWidth() >= 1200) {

        scene_anim.to(mainCube.position, { y: -4.8, x: "-=" + offsetX, z: "-=12", scrollTrigger: {
          // , gltf.scene.children[1].position, gltf.scene.children[2].position
        trigger: ".home",
        start: 0,
        end: maxScrollTop,
        scrub: 1,
        }});

        
        scene_anim.to([
          mainCube.material,
          mainCube.children[0].material,
          mainCube.children[1].material],
          { opacity: 0, scrollTrigger: {
          // , gltf.scene.children[1].position, 
        trigger: ".services",
        start: maxScrollTop,
        end: maxScrollTop * 2,
        scrub: 1,
        }});
        
      }

      else if(getDeviceWidth() < 768 && getDeviceHeight() < 1000){
        scene_anim.to(mainCube.position, { y: -5, x: 0, z: "-=5", scrollTrigger: {
          // , gltf.scene.children[1].position, gltf.scene.children[2].position
        trigger: ".home",
        start: 0,
        end: maxScrollTop,
        scrub: 1,
        }});
      

      scene_anim.to([
        mainCube.material,
        mainCube.children[0].material,
        mainCube.children[1].material],
        { opacity: 0, scrollTrigger: {
        // , gltf.scene.children[1].position, 
      trigger: ".home",
      start: maxScrollTop * 0.5,
      end: maxScrollTop,
      scrub: 1,
      }});
      
    }

      else {
        scene_anim.to(mainCube.position, { y: -3, x: 0, z: "-=8", scrollTrigger: {
          // , gltf.scene.children[1].position, gltf.scene.children[2].position
        trigger: ".home",
        start: 0,
        end: maxScrollTop,
        scrub: 1,
        }});
      

      scene_anim.to([
        mainCube.material,
        mainCube.children[0].material,
        mainCube.children[1].material],
        { opacity: 0, scrollTrigger: {
        // , gltf.scene.children[1].position, 
      trigger: ".home",
      start: maxScrollTop * 0.5,
      end: maxScrollTop,
      scrub: 1,
      }});
    }
        scene.add( mainCube );
        
        /*
       setInterval( (e) => {
        camera.lookAt(mainCube.position);
       }, 0.1);
        */

  }, undefined, function ( error ) {

    console.error( error );

    });

    
    // LINES
  
const pointsMaterial = new THREE.PointsMaterial({ color: 0x3477af, size: .05, map: texture, alphaMap: textureAlpha, alphaTest: 0.5 });
    // LEFT
// sub curve left, first from top

const curveSub1 = new THREE.SplineCurve( [
  new THREE.Vector2( -0.3, -5.1 ),
  new THREE.Vector2( -1.5, -4.3 ),
  new THREE.Vector2( -2.5, -4.4),
  new THREE.Vector2( -3.5, -4.2 )
] );

const pointsSub1 = curveSub1.getPoints( 50 );
const geometrySub1 = new THREE.BufferGeometry().setFromPoints( pointsSub1 );
geometrySub1.drawRange.start = 0;
geometrySub1.drawRange.count = 0;
 subLine1 = new THREE.Points( geometrySub1, pointsMaterial );
 if(getDeviceWidth() >= 1200)  scene.add(subLine1);


// sub curve left, second from top

const curveSub2 = new THREE.SplineCurve( [
  new THREE.Vector2( -0.4, -5.25 ),
  new THREE.Vector2( -1, -5.25 ),
  new THREE.Vector2( -2, -4.95 ),
  new THREE.Vector2( -3.5, -5.15 )
] );

const pointsSub2 = curveSub2.getPoints( 50 );
const geometrySub2 = new THREE.BufferGeometry().setFromPoints( pointsSub2 );
geometrySub2.drawRange.start = 0;
geometrySub2.drawRange.count = 0;

subLine2 = new THREE.Points( geometrySub2, pointsMaterial );

subLine1.add(subLine2);


// sub curve left, third from top

const curveSub3 = new THREE.SplineCurve( [
  new THREE.Vector2( -0.4, -5.45 ),
  new THREE.Vector2( -1, -5.6 ),
  new THREE.Vector2( -2, -6.25 ),
  new THREE.Vector2( -3.5, -6.2 )
] );

const pointsSub3 = curveSub3.getPoints( 50 );
const geometrySub3 = new THREE.BufferGeometry().setFromPoints( pointsSub3 );
geometrySub3.drawRange.start = 0;
geometrySub3.drawRange.count = 0;
 subLine3 = new THREE.Points( geometrySub3, pointsMaterial );

 subLine1.add(subLine3);

// sub curve left, fourth from top

const curveSub4 = new THREE.SplineCurve( [
  new THREE.Vector2( -0.3, -5.8 ),
  new THREE.Vector2( -1.25, -6.6 ),
  new THREE.Vector2( -2.5, -6.8 ),
  new THREE.Vector2( -3.5, -7.4 )
] );

const pointsSub4 = curveSub4.getPoints( 50 );
const geometrySub4 = new THREE.BufferGeometry().setFromPoints( pointsSub4 );
geometrySub4.drawRange.start = 0;
geometrySub4.drawRange.count = 0;
subLine4 = new THREE.Points( geometrySub4, pointsMaterial );

subLine1.add(subLine4);


  // RIGHT

  // sub curve rightLayer, first from top

const curveSub5 = new THREE.SplineCurve( [
  new THREE.Vector2( 0.3, -5.1 ),
  new THREE.Vector2( 1.5, -4.3 ),
  new THREE.Vector2( 2.5, -4.4),
  new THREE.Vector2( 3.5, -4.2 )
] );

const pointsSub5 = curveSub5.getPoints( 50 );
const geometrySub5 = new THREE.BufferGeometry().setFromPoints( pointsSub5 );
geometrySub5.drawRange.start = 0;
geometrySub5.drawRange.count = 0;
subLine5 = new THREE.Points( geometrySub5, pointsMaterial );


subLine1.add(subLine5);

// sub curve rightLayer, second from top

const curveSub6 = new THREE.SplineCurve( [
  new THREE.Vector2( 0.4, -5.25 ),
  new THREE.Vector2( 1, -5.25 ),
  new THREE.Vector2( 2, -4.95 ),
  new THREE.Vector2( 3.5, -5.15 )
] );

const pointsSub6 = curveSub6.getPoints( 50 );
const geometrySub6 = new THREE.BufferGeometry().setFromPoints( pointsSub6 );
geometrySub6.drawRange.start = 0;
geometrySub6.drawRange.count = 0;
 subLine6 = new THREE.Points( geometrySub6, pointsMaterial );

 subLine1.add(subLine6);


// sub curve rightLayer, third from top

const curveSub7 = new THREE.SplineCurve( [
  new THREE.Vector2( 0.4, -5.45 ),
  new THREE.Vector2( 1, -5.6 ),
  new THREE.Vector2( 2, -6.25 ),
  new THREE.Vector2( 3.5, -6.2 )
] );

const pointsSub7 = curveSub7.getPoints( 50 );
const geometrySub7 = new THREE.BufferGeometry().setFromPoints( pointsSub7 );
geometrySub7.drawRange.start = 0;
geometrySub7.drawRange.count = 0;
 subLine7 = new THREE.Points( geometrySub7, pointsMaterial );

 subLine1.add(subLine7);


// sub curve rightLayer, fourth from top

const curveSub8 = new THREE.SplineCurve( [
  new THREE.Vector2( 0.3, -5.8 ),
  new THREE.Vector2( 1.25, -6.6 ),
  new THREE.Vector2( 2.5, -6.8 ),
  new THREE.Vector2( 3.5, -7.4 )
] );

const pointsSub8 = curveSub8.getPoints( 50 );
const geometrySub8 = new THREE.BufferGeometry().setFromPoints( pointsSub8 );
geometrySub8.drawRange.start = 0;
geometrySub8.drawRange.count = 0;
 subLine8 = new THREE.Points( geometrySub8, pointsMaterial );


 subLine1.add(subLine8);



  // LIGHTS
    
    ambientLight = new THREE.AmbientLight(0xFFFFFF, 50);
    
   // gsap.to(ambientLight , { intensity: 2.25, duration: 2, ease: "none" });

      scene.add( ambientLight );

  // scene.add
   scene.add( particlesMesh );
   scene.add( particlesMeshLower );
   scene.add( particlesMeshLowerLower );
   scene.add( particlesMeshLowerLowerRight );
   
  if(!smallDevice) {

  
  particleRotation.to([
              
    particlesMesh.rotation,
    particlesMeshLower.rotation,
    particlesMeshLowerLower.rotation,
    particlesMeshLowerLowerRight.rotation,
  ],
  { duration: 75, y: Math.PI * 2, repeat: -1, ease: "none" });

  }
  
  

  gsap.to([particlesMesh.material, particlesMeshLower.material,particlesMeshLowerLower.material,], {size: 0.015, duration: 5, ease: Sine});
  // EFFECT COMPOSER + BLOOM EFFECT
  composer = new EffectComposer( renderer );
  const renderPass = new RenderPass( scene, camera );
  composer.addPass( renderPass );

  var unRealBloomPass = new UnrealBloomPass( window.devicePixelRatio , 0.4, 0, 0.1);

  var glitchPass = new GlitchPass();
    composer.addPass( renderPass );
    composer.addPass( unRealBloomPass );
    
    // composer.addPass( glitchPass );
  if(getDeviceWidth() >= 1200 ) document.addEventListener('mousemove', onDocumentMouseMove, false);
  window.addEventListener( 'resize', handleWindowResize, false );

  
 }


 function updateCamera() {
  //offset the camera x/y based on the mouse's position in the window
  camera.position.x = cameraCenter.x + (cameraHorzLimit * mouse.x);
  camera.position.y = cameraCenter.y + (cameraVertLimit * mouse.y);
  
}

function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
}

  function handleWindowResize(e) {
    // Az ablak átméretezése esetén a kamera vetítési paraméterek újraszámolása
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    console.log( 'WIDTH=' + WIDTH + '; HEIGHT=' + HEIGHT );
    renderer.setSize( WIDTH, HEIGHT );
    composer.setSize( WIDTH, HEIGHT );
    aspectRatio = WIDTH / HEIGHT;
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();

    $(".container").css("max-height", `${window.innerHeight}px`);
    
    maxScrollTop = container.clientHeight;
    
    ScrollTrigger.refresh();
   
}
 
  
  function animate() {
    
      updateCamera();
      requestAnimationFrame( animate );
      // controls.update();
      composer.render();
     // stats.update()
    // render();

 
  }

  function render() {
    renderer.render( scene, camera );
}


  // VIDEO JS

var videoButton = document.querySelector('#videoButton');
var videoContainer = document.querySelector('#videoContainer');
var video = document.querySelector('#video');

document.querySelector('.container').addEventListener('scroll', leaveVideoContainerOnScroll);

function leaveVideoContainerOnScroll() {
    if(videoContainer.style.clipPath === 'circle(100% at 50% 50%)' || videoContainer.style.clipPath === 'circle(100% at center center)') {
        video.pause();
        gsap.to(videoContainer, { 'clip-path': 'circle(0%)', duration: 0.75, ease: Sine});
        cubeRotation.play();
        particleRotation.play();
    }
}
video.volume = 0.05;

videoButton.addEventListener('click', (e) => {
    e.preventDefault();
    gsap.to(videoContainer, { 'clip-path': 'circle(100%)',  duration: 0.75, ease: Sine});
  /*
    if(getDeviceWidth() <= 786) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) { 
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) { 
        video.msRequestFullscreen();
      }
    }
    */

      video.play();
      cubeRotation.pause();
      particleRotation.pause();
      
});

document.addEventListener('keydown', (e) => {
    e.preventDefault();
    if(e.key === "Escape" && videoContainer.style.clipPath != "circle(0% at center center)") {
        video.pause();
       gsap.to(videoContainer, { 'clip-path': 'circle(0%)', duration: 0.75, ease: Sine});
         cubeRotation.play();
         particleRotation.play();
    }
});

$(videoContainer).on('click', function(e) {
  e.preventDefault();
  if (e.target !== this) return;
  
  video.pause();

  gsap.to(videoContainer, { 'clip-path': 'circle(0%)', duration: 0.75, ease: Sine});
 
   cubeRotation.play();
   particleRotation.play();
});


 // ScrollTrigger animations
 
 ScrollTrigger.defaults({
  ease: "power1.inOut",
  scroller: ".container",
  immediateRender: false,
  invalidateOnRefresh: true,
});



scene_anim.to([camera.position, cameraCenter ], { y: "-=10.15", scrollTrigger: {

trigger: ".about",
start: 0,
end: maxScrollTop * 3,
scrub: 1,
}});




    scene_anim.to([camera.position, cameraCenter ] , { z: "-=5", scrollTrigger: {

      trigger: ".node",
      start: maxScrollTop * 4,
      end: maxScrollTop * 5,
      scrub: 1,
      }});


scene_anim.to([camera.position, cameraCenter ], { x: "+=7.5", scrollTrigger: {

      trigger: ".marketSection",
      start: maxScrollTop * 8.15,
      end: maxScrollTop * 9,
      scrub: 1,
      }});   


const eco_anim = gsap.to([ 
  subLine1.geometry.drawRange,
  subLine2.geometry.drawRange,
  subLine3.geometry.drawRange,
  subLine4.geometry.drawRange,
  subLine5.geometry.drawRange,
  subLine6.geometry.drawRange,
  subLine7.geometry.drawRange,
  subLine8.geometry.drawRange,

], { count: 75, scrollTrigger: {
  trigger: ".about",
  start: maxScrollTop * 0.35,
  end: maxScrollTop * 1.5,
  scrub: 1,
  onLeave: function() { gsap.to([ 
    subLine1.geometry.drawRange,
    subLine2.geometry.drawRange,
    subLine3.geometry.drawRange,
    subLine4.geometry.drawRange,
    subLine5.geometry.drawRange,
    subLine6.geometry.drawRange,
    subLine7.geometry.drawRange,
    subLine8.geometry.drawRange,
  
  ], { count: 0, duration: 1, ease: "none"})
  },

  }});
  


let textHolders = document.querySelectorAll('.textHolder');
let ecoContainers = document.querySelectorAll('.ecoContainer');

for(let i = 0; i < textHolders.length; i++) {
  const tlEco = gsap.timeline({
    defaults: { ease:  "power1.easeInOut", duration: 0.4 }
  });
   tlEco.to(textHolders[i], { 'clip-path': 'circle(100%)' });
  tlEco.reversed(true);
  
    ecoContainers[i].addEventListener('click', (e)=> {
        e.preventDefault();


        tlEco.reversed(!tlEco.reversed());
  
    });
}


/* TOKEN2 ANIMATION */

let icoButton = document.querySelector('#icoButton');

const tl = gsap.timeline({
  defaults: { ease: "power4.inOut", duration: 0.75 }
});
 tl.to("#tokenContent", { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" });
tl.reversed(true);

const tl2 = gsap.timeline({
  defaults: { ease: "power4.inOut", duration: 0.75 }
});
tl2.to(".tokens", { top: 0 });
tl2.reversed(true);


icoButton.addEventListener('click', icoAnim);

function icoAnim(e) {
  e.preventDefault();
  tl.reversed(!tl.reversed());
  tl2.reversed(!tl2.reversed());

}




/* MARKETPLACE SECTION */
let stickys;

if(getDeviceWidth() < 1200) { stickys = document.querySelectorAll('div.lilRoad');} 
else  { stickys = document.querySelectorAll('div.bigRoad'); }



    stickys[0].addEventListener('click', (e)=> {
      e.preventDefault();
          document.querySelector('.container').scrollTo({
           top: maxScrollTop * 5,
           behavior: 'smooth'
          });
    });

    stickys[1].addEventListener('click', (e)=> {
      e.preventDefault();
      document.querySelector('.container').scrollTo({
       top: maxScrollTop * (5 + 0.1895),
       behavior: 'smooth'
      });
});

stickys[2].addEventListener('click', (e)=> {
  e.preventDefault();
  document.querySelector('.container').scrollTo({
   top: maxScrollTop * (5 + 0.4),
   behavior: 'smooth'
  });
});

stickys[3].addEventListener('click', (e)=> {
  e.preventDefault();
  document.querySelector('.container').scrollTo({
   top: maxScrollTop * (5 + 0.63),
   behavior: 'smooth'
  });
});

stickys[4].addEventListener('click', (e)=> {
  e.preventDefault();
  document.querySelector('.container').scrollTo({
   top: maxScrollTop * (5 + 0.8775),
   behavior: 'smooth'
  });
});

stickys[5].addEventListener('click', (e)=> {
  e.preventDefault();
  document.querySelector('.container').scrollTo({
   top: maxScrollTop * (5 + 1.15),
   behavior: 'smooth'
  });
});

stickys[6].addEventListener('click', (e)=> {
  e.preventDefault();
  document.querySelector('.container').scrollTo({
   top: maxScrollTop * (5 + 1.495),
   behavior: 'smooth'
  });
});

stickys[7].addEventListener('click', (e)=> {
  e.preventDefault();
  document.querySelector('.container').scrollTo({
   top: maxScrollTop * (5 + 1.945),
   behavior: 'smooth'
  });
});

stickys[8].addEventListener('click', (e)=> {
  e.preventDefault();
  document.querySelector('.container').scrollTo({
   top: maxScrollTop * (5 + 2.875),
   behavior: 'smooth'
  });
});

// 5.25 -> 8.25
function onTransitionEnd( event ) {

	event.target.remove();
	
}


/* HAMBURGER MENU FOR PHONE AND TABLETS */

let hamburger = document.querySelector('#hamburgerMenu');

const tlHamburger = gsap.timeline({
  defaults: { ease: "power4.inOut", duration: 0.6, delay: 0.2 }
});
tlHamburger.to(".linkContainer", { clipPath: "polygon(0 0, 100% 0, 100% 120%, 0 120%)"  });
tlHamburger.reversed(true);

const tl2Hamburger = gsap.timeline({
  defaults: { ease: "power4.inOut", duration: 0.6, delay: 0.3 }
});
tl2Hamburger.to(".header-container", { height: "100vh", backgroundColor: "rgba(20, 18, 117, 0.95)" });
tl2Hamburger.reversed(true);

const tl3Hamburger = gsap.timeline({
  defaults: { ease: "power4.inOut", duration: 0.2, delay: 0.1 }
});
tl3Hamburger.to('#hamburgerMenu', { transform: "rotate(45deg)" });
tl3Hamburger.reversed(true);



hamburger.addEventListener('click', hamburgerAnim);

function hamburgerAnim(e) {
  e.preventDefault();
  tlHamburger.reversed(!tlHamburger.reversed());
  tl2Hamburger.reversed(!tl2Hamburger.reversed());
  tl3Hamburger.reversed(!tl3Hamburger.reversed());

}

let links = document.querySelectorAll('.li');
console.log(tl.reversed())
for(let i = 0; i < links.length; i++) {
  
      links[i].addEventListener('click', (e) => {

        tlHamburger.reverse();
        tl2Hamburger.reverse();
        tl3Hamburger.reverse();
       
      });
}




}