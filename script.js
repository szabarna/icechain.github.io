import * as THREE from "./three.js-r134-min/build/three.module.js";
import { TrackballControls } from './three.js-r134-min/examples/jsm/controls/TrackballControls.js';
import { GLTFLoader } from './three.js-r134-min/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from './three.js-r134-min/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from './three.js-r134-min/examples/jsm/geometries/TextGeometry.js';
import { EffectComposer } from './three.js-r134-min/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './three.js-r134-min/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from './three.js-r134-min/examples/jsm/postprocessing/GlitchPass.js';
import { UnrealBloomPass } from './three.js-r134-min/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ScrollTrigger } from "./gsap-public/esm/ScrollTrigger.js";
import  Stats  from './three.js-r134-min/examples/jsm/libs/stats.module.js';





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
        }, 800, function(){
  
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
  var circle1, circle2, circle3, circle4, circle5, circle6, circle7, circle8;
  var leftCube1, leftCube2, leftCube3, leftCube4, leftCube5;
  var rightCube1, rightCube2, rightCube3, rightCube4, rightCube5;
  var leftText1, leftText2, leftText3, leftText4, leftText5;
  var leftSubText1, leftSubText2, leftSubText3, leftSubText4, leftSubText5;
  var rightText1, rightText2, rightText3, rightText4, rightText5;
  var rightSubText1, rightSubText2, rightSubText3, rightSubText4, rightSubText5;
  var leftLine1, leftLine2, leftLine3, leftLine4, leftLine5;
  var rightLine1, rightLine2, rightLine3, rightLine4, rightLine5;
  var leftMainCube, rightMainCube;
  var leftMainText, rightMainText;
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
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100 );
    camera.position.z = 4;
    cameraCenter.x = camera.position.x;
    cameraCenter.y = camera.position.y;
    
    // Select the canvas from the document
    canvReference = document.getElementById("webgl");
  
    // Then pass it to the renderer constructor
      renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
      canvas: canvReference
      
  });
 // controls = new TrackballControls(camera, renderer.domElement);
  //controls.rotateSpeed = 5.0;
  //controls.panSpeed = 1.0;
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio( 2 );
  renderer.setClearColor(0x00061f, 1);
  
  //document.body.appendChild( renderer.domElement );


  addStatsObject();

  // Objects
  

  const particlesGeometry = new THREE.BufferGeometry();
  const particlesGeometryLower = new THREE.BufferGeometry();
  const particlesGeometryLowerLower = new THREE.BufferGeometry();
  const particlesCnt = 150;

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


    // LEFT CIRCLE
  //  CIRCLE OUTER

  const circleMaterial = new THREE.MeshBasicMaterial( { color : 0x0000ff  } );
  const circleGeometry1 = new THREE.TorusGeometry(10, 0.1, 2, 24);

  circle1 = new THREE.Mesh(circleGeometry1, circleMaterial);
  scene.add(circle1);
  circle1.position.set(-2.5, -9.25, 0);
  circle1.scale.set(0.1, 0.1, 0.1);
  circle1.material.transparent = true;
  circle1.material.opacity = 0.1;

   // CIRCLE OUTER 3rd
   const circleGeometry2 = new THREE.TorusGeometry(10, 0.1, 2, 24);
   
    circle2 = new THREE.Mesh(circleGeometry2, circleMaterial);
    scene.add(circle2);
   circle2.position.set(-2.5, -9.25, 0);
   circle2.scale.set(0.05, 0.05, 0.05);
   circle2.material.transparent = true;
   circle2.material.opacity = 0.1;

   // CIRCLE OUTER 4th
   const circleGeometry3 = new THREE.TorusGeometry(10, 0.1, 2, 24);
   
    circle3 = new THREE.Mesh(circleGeometry3, circleMaterial);
  //  scene.add(circle3);
   circle3.position.set(-2.5, -9.25, 0);
   circle3.scale.set(0.025, 0.025, 0.025);
   circle3.material.transparent = true;
   circle3.material.opacity = 0.1;

    // CIRCLE OUTER 2nd
    const circleGeometry4 = new THREE.TorusGeometry(10, 0.1, 2, 24);
  
    circle4 = new THREE.Mesh(circleGeometry4, circleMaterial);
    scene.add(circle4);
    circle4.position.set(-2.5, -9.25, 0);
    circle4.scale.set(0.075, 0.075, 0.075);
    circle4.material.transparent = true;
    circle4.material.opacity = 0.1;

    // RIGHT CIRCLE
  //  CIRCLE OUTER
  const circleGeometry5 = new THREE.TorusGeometry(10, 0.1, 2, 24);

   circle5 = new THREE.Mesh(circleGeometry5, circleMaterial);
   scene.add(circle5);
  circle5.position.set(2.5, -9.25, 0);
  circle5.scale.set(0.1, 0.1, 0.1);
  circle5.material.transparent = true;
  circle5.material.opacity = 0.1;

   // CIRCLE OUTER 3rd
   const circleGeometry6 = new THREE.TorusGeometry(10, 0.1, 2, 24);
  
    circle6 = new THREE.Mesh(circleGeometry6, circleMaterial);
    scene.add(circle6);
   circle6.position.set(2.5, -9.25, 0);
   circle6.scale.set(0.05, 0.05, 0.05);
   circle6.material.transparent = true;
   circle6.material.opacity = 0.1;

   // CIRCLE OUTER 4th
   const circleGeometry7 = new THREE.TorusGeometry(10, 0.1, 2, 24);
  
    circle7 = new THREE.Mesh(circleGeometry7, circleMaterial);
   //  scene.add(circle7);
   circle7.position.set(2.5, -9.25, 0);
   circle7.scale.set(0.025, 0.025, 0.025);
   circle7.material.transparent = true;
   circle7.material.opacity = 0.1;

    // CIRCLE OUTER 2nd
    const circleGeometry8 = new THREE.TorusGeometry(10, 0.1, 2, 24);
  
    circle8 = new THREE.Mesh(circleGeometry8, circleMaterial);
    scene.add(circle8);
    circle8.position.set(2.5, -9.25, 0);
    circle8.scale.set(0.075, 0.075, 0.075);
    circle8.material.transparent = true;
    circle8.material.opacity = 0.1;

    //leftGroup.position.set(circle3.position);

    
  // Cube Object 
  const loader = new GLTFLoader();
  
  loader.load('./src/tokenCube.glb', (gltf) => {
    // LEFT
    // LEFT CUBE 1 DONE
    leftCube1 = gltf.scene.clone();
    leftCube1.position.set(6.9, -2.75, 0);
    leftCube1.scale.set(5.5, 5.5, 5.5);
    // 5.5
    leftCube1.children[0].rotation.set(0, 0, Math.PI * 0.25);
    leftCube1.children[1].rotation.set(0, 0, Math.PI * 0.25);
    
    //scene.add(leftCube1);
    circle1.add( leftCube1 );

    // LEFT CUBE 2 DONE
     leftCube2 = gltf.scene.clone();
     leftCube2.position.set(8.9, -9, 0);
     leftCube2.scale.set(2.5, 2.5, 2.5);
     //scene.add(leftCube2);
     circle1.add( leftCube2 );
     leftCube2.children[0].rotation.set(0, 0, Math.PI * 0.35);
     leftCube2.children[1].rotation.set(0, 0, Math.PI * 0.35);
    // LEFT CUBE 3 DONE
    leftCube3 = gltf.scene.clone();
    leftCube3.position.set(0, -15.35, 0);
    leftCube3.scale.set(3, 3, 3);
   // scene.add(leftCube3);
   circle1.add( leftCube3 );

     // LEFT CUBE 4 DONE
     leftCube4 = gltf.scene.clone();
     leftCube4.position.set(-6.5, 3, 0);
     leftCube4.scale.set(2.5, 2.5, 2.5);
    // scene.add(leftCube4);
    circle1.add( leftCube4 );
    leftCube4.children[0].rotation.set(0, 0, Math.PI * 0.25);
    leftCube4.children[1].rotation.set(0, 0, Math.PI * 0.25);
   
      // LEFT CUBE 5 DONE 
      leftCube5 = gltf.scene.clone();
      leftCube5.position.set(-8.9, -12, 0);
      leftCube5.scale.set(4, 4, 4);
      //scene.add(leftCube5);
      circle1.add( leftCube5 );
      leftCube5.children[0].rotation.set(0, 0, Math.PI * 0.175);
      leftCube5.children[1].rotation.set(0, 0, Math.PI * 0.175);

    

      // RIGHT

       // RIGHT CUBE 1 
    rightCube1 = gltf.scene.clone();
    rightCube1.position.set(6.9, -2.75, 0);
    rightCube1.scale.set(5.5, 5.5, 5.5);
    // 5.5
    rightCube1.children[0].rotation.set(0, 0, Math.PI * 0.25);
    rightCube1.children[1].rotation.set(0, 0, Math.PI * 0.25);
    
    //scene.add(rightCube1);
    circle5.add( rightCube1 );

    // RIGHT CUBE 2 
     rightCube2 = gltf.scene.clone();
     rightCube2.position.set(8.9, -9, 0);
     rightCube2.scale.set(2.5, 2.5, 2.5);
     //scene.add(rightCube2);
     circle5.add( rightCube2 );
     rightCube2.children[0].rotation.set(0, 0, Math.PI * 0.35);
     rightCube2.children[1].rotation.set(0, 0, Math.PI * 0.35);

    // RIGHT CUBE 3 
    rightCube3 = gltf.scene.clone();
    rightCube3.position.set(0, -15.35, 0);
    rightCube3.scale.set(3, 3, 3);
   // scene.add(rightCube3);
   circle5.add( rightCube3 );

     // RIGHT CUBE 4
     rightCube4 = gltf.scene.clone();
     rightCube4.position.set(-6.5, 3, 0);
     rightCube4.scale.set(2.5, 2.5, 2.5);
    // scene.add(rightCube4);
    circle5.add( rightCube4 );
    rightCube4.children[0].rotation.set(0, 0, Math.PI * 0.25);
    rightCube4.children[1].rotation.set(0, 0, Math.PI * 0.25);
   
      // RIGHT CUBE 5 
      rightCube5 = gltf.scene.clone();
      rightCube5.position.set(-8.9, -12, 0);
      rightCube5.scale.set(4, 4, 4);
      //scene.add(rightCube5);
      circle5.add( rightCube5 );
      rightCube5.children[0].rotation.set(0, 0, Math.PI * 0.175);
      rightCube5.children[1].rotation.set(0, 0, Math.PI * 0.175);

    


  }, undefined, function ( error ) {

    console.error( error );

    });

  

  const fontLoader = new FontLoader();
  
  fontLoader.load('./src/font.json', function (font) {

    // MATERIALS

    const whiteTextMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const blueTextMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });

    // LEFT 1 DONE
    const textGeometry1 = new TextGeometry( 'ICE Team', {
      font: font,
      size: .75,
		  height: 0.01,
      curveSegments: 2,
  
      
    } );

    leftText1 = new THREE.Mesh(textGeometry1, [ whiteTextMaterial, whiteTextMaterial ]);
    leftText1.position.set(-1, -14, 0);
    circle1.add( leftText1 );
    
    // LEFT 1 SUB DONE
    const textSubGeometry1 = new TextGeometry( '10%', {
      font: font,
      size: .75,
		  height: 0.01,
      curveSegments: 2,
   
    } );

    leftSubText1 = new THREE.Mesh(textSubGeometry1, [ blueTextMaterial, blueTextMaterial ]);

    leftSubText1.position.set(-1.25, -12.5, 0);
    circle1.add( leftSubText1 );

   

    // LEFT 2 DONE
    const textGeometry2 = new TextGeometry( 'Reserve', {
      font: font,
      size: .75,
		  height: 0.01,
      curveSegments: 2,
  
    } );

    leftText2 = new THREE.Mesh(textGeometry2, [ whiteTextMaterial, whiteTextMaterial ]);
    leftText2.position.set(-15, -7, 0);
    circle1.add( leftText2 );
    
    // LEFT 2 SUB DONE
    const textSubGeometry2 = new TextGeometry( '30%', {
      font: font,
      size: .75,
		  height: 0.01,
      curveSegments: 2,
    
    } );

    leftSubText2 = new THREE.Mesh(textSubGeometry2, [ blueTextMaterial, blueTextMaterial ]);

    leftSubText2.position.set(-13, -5.5, 0);

    circle1.add( leftSubText2 );

    // LEFT 3 DONE
    const textGeometry3 = new TextGeometry( 'Founders', {
      font: font,
      size: .75,
		  height: 0.01,
      curveSegments: 2,
   
    } );

    leftText3 = new THREE.Mesh(textGeometry3, [ whiteTextMaterial, whiteTextMaterial ]);

    leftText3.position.set(10.85, -7, 0);
    circle1.add( leftText3 );
    
    // LEFT 3 SUB DONE
    const textSubGeometry3 = new TextGeometry( '5%', {
      font: font,
      size: .75,
		  height: 0.01,
      curveSegments: 2,
  
    } );

    leftSubText3 = new THREE.Mesh(textSubGeometry3, [ blueTextMaterial, blueTextMaterial ]);

    leftSubText3.position.set(10.75, -5.5, 0);

    circle1.add( leftSubText3 );

    // LEFT 4 DONE
    const textGeometry4 = new TextGeometry( 'Pre-Sale & IEO', {
      font: font,
      size: .75,
		  height: 0.01,
      curveSegments: 2,
   
    } );

    leftText4 = new THREE.Mesh(textGeometry4, [ whiteTextMaterial, whiteTextMaterial ]);

    leftText4.position.set(9.25, 8, 0);
    circle1.add( leftText4 );
    
    // LEFT 4 SUB DONE
    const textSubGeometry4 = new TextGeometry( '50%', {
      font: font,
      size: .75,
		  height: 0.01,
      curveSegments: 2,
      
    } );

    leftSubText4 = new THREE.Mesh(textSubGeometry4, [ blueTextMaterial, blueTextMaterial ]);

    leftSubText4.position.set(9.1, 9.5, 0);

    circle1.add( leftSubText4 );

    // LEFT 5
    const textGeometry5 = new TextGeometry( 'Partners', {
      font: font,
      size: .75,
		  height: 0.01,
      curveSegments: 2,
    
    } );

    leftText5 = new THREE.Mesh(textGeometry5, [ whiteTextMaterial, whiteTextMaterial ]);

    leftText5.position.set(-12.5, 8, 0);
    circle1.add( leftText5 );
    
    // LEFT 5 SUB
    const textSubGeometry5 = new TextGeometry( '5%', {
      font: font,
      size: .75,
		  height: 0.01,
      curveSegments: 2,

    } );

    leftSubText5 = new THREE.Mesh(textSubGeometry5, [ blueTextMaterial, blueTextMaterial ]);

    leftSubText5.position.set(-10, 9.5, 0);

    circle1.add( leftSubText5 );

    // LEFT MAIN TEXT
    const leftMainTextGeometry = new TextGeometry( 'Token distribution', {
      font: font,
      size: .15,
		  height: 0.001,
      curveSegments: 2,
    } );

    leftMainText = new THREE.Mesh(leftMainTextGeometry, [ whiteTextMaterial, whiteTextMaterial ]);

    leftMainText.position.set(-3.3, -10, 0);
    console.log(leftMainText.material)
    scene.add( leftMainText );

    //    RIGHT 

     // RIGHT 1 
     const textGeometry6 = new TextGeometry( 'Business Development', {
      font: font,
      size: .75,
		  height: 0.01,
      curveSegments: 2,
     
    } );

    rightText1 = new THREE.Mesh(textGeometry6, [ whiteTextMaterial, whiteTextMaterial ]);

    rightText1.position.set(-0.75, -14, 0);
    circle5.add( rightText1 );
    
    // RIGHT 1 SUB 
    const textSubGeometry6 = new TextGeometry( '10%', {
      font: font,
      size: .75,
		  height: 0.01,
      curveSegments: 2,
  
    } );

    rightSubText1 = new THREE.Mesh(textSubGeometry6, [ blueTextMaterial, blueTextMaterial ]);

    rightSubText1.position.set(-1, -12.5, 0);
    circle5.add( rightSubText1 );

   

    // RIGHT 2 DONE
    const textGeometry7 = new TextGeometry( 'Sales & Marketing', {
      font: font,
      size: .75,
		  height: 0.01,
      curveSegments: 2,
 
    } );

    rightText2 = new THREE.Mesh(textGeometry7, [ whiteTextMaterial, whiteTextMaterial ]);

    rightText2.position.set(-19.5, -7, 0);
    circle5.add( rightText2 );
    
    // RIGHT 2 SUB 
    const textSubGeometry7 = new TextGeometry( '30%', {
      font: font,
      size: .75,
		  height: 0.01,
      curveSegments: 2,

    } );

    rightSubText2 = new THREE.Mesh(textSubGeometry7, [ blueTextMaterial, blueTextMaterial ]);

    rightSubText2.position.set(-13, -5.5, 0);

    circle5.add( rightSubText2 );

    // RIGHT 3 
    const textGeometry8 = new TextGeometry( 'Legal Compliance', {
      font: font,
      size: .75,
		  height: 0.01,
      curveSegments: 2,
  
    } );

    rightText3 = new THREE.Mesh(textGeometry8, [ whiteTextMaterial, whiteTextMaterial ]);

    rightText3.position.set(11.1, -7, 0);
    circle5.add( rightText3 );
    
    // RIGHT 3 SUB
    const textSubGeometry8 = new TextGeometry( '5%', {
      font: font,
      size: .75,
		  height: 0.01,
      curveSegments: 2,
  
    } );

    rightSubText3 = new THREE.Mesh(textSubGeometry8, [ blueTextMaterial, blueTextMaterial]);

    rightSubText3.position.set(11, -5.5, 0);

    circle5.add( rightSubText3 );

    // RIGHT 4 
    const textGeometry9 = new TextGeometry( 'IT Infrastructure', {
      font: font,
      size: 0.75,
		  height: 0.001,
      curveSegments: 2,
  
    } );

    rightText4 = new THREE.Mesh(textGeometry9, [ whiteTextMaterial, whiteTextMaterial ]);
    rightText4.position.set(10, 8, 0);
    circle5.add( rightText4 );
    
    // LEFT 4 SUB DONE
    const textSubGeometry9 = new TextGeometry( '50%', {
      font: font,
      size: 0.75,
		  height: 0.001,
      curveSegments: 2,
  
    } );
    
    rightSubText4 = new THREE.Mesh(textSubGeometry9, [ blueTextMaterial, blueTextMaterial ]);

    rightSubText4.position.set(9.9, 9.5, 0);
    circle5.add( rightSubText4 );

    // RIGHT 5
    const textGeometry10 = new TextGeometry( 'Operations', {
      font: font,
      size: .75,
		  height: 0.01,
      curveSegments: 2,

    } );

    rightText5 = new THREE.Mesh(textGeometry10, [ whiteTextMaterial, whiteTextMaterial]);

    rightText5.position.set(-13, 8, 0);
    circle5.add( rightText5 );
    
    // RIGHT 5 SUB
    const textSubGeometry10 = new TextGeometry( '5%', {
      font: font,
      size: .75,
		  height: 0.01,
      curveSegments: 2,
 
    } );

    rightSubText5 = new THREE.Mesh(textSubGeometry10, [ blueTextMaterial, blueTextMaterial ]);

    rightSubText5.position.set(-9.25, 9.5, 0);

    circle5.add( rightSubText5 );

    // RIGHT MAIN TEXT
    const rightMainTextGeometry = new TextGeometry( 'Use of Proceeds', {
      font: font,
      size: .15,
		  height: 0.001,
      curveSegments: 2,
 
    } );

    rightMainText = new THREE.Mesh(rightMainTextGeometry, [ whiteTextMaterial, whiteTextMaterial ]);

    rightMainText.position.set(1.75, -10, 0);

    scene.add( rightMainText );
    
    scene_anim.to([
      leftMainText.position,
      rightMainText.position,
      
    ], { y: -7.75, scrollTrigger: {
    trigger: ".services",
    start: window.innerHeight,
    end: window.innerHeight * 2,
    scrub: 1,
    update: camera.updateProjectionMatrix(),
    }});
    

  });
  
  

  loader.load("./src/new.glb", (gltf) => {

        mainCube = gltf.scene.clone();
        mainCube.position.set(1, -1.8, 0);
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
        rightMainCube = gltf.scene.clone();
        rightMainCube.position.set(0, -3.75, 0);
        rightMainCube.rotation.set(0, 0, 0);
        rightMainCube.scale.set(2, 2, 2);
        rightMainCube.children[0].material.transparent = true;
        rightMainCube.children[1].material.transparent = true;
        rightMainCube.children[2].material.transparent = true;
        // rightMainCube.children[0].material.opacity = 0;
        // rightMainCube.children[1].material.opacity = 0;
        circle5.add( rightMainCube );

           // LEFT MAIN CUBE
        leftMainCube = gltf.scene.clone();
        leftMainCube.position.set(0, -3.75, 0);
        leftMainCube.rotation.set(0, 0, 0);
        leftMainCube.scale.set(2, 2, 2);
        leftMainCube.children[0].material.transparent = true;
        leftMainCube.children[1].material.transparent = true;
        leftMainCube.children[2].material.transparent = true;
      //  leftMainCube.children[0].material.opacity = 0;
      //  leftMainCube.children[1].material.opacity = 0;
        circle1.add( leftMainCube );

        

        setInterval(()=> {
          if(mainCube.children[0].material.opacity != 0 && cubeRotation ) {
            gsap.to([
              mainCube.children[0].rotation,
              mainCube.children[1].rotation,
              mainCube.children[2].rotation],
            { y: "+=0.075", ease:Linear.easeNone });
            }
            /*
            if(window.pageYOffset === window.innerHeight * 2) {
              gsap.to(circle1.rotation, { z: "+=0.5", ease: Linear.easeNone})
              gsap.to(circle5.rotation, { z: "-=0.5", ease: Linear.easeNone})
          }
          */

        }, 100); //  x: "+=0.075"


        scene_anim.to([mainCube.children[0].position, mainCube.children[1].position, mainCube.children[2].position], { y: -3, x: "-=1", z: "-=12", scrollTrigger: {
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

    // LINES FOR TOKEN DETAILS

      // LEFT LINE 1
    const ecosystemMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 10.0 });
    const leftLineCurve1 = new THREE.LineCurve3(
      new THREE.Vector3( 0, 0, -0.5 ),
      new THREE.Vector3( 9, -4.5, -0.5 ),
    );

    const leftLinePoints1 = leftLineCurve1.getPoints( 1 );
    const geometryLeftLine1 = new THREE.BufferGeometry().setFromPoints( leftLinePoints1 );
    leftLine1 = new THREE.Line( geometryLeftLine1, ecosystemMaterial );
    circle1.add( leftLine1 );

      // LEFT LINE 2
      const leftLineCurve2 = new THREE.LineCurve3(
        new THREE.Vector3( 0, 0, -0.5 ),
        new THREE.Vector3( 7, 7, -0.5 ),
      );
  
      const leftLinePoints2 = leftLineCurve2.getPoints( 1 );
      const geometryLeftLine2 = new THREE.BufferGeometry().setFromPoints( leftLinePoints2 );
      leftLine2 = new THREE.Line( geometryLeftLine2, ecosystemMaterial );
      circle1.add( leftLine2 );

      // LEFT LINE 3
      const leftLineCurve3 = new THREE.LineCurve3(
             new THREE.Vector3( 0, 0, -0.5 ),
             new THREE.Vector3( -7, 8, -0.5 ),
           );
       
    const leftLinePoints3 = leftLineCurve3.getPoints( 1 );
    const geometryLeftLine3 = new THREE.BufferGeometry().setFromPoints( leftLinePoints3 );
    leftLine3 = new THREE.Line( geometryLeftLine3, ecosystemMaterial );
     circle1.add( leftLine3 );

       // LEFT LINE 4
       const leftLineCurve4 = new THREE.LineCurve3(
              new THREE.Vector3( 0, 0, -0.5 ),
              new THREE.Vector3( -9, -5, -0.5 ),
            );
        
     const leftLinePoints4 = leftLineCurve4.getPoints( 1 );
     const geometryLeftLine4 = new THREE.BufferGeometry().setFromPoints( leftLinePoints4 );
     leftLine4 = new THREE.Line( geometryLeftLine4, ecosystemMaterial );
      circle1.add( leftLine4 );

         // LEFT LINE 5
         const leftLineCurve5 = new THREE.LineCurve3(
                new THREE.Vector3( 0, 0, -0.5 ),
                new THREE.Vector3( 0, -10, -0.5 ),
              );
          
       const leftLinePoints5 = leftLineCurve5.getPoints( 1 );
       const geometryLeftLine5 = new THREE.BufferGeometry().setFromPoints( leftLinePoints5 );
       leftLine5 = new THREE.Line( geometryLeftLine5, ecosystemMaterial );
        circle1.add( leftLine5 );


      // RIGHT
      
        // RIGHT LINE 1
    const rightLineCurve1 = new THREE.LineCurve3(
      new THREE.Vector3( 0, 0, -0.5 ),
      new THREE.Vector3( 9, -4.5, -0.5 ),
    );
    const rightLinePoints1 = rightLineCurve1.getPoints( 1 );
    const geometryrightLine1 = new THREE.BufferGeometry().setFromPoints( rightLinePoints1 );
    rightLine1 = new THREE.Line( geometryrightLine1, ecosystemMaterial );
    circle5.add( rightLine1 );

      // RIGHT LINE 2
      const rightLineCurve2 = new THREE.LineCurve3(
        new THREE.Vector3( 0, 0, -0.5 ),
        new THREE.Vector3( 7, 7, -0.5 ),
      );
  
      const rightLinePoints2 = rightLineCurve2.getPoints( 1 );
      const geometryrightLine2 = new THREE.BufferGeometry().setFromPoints( rightLinePoints2 );
      rightLine2 = new THREE.Line( geometryrightLine2, ecosystemMaterial );
      circle5.add( rightLine2 );

      // RIGHT LINE 3
      const rightLineCurve3 = new THREE.LineCurve3(
             new THREE.Vector3( 0, 0, -0.5 ),
             new THREE.Vector3( -6.75, 8, -0.5 ),
           );
       
    const rightLinePoints3 = rightLineCurve3.getPoints( 1 );
    const geometryrightLine3 = new THREE.BufferGeometry().setFromPoints( rightLinePoints3 );
    rightLine3 = new THREE.Line( geometryrightLine3, ecosystemMaterial );
     circle5.add( rightLine3 );

       // RIGHT LINE 4
       const rightLineCurve4 = new THREE.LineCurve3(
              new THREE.Vector3( 0, 0, -0.5 ),
              new THREE.Vector3( -9, -5, -0.5 ),
            );
        
     const rightLinePoints4 = rightLineCurve4.getPoints( 1 );
     const geometryrightLine4 = new THREE.BufferGeometry().setFromPoints( rightLinePoints4 );
     rightLine4 = new THREE.Line( geometryrightLine4, ecosystemMaterial );
      circle5.add( rightLine4 );

         // RIGHT LINE 5
         const rightLineCurve5 = new THREE.LineCurve3(
                new THREE.Vector3( 0, 0, -0.5 ),
                new THREE.Vector3( 0, -10, -0.5 ),
              );
          
       const rightLinePoints5 = rightLineCurve5.getPoints( 1 );
       const geometryrightLine5 = new THREE.BufferGeometry().setFromPoints( rightLinePoints5 );
       rightLine5 = new THREE.Line( geometryrightLine5, ecosystemMaterial );
        circle5.add( rightLine5 );

    // LINES
  
const materialWhite = new THREE.LineDashedMaterial( { color : 0xffffff, linewidth: 10 } );

    // LEFT
// sub curve left, first from top

const curveSub1 = new THREE.SplineCurve( [
  new THREE.Vector2( -0.3, -5.1 ),
  new THREE.Vector2( -1.5, -4.3 ),
  new THREE.Vector2( -2.5, -4.4),
  new THREE.Vector2( -3.5, -4.2 )
] );

const pointsSub1 = curveSub1.getPoints( 1000 );
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

const pointsSub2 = curveSub2.getPoints( 1000 );
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

const pointsSub3 = curveSub3.getPoints( 1000 );
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

const pointsSub4 = curveSub4.getPoints( 1000 );
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

const pointsSub5 = curveSub5.getPoints( 1000 );
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

const pointsSub6 = curveSub6.getPoints( 1000 );
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

const pointsSub7 = curveSub7.getPoints( 1000 );
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

const pointsSub8 = curveSub8.getPoints( 1000 );
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
   
  
  gsap.to([particlesMesh.material, particlesMeshLower.material,particlesMeshLowerLower.material,], {size: 0.015, duration: 5, ease: Sine});
  // EFFECT COMPOSER + BLOOM EFFECT
  composer = new EffectComposer( renderer );
  const renderPass = new RenderPass( scene, camera );
  composer.addPass( renderPass );


  var unRealBloomPass = new UnrealBloomPass({ x: 800, y: 600}, 0.5, 0.5, 0.1);

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

    //render();
    composer.render();
}
  
  
  function animate() {
    
      updateCamera();
      requestAnimationFrame( animate );
      // controls.update();
      composer.render();
      stats.update()
    
     //render();
 
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
  immediateRender: false,
  ease: "power1.inOut",
  scrub: true,
 // anticipatePin: true,
});

scene_anim = gsap.timeline();

scene_anim.to([camera.position, cameraCenter, ], { y: "-=10", scrollTrigger: {

trigger: ".about",
start: 0,
end: window.innerHeight * 3,
scrub: 1,
update: camera.updateProjectionMatrix(),
}});

scene_anim.to([camera.position ], { z: "-=5", scrollTrigger: {

  trigger: ".services",
  start: window.innerHeight * 2,
  end: window.innerHeight * 2.5,
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

], { count: 1000, scrollTrigger: {
  trigger: ".about",
  start: window.innerHeight - window.innerHeight / 7.5,
  end: window.innerHeight,
  scrub: 5,
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
  
  ], { count: 0, scrollTrigger: {
    trigger: ".about",
    start: window.innerHeight + window.innerHeight / 5,
    end: window.innerHeight * 1.5,
    scrub: 3,
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

    else if((window.scrollY / window.innerHeight) >= 2.975 && (window.scrollY / window.innerHeight) <= 3.025 || (window.scrollY / window.innerHeight) === 3) {
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

    else if((window.scrollY / window.innerHeight) >= 5.975 && (window.scrollY / window.innerHeight) <= 6.025 || (window.scrollY / window.innerHeight) === 4) {
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


scene_anim.to([
  leftLayer.children[0].children[0],
  leftLayer.children[0].children[1],
  leftLayer.children[0].children[2],
  leftLayer.children[0].children[3]
], { "left": "0%", duration: 0.4, ease: Sine});

scene_anim.to([
  rightLayer.children[0].children[0],
  rightLayer.children[0].children[1],
  rightLayer.children[0].children[2],
  rightLayer.children[0].children[3],

], { "right": "0%", duration: 0.4, ease: Sine});




/* TOKEN SECTION */

let tokenCounter = 2;
let layer = document.querySelector('#tokenLayer');

layer.addEventListener('click', (e)=> {
    if(tokenCounter % 2 == 0) gsap.to('#tokenLayerMain', { 'clip-path': 'circle(100%)', duration: 0.25, ease: Sine });
    else gsap.to('#tokenLayerMain', { 'clip-path': 'circle(0%)', duration: 0.25, ease: Sine });
    tokenCounter+=1;
});

/* TOKEN ANIMATION */





 