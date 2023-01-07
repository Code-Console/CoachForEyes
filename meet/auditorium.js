const assetsBaseUrl = "https://hututusoftwares.com/";
const width = window.innerWidth;
const height = window.innerHeight;
const envHDRUrl = `${assetsBaseUrl}3D/Skybox_baseColor_sm.hdr`;
const auditoriumGLB = `${assetsBaseUrl}3D/auditorium_open.glb`;
const tileUrl = `${assetsBaseUrl}3D/tile.jpg`;
const tile2Url = `${assetsBaseUrl}3D/title2.jpg`;
let scene, camera, renderer, meshGLB;
const videoMesh = [];
let activeVideo = 0;
const loading = { inc: 10, loaded: 0 };
const addShadowedLight = (x, y, z, color, intensity) => {
  const directionalLight = new THREE.DirectionalLight(color, intensity);
  directionalLight.position.set(x, y, z);
  directionalLight.castShadow = true;
  const d = 1;
  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 4;
  directionalLight.shadow.bias = -0.002;
  return directionalLight;
};
const getChair = () => {
  const geometry = new THREE.BoxGeometry(0.1, 1.21, 0.8);
  const material = new THREE.MeshPhongMaterial({ color: 0x966f33 });
  const chair = new THREE.Group();
  const cubeA = new THREE.Mesh(geometry, material);
  const cubeB = cubeA.clone();
  const sit = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.1, 1),
    new THREE.MeshPhongMaterial({ color: 0xf0b581 })
  );
  const sitRest = cubeA.clone();
  const dist = 0.5;
  cubeA.position.set(-dist, 0, 0);
  cubeB.position.set(dist, 0, 0);
  sit.position.set(0, 0.2, 0.12);
  sitRest.position.set(0, 0.7, -0.45);
  sitRest.scale.set(10, 1, 0.1);

  chair.add(cubeA);
  chair.add(cubeB);
  chair.add(sit);
  chair.add(sitRest);
  const Obj = new THREE.Group();
  const Obj2 = new THREE.Group();
  const Obj3 = new THREE.Group();
  const Obj4 = new THREE.Group();
  Obj.add(chair);
  for (let i = 0; i < 14; i++) {
    Obj.add(chair.clone());
  }
  for (let i = 0; i < 15; i++) {
    Obj2.add(chair.clone());
  }
  for (let i = 0; i < 13; i++) {
    Obj3.add(chair.clone());
  }
  for (let i = 0; i < 13; i++) {
    Obj4.add(chair.clone());
  }

  for (let i = 0; i < Obj.children.length; i++) {
    const red = (Math.PI / 180) * (i - 7) * 8.0;
    Obj.children[i].position.set(
      Math.sin(red) * 13.9,
      0.5,
      Math.cos(red) * 13.9 - 16
    );
    Obj.children[i].rotation.y = red + Math.PI;
  }
  for (let i = 0; i < Obj2.children.length; i++) {
    const red = (Math.PI / 180) * (i - 7) * 8.0;
    Obj2.children[i].position.set(
      Math.sin(red) * 11.8,
      -0.5,
      Math.cos(red) * 11.8 - 16
    );
    Obj2.children[i].rotation.y = red + Math.PI;
  }
  for (let i = 0; i < Obj3.children.length; i++) {
    const red = (Math.PI / 180) * (i - 6.0) * 8.0;
    Obj3.children[i].position.set(
      Math.sin(red) * 10.2,
      -1.5,
      Math.cos(red) * 10.2 - 16.5
    );
    Obj3.children[i].rotation.y = red + Math.PI;
  }
  for (let i = 0; i < Obj4.children.length; i++) {
    const red = (Math.PI / 180) * (i - 6.0) * 8.0;
    Obj4.children[i].position.set(
      Math.sin(red) * 8.7,
      -2.0,
      Math.cos(red) * 8.7 - 17.0
    );
    Obj4.children[i].rotation.y = red + Math.PI;
  }
  const groupSit = new THREE.Group();
  groupSit.add(Obj);
  groupSit.add(Obj2);
  groupSit.add(Obj3);
  groupSit.add(Obj4);
  return groupSit;
};

const aInit = () => {
  const canvas = document.querySelector("#c");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  scene.background = 0xff0000;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x222222, 1);
  document.body.appendChild(renderer.domElement);
  camera.position.z = 5;
  const onWindowResize = () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener("keydown", dealWithKeyboard);
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = 0; // radians
  controls.maxPolarAngle = Math.PI * 0.5; // radians
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.update();

  const pGeometry = new THREE.PlaneGeometry(6, 4);
  for (let i = 0; i < 12; i++) {
    videoMesh.push(new THREE.Mesh(pGeometry, new THREE.MeshBasicMaterial()));
  }

  const rgbeLoader = new THREE.RGBELoader();
  rgbeLoader.load(
    envHDRUrl,
    (texture) => {
      if (renderer && scene) {
        let pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator = undefined;
        scene.environment = envMap;
        scene.background = envMap;
      }
    },
    undefined,
    undefined
  );
  directionalFLight = addShadowedLight(0, 0, 10, 0xffffff, 0.5);
  directionalBLight = addShadowedLight(0, 0, -10, 0xffffff, 0.5);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  scene.add(directionalFLight);
  scene.add(directionalBLight);
  const manager = new THREE.LoadingManager();
  manager.onLoad = function () {
    console.log("Loading complete!");
    $("#loading").remove();
    $("#join-meeting").css("display", "block");
  };
  const textureLoader = new THREE.TextureLoader(manager);
  const tileTex = textureLoader.load(tileUrl);
  tileTex.wrapS = THREE.RepeatWrapping;
  tileTex.wrapT = THREE.RepeatWrapping;
  tileTex.repeat.set(4, 4);
  const tile2Tex = textureLoader.load(tile2Url);
  tile2Tex.wrapT = THREE.RepeatWrapping;
  tile2Tex.wrapS = THREE.RepeatWrapping;
  tile2Tex.repeat.set(4, 4);

  const loader = new THREE.GLTFLoader(manager);
  loader.load(
    auditoriumGLB,
    (gltf) => {
      scene.add(gltf.scene);
      const meshFloorHall = gltf.scene.getObjectByName("FloorHall");

      meshFloorHall.material.map = tileTex;
      meshFloorHall.material.needUpdate = true;
      const chair = getChair();
      gltf.scene.add(chair);
      gltf.scene.traverse((object) => {
        if (!object["isMesh"]) return;
        if (object["isMesh"] && object["material"].isMaterial) {
          if (object.name === "chair_rings_2") {
            object.material.map = tile2Tex;
          }
          if (object.name === "stairs_centre_platfoform") {
            object.material.color = new THREE.Color(0x555555);
          }
        }
      });
      gltf.scene.position.set(0, 0, 12.5);
      videoMesh.forEach((mesh, i) => {
        gltf.scene.add(mesh);
        mesh.position.set(6.1 * (i % 3) - 6, 4.1 * Math.floor(i / 3) + 1, -19);
        mesh.name = `videoMesh${i}`;
      });
      meshGLB = gltf.scene;
    },
    (xhr) => {
      loading.loaded = (xhr.loaded / xhr.total) * 100;
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }
  );

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (loading.inc < loading.loaded) {
      document.documentElement.style.setProperty(
        "--load-end-width",
        loading.inc + "%"
      );
      loading.inc++;
    }

    videoMesh.forEach((mesh, i) => {
      if (activeVideo > 5) {
        mesh.position.set(
          -7.2 + 4.8 * (i % 4),
          -0.2 + 3.2 * Math.floor(i / 4),
          -19
        );
        mesh.scale.set(0.79, 0.79, 0.79);
      } else {
        mesh.position.set(6.1 * (i % 3) - 6, 4.1 * Math.floor(i / 3) + 1, -19);
        mesh.scale.set(1, 1, 1);
      }
    });
  }
  animate();
  setTimeout(() => {
    // setVideo();
  }, 10000);
};

const setVideo = (obj) => {
  if (obj?.remove) {
    const eleVideo = document.getElementById(`${obj?.remove}video${2}`);
    eleVideo?.remove();
    const eleAudio = document.getElementById(`${obj?.remove}audio${1}`);
    eleAudio?.remove();
  }

  const localVideo1 = document.getElementById("localVideo1");
  if (localVideo1 && videoMesh?.[0]) {
    videoMesh[0].material = new THREE.MeshBasicMaterial({
      map: new THREE.VideoTexture(localVideo1),
    });
    videoMesh[0].material.needUpdate = true;
  }

  const objKey = Object.keys(remoteTracks);
  var video = [];
  objKey.forEach((element) => {
    const v = document.getElementById(`${element}video${2}`);
    if (v) {
      video.push({ track: v, id: `${element}video${2}` });
    }
  });
  for (let i = 1; i < videoMesh.length; i++) {
    if (video.length >= i) {
      videoMesh[i].material = new THREE.MeshBasicMaterial({
        map: new THREE.VideoTexture(video[i - 1].track),
      });
    } else {
      videoMesh[i].material = new THREE.MeshBasicMaterial();
    }
    videoMesh[i].material.needUpdate = true;
    videoMesh[i].material.id = `videoId_${i}`;
  }
  activeVideo = video.length;
};
