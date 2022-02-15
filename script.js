import * as THREE from "./three.js-r134-min/build/three.module.js";
import { TrackballControls } from './three.js-r134-min/examples/jsm/controls/TrackballControls.js';
import { GLTFLoader } from './three.js-r134-min/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from './three.js-r134-min/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './three.js-r134-min/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from './three.js-r134-min/examples/jsm/postprocessing/GlitchPass.js';
import { UnrealBloomPass } from './three.js-r134-min/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from './three.js-r134-min/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from './three.js-r134-min/examples/jsm/shaders/FXAAShader.js';
import { ScrollTrigger } from "./gsap-public/esm/ScrollTrigger.js";
import  Stats  from './three.js-r134-min/examples/jsm/libs/stats.module.js';


window.onload = function() {

/*     setting active class for nav  */

   const container = document.getElementsByClassName("li");
  
    const logo = document.querySelector('#logo');
    const home = document.querySelector('#homeLink');
    const about = document.querySelector('#aboutLink');
    const services = document.querySelector('#servicesLink');
    const project = document.querySelector('#projectLink');
    const contact = document.querySelector('#contactLink');

   // window.location.href = './#home'
    $(document).ready(function(){
    // Add smooth scrolling to all links
    $("a").on('click', function(event) {
  
      // Make sure this.hash has a value before overriding default behavior
      if (this.hash !== "") {
        // Prevent default anchor click behavior
        event.preventDefault();
  
        // Store hash
        var hash = this.hash;
  
        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
        $('html, body').animate({
          scrollTop: $(hash).offset().top
        }, 700, function(){
  
          // Add hash (#) to URL when done scrolling (default click behavior)
          window.location.hash = hash;
        });
      } // End if
    });
  });

/*
  $(function(){
    var current = location.pathname;
    $('#nav li a').each(function(){
        var $this = $(this);
        // if the current path is like this link, make it active
        if($this.attr('href').indexOf(current) !== -1){
            $this.addClass('active');
        }
    })
})
*/
  
  /*                       THREEJS                             */

  var renderer,  camera, HEIGHT, WIDTH, aspectRatio, tl4, controls, composer;
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
  var cubeRotation = true;
  
  
  
  gsap.registerPlugin(ScrollTrigger);
  init();
  

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
    
    // Select the canvas from the document
    canvReference = document.getElementById("webgl");
  
    // Then pass it to the renderer constructor
      renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
      canvas: canvReference,
      
  });
 // controls = new TrackballControls(camera, renderer.domElement);
  //controls.rotateSpeed = 5.0;
  //controls.panSpeed = 1.0;
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio( window.devicePixelRatio );
  
  
 // document.body.appendChild( renderer.domElement );

  addStatsObject();

  // Objects
  

  const particlesGeometry = new THREE.BufferGeometry();
  const particlesGeometryLower = new THREE.BufferGeometry();
  const particlesGeometryLowerLower = new THREE.BufferGeometry();
  const particlesGeometryLowerLowerRight = new THREE.BufferGeometry();
  const particlesCnt = 300;

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
  const texture = new THREE.TextureLoader().load('./src/iceTexture.png');
  const textureAlpha = new THREE.TextureLoader().load('./src/alpha.png');
  const particlesMaterial = new THREE.PointsMaterial({size: 0.25, map: texture, alphaMap: textureAlpha, alphaTest: 0.25, transparent: false});
  
  // Mesh
 // const cube = new THREE.Points( geometry, tmaterial );
 
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  
  const particlesMeshLower = new THREE.Points(particlesGeometryLower, particlesMaterial);
  const particlesMeshLowerLower = new THREE.Points(particlesGeometryLowerLower, particlesMaterial);
  const particlesMeshLowerLowerRight = new THREE.Points(particlesGeometryLowerLowerRight, particlesMaterial);

    
  // Cube Object 
  const loader = new GLTFLoader();
  var tokenModel;
  
  loader.load('./src/tokenModel.glb', (gltf) => {

    tokenModel = gltf.scene.clone();
    tokenModel.frustumCulled = false;
    

    tokenModel.position.set(0, -15, 0 );
    tokenModel.rotation.set(0, Math.PI * 1.5, 0);

    scene_anim.to(tokenModel.position, { y: -9.9, scrollTrigger: {
      // , gltf.scene.children[1].position, gltf.scene.children[2].position
    trigger: ".services",
    start: window.innerHeight * 2,
    end: window.innerHeight * 2.5,
    scrub: 1,
    update: camera.updateProjectionMatrix(),
    }});


    scene.add( tokenModel );



  } , undefined, function ( error ) {

    console.error( error );
    
    });




  var modelCurve;
  

  loader.load("./src/cubeModel.glb", (gltf) => {

      modelCurve = gltf.scene.children[0].clone();
      modelCurve.frustumCulled = false;
      

      modelCurve.position.set(0, -11.5, -25);
      modelCurve.scale.set(2, 2, 2);

      //scene.add( cubeModel );
      scene.add( modelCurve );
      
      
      scene_anim.to(modelCurve.rotation, { y: "+=" + Math.PI * 4, scrollTrigger: {
        // , gltf.scene.children[1].position, gltf.scene.children[2].position
      trigger: ".projects",
      start: window.innerHeight * 4.5,
      end: window.innerHeight * 7.5,
      scrub: 1,
      update: camera.updateProjectionMatrix(),
      }});
      
      scene_anim.to(modelCurve.position, { z: -4.25, scrollTrigger: {
        // , gltf.scene.children[1].position, gltf.scene.children[2].position
      trigger: ".services",
      start: window.innerHeight * 4,
      end: window.innerHeight * 4.5,
      scrub: 1,
      update: camera.updateProjectionMatrix(),
      }});
        
      
      scene_anim.to(modelCurve.position, { y: "+=" + 3.5, scrollTrigger: {
      trigger: ".projects",
      start: window.innerHeight * 4.5,
      end: window.innerHeight * 7.5,
      scrub: 1,
      update: camera.updateProjectionMatrix(),
      }});
      


}, undefined, function ( error ) {

console.error( error );

});




  

  loader.load("./src/new.glb", (gltf) => {
        let offsetX = null;
        mainCube = gltf.scene.clone();
   
        if(window.innerWidth < 1600) {
          offsetX = 1.5;
          mainCube.position.set(1.5, -1.8, 0);
        }

        else {
          offsetX = 1.25;
          mainCube.position.set(1.25, -1.8, 0);
        }
        
        // y -1.8
        mainCube.children[0].rotation.set(Math.PI * 0.125, 0, 0);
        mainCube.children[1].rotation.set(Math.PI * 0.125, 0, 0);
        mainCube.children[2].rotation.set(Math.PI * 0.125, 0, 0);
        
        mainCube.children[0].material = gltf.scene.children[0].material.clone();
        mainCube.children[1].material = gltf.scene.children[1].material.clone();
        mainCube.children[2].material = gltf.scene.children[2].material.clone();
        mainCube.children[0].material.transparent = true;
        mainCube.children[1].material.transparent = true;
        mainCube.children[2].material.transparent = true;
       
       
          // RIGHT MAIN CUBE
        
        setInterval(()=> {
          if(mainCube.children[0].material.opacity != 0 && cubeRotation ) {
            gsap.to([
              
              mainCube.children[0].rotation,
              mainCube.children[1].rotation,
              mainCube.children[2].rotation
              
            
            ],
            { y: "+=0.075", ease:Linear.easeNone });
            }
        

        }, 100); //  x: "+=0.075"
        

        scene_anim.to([mainCube.children[0].position, mainCube.children[1].position, mainCube.children[2].position], { y: -3, x: "-=" + offsetX, z: "-=12", scrollTrigger: {
          // , gltf.scene.children[1].position, gltf.scene.children[2].position
        trigger: ".home",
        start: 0,
        end: window.innerHeight,
        scrub: 1,
        update: camera.updateProjectionMatrix(),
        }});

        
        scene_anim.to([mainCube.children[0].material, mainCube.children[1].material, mainCube.children[2].material], { opacity: 0, scrollTrigger: {
          // , gltf.scene.children[1].position, 
        trigger: ".services",
        start: window.innerHeight,
        end: window.innerHeight * 2,
        scrub: 1,
        update: camera.updateProjectionMatrix(),
        }});
        
       
        
        scene.add( mainCube );

  }, undefined, function ( error ) {

    console.error( error );

    });


    // LINES
  
const materialWhite = new THREE.LineDashedMaterial( { color : 0xffffff, linewidth: 1 } );

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
 subLine1 = new THREE.Line( geometrySub1, materialWhite );
scene.add(subLine1);


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
subLine2 = new THREE.Line( geometrySub2, materialWhite );

scene.add(subLine2);


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
 subLine3 = new THREE.Line( geometrySub3, materialWhite );

scene.add(subLine3);

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
subLine4 = new THREE.Line( geometrySub4, materialWhite );

scene.add(subLine4);


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
subLine5 = new THREE.Line( geometrySub5, materialWhite );


scene.add(subLine5);

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
 subLine6 = new THREE.Line( geometrySub6, materialWhite );

scene.add(subLine6);


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
 subLine7 = new THREE.Line( geometrySub7, materialWhite );

scene.add(subLine7);


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
 subLine8 = new THREE.Line( geometrySub8, materialWhite );


scene.add(subLine8);



  // LIGHTS
    
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 50);
    scene.add( ambientLight );

  // scene.add
   scene.add( particlesMesh );
   scene.add( particlesMeshLower );
   scene.add( particlesMeshLowerLower );
   scene.add( particlesMeshLowerLowerRight );
   
  
  gsap.to([particlesMesh.material, particlesMeshLower.material,particlesMeshLowerLower.material,], {size: 0.015, duration: 5, ease: Sine});
  // EFFECT COMPOSER + BLOOM EFFECT
  composer = new EffectComposer( renderer );
  const renderPass = new RenderPass( scene, camera );
  composer.addPass( renderPass );

  const fxaaPass = new ShaderPass( FXAAShader );

  fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( window.innerWidth * window.devicePixelRatio );
	fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( window.innerHeight * window.devicePixelRatio );

  composer.addPass( fxaaPass );

  var unRealBloomPass = new UnrealBloomPass( window.devicePixelRatio , 0.5, 0.5, 0.1);

  var glitchPass = new GlitchPass();
    composer.addPass( renderPass );
    composer.addPass( unRealBloomPass );
    
    // composer.addPass( glitchPass );
  document.addEventListener('mousemove', onDocumentMouseMove, false);
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

    let sections = document.querySelectorAll('section');

    for(let i = 0; i < sections.length; i++) {
          if(sections[i].classList.contains('projects')) sections[i].style.height = HEIGHT * 4 + 60;
          else if(sections[i].classList.contains('services')) sections[i].style.height = HEIGHT * 1.5 + 60;
          else sections[i].style.height = HEIGHT + 60;
        }

    //render();
    composer.render();
}
  
  
  function animate() {
    
      updateCamera();
      requestAnimationFrame( animate );
      // controls.update();
      composer.render();
      stats.update()
    
    // render();
 
  }

  function render() {
    renderer.render( scene, camera );
}
animate();

  // VIDEO JS

var videoButton = document.querySelector('#videoButton');
var videoContainer = document.querySelector('#videoContainer');
var video = document.querySelector('#video');

video.volume = 0.05;

videoButton.addEventListener('click', (e) => {
      gsap.to(videoContainer, { 'clip-path': 'circle(100%)', duration: 0.75, ease: Sine})
      video.play();
      cubeRotation = false;
      
});

document.addEventListener('keydown', (e) => {
    if(e.key === "Escape" && videoContainer.style.clipPath != "circle(0% at center center)") {
        video.pause();
        gsap.to(videoContainer, { 'clip-path': 'circle(0%)', duration: 0.75, ease: Sine});
        cubeRotation = true;
    }
});

$(videoContainer).on('click', function(e) {
  if (e.target !== this) return;

  video.pause();
  gsap.to(videoContainer, { 'clip-path': 'circle(0%)', duration: 0.75, ease: Sine});
  cubeRotation = true;
});


 // ScrollTrigger animations
 
 ScrollTrigger.defaults({
  immediateRender: true,
  ease: "power1.inOut",
  scrub: 1,
 // anticipatePin: true,
});



scene_anim.to([camera.position, cameraCenter ], { y: "-=10.15", scrollTrigger: {

trigger: ".about",
start: 0,
end: window.innerHeight * 3,
scrub: 1,
update: camera.updateProjectionMatrix(),
}});



scene_anim.to([camera.position, cameraCenter ] , { z: "-=5", scrollTrigger: {

    trigger: ".node",
    start: window.innerHeight * 2.5,
    end: window.innerHeight * 3.5,
    scrub: 1,
    update: camera.updateProjectionMatrix(),
    }});


scene_anim.to([camera.position, cameraCenter ], { x: "+=7.5", scrollTrigger: {

      trigger: ".marketSection",
      start: window.innerHeight * 7.75,
      end: window.innerHeight * 8.5,
      scrub: 1,
      update: camera.updateProjectionMatrix(),
      }});   


scene_anim.to([ 
  subLine1.geometry.drawRange,
  subLine2.geometry.drawRange,
  subLine3.geometry.drawRange,
  subLine4.geometry.drawRange,
  subLine5.geometry.drawRange,
  subLine6.geometry.drawRange,
  subLine7.geometry.drawRange,
  subLine8.geometry.drawRange,

], { count: 50, scrollTrigger: {
  trigger: ".about",
  start: window.innerHeight - window.innerHeight * 0.35,
  end: window.innerHeight,
  scrub: 1,
  update: camera.updateProjectionMatrix(),
  }});


scene_anim.to([ 
    subLine1.geometry.drawRange,
    subLine2.geometry.drawRange,
    subLine3.geometry.drawRange,
    subLine4.geometry.drawRange,
    subLine5.geometry.drawRange,
    subLine6.geometry.drawRange,
    subLine7.geometry.drawRange,
    subLine8.geometry.drawRange,
  
  ], { count: 5, scrollTrigger: {
    trigger: ".about",
    start: window.innerHeight + window.innerHeight * 0.35,
    end: window.innerHeight * 1.5,
    scrub: 1,
    update: camera.updateProjectionMatrix(),
    }});

  



// Scroll dependent active class for navigation items
document.addEventListener('scroll', (e)=> {

    if((window.scrollY / window.innerHeight) === 0) {
      if(!(home.classList.contains("active"))){
        

        for(let i = 0; i < container.length; i++)  {
            if(container[i].classList.contains("active")){
               container[i].classList.remove("active");
                break;
              }
        }
        home.classList.add("active");
      }
      return;
    }
    
    else if((window.scrollY / window.innerHeight) >= 0.975 && (window.scrollY / window.innerHeight) <= 1.025 || (window.scrollY / window.innerHeight) === 1) {

      if(!(about.classList.contains("active"))){
        for(let i = 0; i < container.length; i++)  {
            if(container[i].classList.contains("active")) {
              container[i].classList.remove("active");
              break;
            } 
        }
        about.classList.add("active");
      }
      return;
    }

    if((window.scrollY / window.innerHeight) >= 1.975 && (window.scrollY / window.innerHeight) <= 2.025 || (window.scrollY / window.innerHeight) === 2) {
      if(!(services.classList.contains("active"))){

        for(let i = 0; i < container.length; i++)  {
            if(container[i].classList.contains("active")){
               container[i].classList.remove("active");
               break;
              }
        }
          services.classList.add("active");
      }
    
          return;
    }

    else if((window.scrollY / window.innerHeight) >= 4.475 && (window.scrollY / window.innerHeight) <= 4.525 || (window.scrollY / window.innerHeight) === 3) {
      if(!(project.classList.contains("active"))){
      
      
        for(let i = 0; i < container.length; i++)  {
            if(container[i].classList.contains("active")){
              container[i].classList.remove("active");
              break;
            }
        }
          project.classList.add("active");
      }
      return;
    }

    else if((window.scrollY / window.innerHeight) >= 9.075 && (window.scrollY / window.innerHeight) <= 9.525 || (window.scrollY / window.innerHeight) === 4) {
      if(!(contact.classList.contains("active"))){
           

        for(let i = 0; i < container.length; i++)  {

            if(container[i].classList.contains("active")){
              container[i].classList.remove("active");
              break;
            } 
        }
          contact.classList.add("active");
      }
      return;
    }

});

// on refresh check which section we are in

if((window.scrollY / window.innerHeight) === 0) {
  if(!(home.classList.contains("active"))){
    for(let i = 0; i < container.length; i++)  {
        if(container[i].classList.contains("active")){
           container[i].classList.remove("active");
            break;
          }
    }
    home.classList.add("active");
  }
}

else if((window.scrollY / window.innerHeight) >= 0.9 && (window.scrollY / window.innerHeight) <= 1.1 || (window.scrollY / window.innerHeight) === 1) {
  if(!(about.classList.contains("active"))){
    for(let i = 0; i < container.length; i++)  {
        if(container[i].classList.contains("active")) {
          container[i].classList.remove("active");
          break;
        } 
    }
    about.classList.add("active");
  }
}

else if((window.scrollY / window.innerHeight) >= 1.9 && (window.scrollY / window.innerHeight) <= 2.1 || (window.scrollY / window.innerHeight) === 2) {
  if(!(services.classList.contains("active"))){
    for(let i = 0; i < container.length; i++)  {
        if(container[i].classList.contains("active")){
           container[i].classList.remove("active");
           break;
          }
    }
      services.classList.add("active");
  }
}

else if((window.scrollY / window.innerHeight) >= 2.9 && (window.scrollY / window.innerHeight) <= 3.1 || (window.scrollY / window.innerHeight) === 3) {
  if(!(project.classList.contains("active"))){
    for(let i = 0; i < container.length; i++)  {
        if(container[i].classList.contains("active")){
          container[i].classList.remove("active");
          break;
        }
    }
      project.classList.add("active");
  }
}

else if((window.scrollY / window.innerHeight) >= 5.9 && (window.scrollY / window.innerHeight) <= 6.1 || (window.scrollY / window.innerHeight) === 4) {
  if(!(contact.classList.contains("active"))){
    for(let i = 0; i < container.length; i++)  {
        if(container[i].classList.contains("active")){
          container[i].classList.remove("active");
          break;
        } 
    }
      contact.classList.add("active");
  }

  
}




let textHolders = document.querySelectorAll('.textHolder');
let ecoContainers = document.querySelectorAll('.ecoContainer');

for(let i = 0; i < textHolders.length; i++) {
  
  let ecoCounter = 2;
    ecoContainers[i].addEventListener('click', (e)=> {
      
        if(ecoCounter % 2 == 0) gsap.to(textHolders[i], { 'clip-path': 'circle(100%)', duration: 0.75, ease: Sine});
        else gsap.to(textHolders[i], { 'clip-path': 'circle(0%)', duration: 0.75, ease: Sine});
        ecoCounter+=1;
        
    });
}


/* ECOSYSTEM ANIMATION */
const leftLayer = document.querySelector('#leftEco');
const rightLayer = document.querySelector('#rightEco');





/* TOKEN SECTION */



/* TOKEN ANIMATION */

let utilityContainer = document.querySelector('#utilityContainer');
let tokens = document.querySelectorAll('.tokenContainer');


scene_anim.to(['#utilityContainer', '.tokenContainer', '#utility'], { top: 2, scrollTrigger: {
  trigger: ".services",
  start: window.innerHeight * 2,
  end: window.innerHeight * 2.5,
  scrub: 1,
  }});




/* MARKETPLACE SECTION */



}