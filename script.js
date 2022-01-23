import * as THREE from "./three.js-r134-min/build/three.module.js";
import { TrackballControls } from './three.js-r134-min/examples/jsm/controls/TrackballControls.js';
import { GLTFLoader } from './three.js-r134-min/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from './three.js-r134-min/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './three.js-r134-min/examples/jsm/postprocessing/RenderPass.js';
import { SavePass } from './three.js-r134-min/examples/jsm/postprocessing/SavePass.js';
import { ShaderPass } from './three.js-r134-min/examples/jsm/postprocessing/ShaderPass.js';
import { GlitchPass } from './three.js-r134-min/examples/jsm/postprocessing/GlitchPass.js';
import { BloomPass } from './three.js-r134-min/examples/jsm/postprocessing/BloomPass.js';
import { CopyShader } from './three.js-r134-min/examples/jsm/shaders/CopyShader.js';
import { BlendShader } from './three.js-r134-min/examples/jsm/shaders/BlendShader.js';
import { UnrealBloomPass } from './three.js-r134-min/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ScrollTrigger } from "./gsap-public/esm/ScrollTrigger.js";

















/*     setting active class for nav  */

   const container = document.getElementsByClassName("li");
   /*
    for(var i = 0; i < container.length; i++){
        
            container[i].addEventListener("click", function(){

                for(var j = 0; j < container.length; j++){

                    if(container[j].classList.contains("active") &&  !(this.classList.contains("active"))){
                        container[j].classList.remove("active");
                        this.classList.add("active");
                    }
                }
            }); 
        }
  */
    const logo = document.querySelector('#logo');
    const home = document.querySelector('#homeLink');
    const about = document.querySelector('#aboutLink');
    const services = document.querySelector('#servicesLink');
    const project = document.querySelector('#projectLink');
    const contact = document.querySelector('#contactLink');
   
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
        }, 1000, function(){
  
          // Add hash (#) to URL when done scrolling (default click behavior)
          window.location.hash = hash;
        });
      } // End if
    });
  });


  
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

  
  /** ThreeJs */
  var renderer,  camera, HEIGHT, WIDTH, aspectRatio, tl4, controls, composer;
  var scene = null;
  var canvReference = null;
  var cameraCenter = new THREE.Vector3();
  var cameraHorzLimit = 0.05;
  var cameraVertLimit = 0.05;
  var mouse = new THREE.Vector2();
  var scene_anim;
  var subLine1, subLine2, subLine3, subLine4, subLine5, subLine6, subLine7, subLine8, mainLine1;


  gsap.registerPlugin(ScrollTrigger);
  init();
  animate();
  

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    cameraCenter.x = camera.position.x;
    cameraCenter.y = camera.position.y;
    
    // Select the canvas from the document
    canvReference = document.getElementById("webgl");
  
    // Then pass it to the renderer constructor
      renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvReference
      
  });
 // controls = new TrackballControls(camera, renderer.domElement);
  //controls.rotateSpeed = 5.0;
  //controls.panSpeed = 1.0;
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor(0x00061f, 1);
  
  //document.body.appendChild( renderer.domElement );

  // Objects

  const particlesGeometry = new THREE.BufferGeometry();
  const particlesGeometryLower = new THREE.BufferGeometry();
  const particlesGeometryLowerLower = new THREE.BufferGeometry();
  const particlesCnt = 1000;

  const posArray = new Float32Array(particlesCnt * 3);
  const posArrayLower = new Float32Array(particlesCnt * 3);
  const posArrayLowerLower = new Float32Array(particlesCnt * 3);

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
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeometryLower.setAttribute('position', new THREE.BufferAttribute(posArrayLower, 3));
  particlesGeometryLowerLower.setAttribute('position', new THREE.BufferAttribute(posArrayLowerLower, 3));

  // Materials
  //const particlematerial = new THREE.MeshBasicMaterial( {  color:  0x00ecff00, wireframe: true } );
  const texture = new THREE.TextureLoader().load('./src/ice.png');
  const textureAlpha = new THREE.TextureLoader().load('./src/alpha.png');
  const particlesMaterial = new THREE.PointsMaterial({size: 0.25, map: texture, alphaMap: textureAlpha, alphaTest: 0.25, transparent: false});
  
  // Mesh
 // const cube = new THREE.Points( geometry, tmaterial );
 
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  
  const particlesMeshLower = new THREE.Points(particlesGeometryLower, particlesMaterial);
  const particlesMeshLowerLower = new THREE.Points(particlesGeometryLowerLower, particlesMaterial);
  

  // Cube Object 
  const loader = new GLTFLoader();
  

  loader.load("./src/new.glb", (gltf) => {

        

        gltf.scene.position.set(1, -1.8, 0);
        // y -1.8
        gltf.scene.children[0].rotation.set(Math.PI * 0.125, 0, 0);
        gltf.scene.children[1].rotation.set(Math.PI * 0.125, 0, 0);
        gltf.scene.children[2].rotation.set(Math.PI * 0.125, 0, 0);
        
        setInterval(()=> {
          gsap.to(gltf.scene.children[0].rotation, { y: "+=0.075", ease:Linear.easeNone });
          gsap.to(gltf.scene.children[1].rotation, { y: "+=0.075", ease:Linear.easeNone });
          gsap.to(gltf.scene.children[2].rotation, { y: "+=0.075", ease:Linear.easeNone });
        }, 100); //  x: "+=0.075"
        
        
        scene_anim = gsap.timeline();
        
        scene_anim.to([gltf.scene.children[0].position, gltf.scene.children[1].position, gltf.scene.children[2].position], { y: "-=4.75", x: "-=1", z: "-=12", scrollTrigger: {
          // , gltf.scene.children[1].position, gltf.scene.children[2].position
        trigger: ".about",
        scrub: 1,
        start: "top bottom",
        end: "top top",
        update: camera.updateProjectionMatrix(),
        }});
        
        scene.add( gltf.scene );

  }, undefined, function ( error ) {

    console.error( error );

    });

    // LINES

    // main curve one
    
  const curve1 = new THREE.SplineCurve( [
	new THREE.Vector2( 1, 0 ),
	new THREE.Vector2( -2.5, -2 ),
	new THREE.Vector2( 0, -3 ),
	new THREE.Vector2( 0, -4 )
] );

const points1 = curve1.getPoints( 1000 );
const geometry = new THREE.BufferGeometry().setFromPoints( points1 );
geometry.drawRange.start = 0;
geometry.drawRange.count = 0;
const material1 = new THREE.LineDashedMaterial( { color : 0xffffff, linewidth: 10.0 } );
const material2 = new THREE.LineDashedMaterial( { color : 0xffffff, linewidth: 10.0 } );
const material3 = new THREE.LineDashedMaterial( { color : 0xffffff, linewidth: 10.0 } );
const material4 = new THREE.LineDashedMaterial( { color : 0xffffff, linewidth: 10.0 } );
const material5= new THREE.LineDashedMaterial( { color : 0xffffff, linewidth: 10.0 } );
const material6 = new THREE.LineDashedMaterial( { color : 0xffffff, linewidth: 10.0 } );
const material7 = new THREE.LineDashedMaterial( { color : 0xffffff, linewidth: 10.0 } );
const material8 = new THREE.LineDashedMaterial( { color : 0xffffff, linewidth: 10.0 } );
const materialLightBlue = new THREE.LineDashedMaterial( { color : 0x00ffff, linewidth: 1.0 } );
 mainLine1 = new THREE.Line( geometry, material1 );
//scene.add(mainLine1);


    // LEFT
// sub curve left, first from top

const curveSub1 = new THREE.SplineCurve( [
  new THREE.Vector2( -0.3, -4.1 ),
  new THREE.Vector2( -1.5, -3.3 ),
  new THREE.Vector2( -2.5, -3.4),
  new THREE.Vector2( -3.5, -3.2 )
] );

const pointsSub1 = curveSub1.getPoints( 1000 );
const geometrySub1 = new THREE.BufferGeometry().setFromPoints( pointsSub1 );
geometrySub1.drawRange.start = 0;
geometrySub1.drawRange.count = 0;
 subLine1 = new THREE.Line( geometrySub1, material1 );
scene.add(subLine1);

// sub curve left, second from top

const curveSub2 = new THREE.SplineCurve( [
  new THREE.Vector2( -0.4, -4.25 ),
  new THREE.Vector2( -1, -4.25 ),
  new THREE.Vector2( -2, -3.95 ),
  new THREE.Vector2( -3.5, -4.15 )
] );

const pointsSub2 = curveSub2.getPoints( 1000 );
const geometrySub2 = new THREE.BufferGeometry().setFromPoints( pointsSub2 );
geometrySub2.drawRange.start = 0;
geometrySub2.drawRange.count = 0;
 subLine2 = new THREE.Line( geometrySub2, material2 );

scene.add(subLine2);

// sub curve left, third from top

const curveSub3 = new THREE.SplineCurve( [
  new THREE.Vector2( -0.4, -4.45 ),
  new THREE.Vector2( -1, -4.6 ),
  new THREE.Vector2( -2, -5.25 ),
  new THREE.Vector2( -3.5, -5.2 )
] );

const pointsSub3 = curveSub3.getPoints( 1000 );
const geometrySub3 = new THREE.BufferGeometry().setFromPoints( pointsSub3 );
geometrySub3.drawRange.start = 0;
geometrySub3.drawRange.count = 0;
 subLine3 = new THREE.Line( geometrySub3, material3 );

scene.add(subLine3);

// sub curve left, fourth from top

const curveSub4 = new THREE.SplineCurve( [
  new THREE.Vector2( -0.3, -4.8 ),
  new THREE.Vector2( -1.25, -5.6 ),
  new THREE.Vector2( -2.5, -5.8 ),
  new THREE.Vector2( -3.5, -6.4 )
] );

const pointsSub4 = curveSub4.getPoints( 1000 );
const geometrySub4 = new THREE.BufferGeometry().setFromPoints( pointsSub4 );
geometrySub4.drawRange.start = 0;
geometrySub4.drawRange.count = 0;
 subLine4 = new THREE.Line( geometrySub4, material4 );

scene.add(subLine4);

  // RIGHT

  // sub curve rightLayer, first from top

const curveSub5 = new THREE.SplineCurve( [
  new THREE.Vector2( 0.3, -4.1 ),
  new THREE.Vector2( 1.5, -3.3 ),
  new THREE.Vector2( 2.5, -3.4),
  new THREE.Vector2( 3.5, -3.2 )
] );

const pointsSub5 = curveSub5.getPoints( 1000 );
const geometrySub5 = new THREE.BufferGeometry().setFromPoints( pointsSub5 );
geometrySub5.drawRange.start = 0;
geometrySub5.drawRange.count = 0;
 subLine5 = new THREE.Line( geometrySub5, material5 );


scene.add(subLine5);

// sub curve rightLayer, second from top

const curveSub6 = new THREE.SplineCurve( [
  new THREE.Vector2( 0.4, -4.25 ),
  new THREE.Vector2( 1, -4.25 ),
  new THREE.Vector2( 2, -3.95 ),
  new THREE.Vector2( 3.5, -4.15 )
] );

const pointsSub6 = curveSub6.getPoints( 1000 );
const geometrySub6 = new THREE.BufferGeometry().setFromPoints( pointsSub6 );
geometrySub6.drawRange.start = 0;
geometrySub6.drawRange.count = 0;
 subLine6 = new THREE.Line( geometrySub6, material6 );

scene.add(subLine6);

// sub curve rightLayer, third from top

const curveSub7 = new THREE.SplineCurve( [
  new THREE.Vector2( 0.4, -4.45 ),
  new THREE.Vector2( 1, -4.6 ),
  new THREE.Vector2( 2, -5.25 ),
  new THREE.Vector2( 3.5, -5.2 )
] );

const pointsSub7 = curveSub7.getPoints( 1000 );
const geometrySub7 = new THREE.BufferGeometry().setFromPoints( pointsSub7 );
geometrySub7.drawRange.start = 0;
geometrySub7.drawRange.count = 0;
 subLine7 = new THREE.Line( geometrySub7, material7 );

scene.add(subLine7);

// sub curve rightLayer, fourth from top

const curveSub8 = new THREE.SplineCurve( [
  new THREE.Vector2( 0.3, -4.8 ),
  new THREE.Vector2( 1.25, -5.6 ),
  new THREE.Vector2( 2.5, -5.8 ),
  new THREE.Vector2( 3.5, -6.4 )
] );

const pointsSub8 = curveSub8.getPoints( 1000 );
const geometrySub8 = new THREE.BufferGeometry().setFromPoints( pointsSub8 );
geometrySub8.drawRange.start = 0;
geometrySub8.drawRange.count = 0;
 subLine8 = new THREE.Line( geometrySub8, material8 );


scene.add(subLine8);


// event listener for ecosystem elements

const ecosystem = document.querySelector('#ecoContainers1');
const ecosystem2 = document.querySelector('#ecoContainers2');
console.log(ecosystem2)
for(let i = 0; i < ecosystem.children.length * 2; i++) {

    if(i === 0) {
      ecosystem.children[0].addEventListener('mouseenter', (e)=> {
          gsap.to(subLine1.material.color, { r: 0, duration: 1, ease: Sine });
          subLine1.material.needsUpdate = true;
      })
      ecosystem.children[0].addEventListener('mouseleave', (e)=> {
        gsap.to(subLine1.material.color, { r: 1, g: 1, b: 1, duration: 1, ease: Sine });
        subLine1.material.needsUpdate = true;
    })
    }

    if(i === 1) {
      ecosystem.children[1].addEventListener('mouseenter', (e)=> {
          gsap.to(subLine2.material.color, { r: 0, duration: 1, ease: Sine });
          subLine2.material.needsUpdate = true;
      })
      ecosystem.children[1].addEventListener('mouseleave', (e)=> {
        gsap.to(subLine2.material.color, { r: 1, g: 1, b: 1, duration: 1, ease: Sine });
        subLine2.material.needsUpdate = true;
    })
    }

    if(i === 2) {
      ecosystem.children[2].addEventListener('mouseenter', (e)=> {
          gsap.to(subLine3.material.color, { r: 0, duration: 1, ease: Sine });
          subLine3.material.needsUpdate = true;
      })
      ecosystem.children[2].addEventListener('mouseleave', (e)=> {
        gsap.to(subLine3.material.color, { r: 1, g: 1, b: 1, duration: 1, ease: Sine });
        subLine3.material.needsUpdate = true;
    })
    }

    if(i === 3) {
      ecosystem.children[3].addEventListener('mouseenter', (e)=> {
          gsap.to(subLine4.material.color, { r: 0, duration: 1, ease: Sine });
          subLine4.material.needsUpdate = true;
      })
      ecosystem.children[3].addEventListener('mouseleave', (e)=> {
        gsap.to(subLine4.material.color, { r: 1, g: 1, b: 1, duration: 1, ease: Sine });
        subLine4.material.needsUpdate = true;
    })
    }

    if(i === 4) {
      ecosystem2.children[0].addEventListener('mouseenter', (e)=> {
          gsap.to(subLine5.material.color, { r: 0, duration: 1, ease: Sine });
          subLine5.material.needsUpdate = true;
      })
      ecosystem2.children[0].addEventListener('mouseleave', (e)=> {
        gsap.to(subLine5.material.color, { r: 1, g: 1, b: 1, duration: 1, ease: Sine });
        subLine5.material.needsUpdate = true;
    })
    }

    if(i === 5) {
      ecosystem2.children[1].addEventListener('mouseenter', (e)=> {
          gsap.to(subLine6.material.color, { r: 0, duration: 1, ease: Sine });
          subLine6.material.needsUpdate = true;
      })
      ecosystem2.children[1].addEventListener('mouseleave', (e)=> {
        gsap.to(subLine6.material.color, { r: 1, g: 1, b: 1, duration: 1, ease: Sine });
        subLine6.material.needsUpdate = true;
    })
    }

    if(i === 6) {
      ecosystem2.children[2].addEventListener('mouseenter', (e)=> {
          gsap.to(subLine7.material.color, { r: 0, duration: 1, ease: Sine });
          subLine7.material.needsUpdate = true;
      })
      ecosystem2.children[2].addEventListener('mouseleave', (e)=> {
        gsap.to(subLine7.material.color, { r: 1, g: 1, b: 1, duration: 1, ease: Sine });
        subLine7.material.needsUpdate = true;
    })
    }

    if(i === 7) {
      ecosystem2.children[3].addEventListener('mouseenter', (e)=> {
          gsap.to(subLine8.material.color, { r: 0, duration: 1, ease: Sine });
          subLine8.material.needsUpdate = true;
      })
      ecosystem2.children[3].addEventListener('mouseleave', (e)=> {
        gsap.to(subLine8.material.color, { r: 1, g: 1, b: 1, duration: 1, ease: Sine });
        subLine8.material.needsUpdate = true;
    })
    }


}
 


  // LIGHTS
    
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 50);
    scene.add( ambientLight );


    
   // PARTICLES ANIMATION
   /*
   function updateArray () {
    particlesMesh.geometry.attributes.position.needsUpdate = true;
}

for(let i = 0; i < particlesMesh.geometry.attributes.position.array.length; i+=3) {

  const x = particlesMesh.geometry.attributes.position.array[i];
  const y = particlesMesh.geometry.attributes.position.array[i+1];
  const z = particlesMesh.geometry.attributes.position.array[i+2];

  newParticlePosArray[i] = 0 + (Math.random() - 0.5) * 7.5;
  newParticlePosArray[i+1] = y;
  newParticlePosArray[i+2] = z;

}

  gsap.to([
    particlesMesh.geometry.attributes.position.array, 
],  {
    endArray: newParticlePosArray,
    //3
    duration: 10,
    ease: Linear.easeNone,
    // Make sure to tell it to update
    onUpdate: updateArray,

  });
  */
/*
  setInterval(()=> {
    
  for(let i = 0; i < particlesMesh.geometry.attributes.position.array.length; i+=3) {

    const x = particlesMesh.geometry.attributes.position.array[i];
    const y = particlesMesh.geometry.attributes.position.array[i+1];
    const z = particlesMesh.geometry.attributes.position.array[i+2];

    newParticlePosArray[i] = x;
    newParticlePosArray[i+1] = 0 + (Math.random() - 0.5) * 3.25;
    newParticlePosArray[i+2] = z;

}

    tl4 = new gsap.timeline();
 
    tl4.to([
        particlesMesh.geometry.attributes.position.array, 
    ],  {
        endArray: newParticlePosArray,
        //3
        duration: 10,
        ease: Sine,
        // Make sure to tell it to update
        onUpdate: updateArray,

      });

      
      


  }, 10000);
*/


  // Rotate animation
  camera.position.z = 4;

  // scene.add
   scene.add( particlesMesh );
   scene.add( particlesMeshLower );
   scene.add( particlesMeshLowerLower );
  
  gsap.to([particlesMesh.material, particlesMeshLower.material,particlesMeshLowerLower.material,], {size: 0.015, duration: 10, ease: Sine});
  // EFFECT COMPOSER + BLOOM EFFECT
  composer = new EffectComposer( renderer );
  const renderPass = new RenderPass( scene, camera );
  composer.addPass( renderPass );


  var unRealBloomPass = new UnrealBloomPass({ x: 1920, y: 1080}, 0.75, 0, 0.1);

  var glitchPass = new GlitchPass();
    composer.addPass( renderPass );
    composer.addPass( unRealBloomPass );
    
    // composer.addPass( glitchPass );
  /*
	setInterval(()=> {
      if(unRealBloomPass.radius != 1) gsap.to(unRealBloomPass, { radius: 1, strength: 1.15, duration: 3, ease: Sine});
      else gsap.to(unRealBloomPass, { radius: 0.5, strength: 0.1, duration: 3, ease: Sine});
      
  }, 5000);
*/
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
   // console.log( 'WIDTH=' + WIDTH + '; HEIGHT=' + HEIGHT );
    renderer.setSize( WIDTH, HEIGHT );
    composer.setSize( WIDTH, HEIGHT );
    aspectRatio = WIDTH / HEIGHT;
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();

    //render();
   // composer.render();
}
  
 


  function animate() {

    updateCamera();
    requestAnimationFrame(animate);
   // controls.update();
    composer.render();
     //render();
  }

  function render() {
    renderer.render( scene, camera );
}

/*
var mouse = {
  x: null,
  y : null
};
// event listeners
var starterPos = {
    x: camera.position.x,
    y: camera.position.y
};
canvReference.addEventListener('mousemove', (e)=> {
  if(e.clientX < mouse.x && (starterPos.x + 1) > camera.position.x) gsap.to(camera.position, {x: "+=0.01", ease: Sine});
  if(e.clientX > mouse.x && (starterPos.x - 1) < camera.position.x) gsap.to(camera.position, {x: "-=0.01", ease: Sine});
  if(e.clientY < mouse.y && (starterPos.y - 1) > camera.position.y) gsap.to(camera.position, {y: "-=0.01", ease: Sine});
  if(e.clientY > mouse.y && (starterPos.y + 1) > camera.position.y) gsap.to(camera.position, {y: "+=0.01", ease: Sine});
  console.log(e.clientY);
  console.log(mouse.y);
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  
});

*/

/*
var landingText = document.querySelector('.landingText');
var homeLayer = document.querySelector('.homeLayer');
landingText.addEventListener('mouseenter', ()=> {
    gsap.to(homeLayer, { width: 0, duration: 0.4, ease: Sine });
});
landingText.addEventListener('mouseleave', ()=> {
  gsap.to(homeLayer, { width: "100%", duration: 0.4, ease: Sine });
});
*/

var videoButton = document.querySelector('#videoButton');
var videoContainer = document.querySelector('#videoContainer');
var video = document.querySelector('#video');

video.volume = 0.05;

videoButton.addEventListener('click', (e) => {
      gsap.to(videoContainer, { 'clip-path': 'circle(100%)', duration: 0.75, ease: Sine})
      video.play();
      
});

document.addEventListener('keydown', (e) => {
    if(e.key === "Escape" && videoContainer.style.clipPath != "circle(0% at center center)") {
        video.pause();
        gsap.to(videoContainer, { 'clip-path': 'circle(0%)', duration: 0.75, ease: Sine});
    }
});

$(videoContainer).on('click', function(e) {
  if (e.target !== this) return;

  video.pause();
  gsap.to(videoContainer, { 'clip-path': 'circle(0%)', duration: 0.75, ease: Sine});
});

 // ScrollTrigger animations
 
 ScrollTrigger.defaults({
  immediateRender: false,
  ease: "power1.inOut",
  scrub: true,
  scrub: 1,
});

scene_anim = gsap.timeline();

scene_anim.to([camera.position, cameraCenter], { y: "-=12", scrollTrigger: {

trigger: ".about",
start: "top bottom",
end: window.innerHeight * 5,
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

], { count: 1000, scrollTrigger: {
  trigger: ".about",
  start: "top center",
  end: "center center",
  update: camera.updateProjectionMatrix(),
  }});
/*
scene_anim.to( mainLine1.geometry.drawRange , { count: 1000, scrollTrigger: {
    trigger: ".home",
    start: 0,
    end: window.innerHeight,
    update: camera.updateProjectionMatrix(),
    }});
*/
 
const leftLayer = document.querySelector('#leftEco');
const rightLayer = document.querySelector('#rightEco');




// Scroll dependent active class for navigation items
document.addEventListener('scroll', (e)=> {
  

    if((window.scrollY / window.innerHeight) === 0) {
      if(!(home.classList.contains("active"))){
        gsap.to(leftLayer, { "left": "-50%", duration: 1, ease: Sine});
        gsap.to(rightLayer, { "right": "-50%", duration: 1, ease: Sine});
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
    
    else if((window.scrollY / window.innerHeight) >= 0.9 && (window.scrollY / window.innerHeight) <= 1.1 || (window.scrollY / window.innerHeight) === 1) {
      /*
      gsap.to([ subLine1.geometry.drawRange,
                subLine2.geometry.drawRange,
                subLine3.geometry.drawRange,
                subLine4.geometry.drawRange,
                subLine5.geometry.drawRange,
                subLine6.geometry.drawRange,
                subLine7.geometry.drawRange,
                subLine8.geometry.drawRange,
              
      ], { count: 1000, duration: 2, delay: 0, ease: Sine});
      */
     gsap.to(leftLayer, { "left": "2%", duration: 1, ease: Sine});
     gsap.to(rightLayer, { "right": "2%", duration: 1, ease: Sine});

      
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

    if((window.scrollY / window.innerHeight) >= 1.9 && (window.scrollY / window.innerHeight) <= 2.1 || (window.scrollY / window.innerHeight) === 2) {
      if(!(services.classList.contains("active"))){
        gsap.to(leftLayer, { "left": "-50%", duration: 1, ease: Sine});
        gsap.to(rightLayer, { "right": "-50%", duration: 1, ease: Sine});
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
      return;
    }

    else if((window.scrollY / window.innerHeight) >= 3.9 && (window.scrollY / window.innerHeight) <= 4.1 || (window.scrollY / window.innerHeight) === 4) {
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

else if((window.scrollY / window.innerHeight) >= 3.9 && (window.scrollY / window.innerHeight) <= 4.1 || (window.scrollY / window.innerHeight) === 4) {
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

