const envHDRUrl = "./assets/env.hdr";
const billboardUrl = "./assets/futuristic_aged_billboard/scene.gltf";
let loading = 0;
let scene, camera, renderer;
let cube;
let billboardGLB;
let controls;
let tileTex;
let json;
let textureLoader;
const onSelect = (url) => {
  console.log(url);
  const meshFloorHall = billboardGLB.getObjectByName("Object_6");
  const tileTex = textureLoader.load(url);
  if (meshFloorHall && tileTex) {
    meshFloorHall.material.map = tileTex;
    meshFloorHall.material.needUpdate = true;
  }
};
const updateLoadingBar = () => {
  document.getElementById("loading-bar").style.width = `${loading}%`;
  if (loading >= 98) {
    document.getElementById("loading").style.display = "none";
    const imgCont = document.getElementById("image-container");
    const items = json[0].items;
    for (let i = 0; i < items.length; i++) {
      const img = document.createElement("img");
      img.setAttribute("src", items[i].image_address);
      img.setAttribute("onclick", `onSelect('${items[i].image_address}')`);
      imgCont.appendChild(img);
    }
  }
};

const animate = () => {
  requestAnimationFrame(animate);
  controls?.update();
  if (billboardGLB) {
    billboardGLB.rotation.y += 0.02;
  }
  renderer.render(scene, camera);
};

const init = () => {
  const canvas = document.querySelector("#c");
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xeeeeee, 1);
  renderer.outputEncoding = THREE.sRGBEncoding;
  const manager = new THREE.LoadingManager();
  manager.onLoad = function () {
    loading = 100;
    updateLoadingBar();
  };
  textureLoader = new THREE.TextureLoader(manager);
  camera.position.z = 15;
  const rgbeLoader = new THREE.RGBELoader(manager);
  rgbeLoader.load(
    envHDRUrl,
    (texture) => {
      if (renderer && scene) {
        let pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator = undefined;
        scene.environment = envMap;
        // scene.background = envMap;
      }
    },
    undefined,
    undefined
  );

  const loader = new THREE.GLTFLoader(manager);
  fetch("https://api.mockaroo.com/api/59d7cdf0?count=1&key=d89be5e0")
    .then((response) => response.json())
    .then((data) => {
      console.log("~~~~~~~~~~", data);
      console.log("~~~~Texture~~~~~~", data[0].items[0].image_address);
      json = data;
      loader.load(
        billboardUrl,
        (gltf) => {
          scene.add(gltf.scene);
          billboardGLB = gltf.scene;
          billboardGLB.position.y = -8;
          const meshFloorHall = billboardGLB.getObjectByName("Object_6");

          const tileTex = textureLoader.load(data[0].items[0].image_address);

          if (meshFloorHall && tileTex) {
            meshFloorHall.material.map = tileTex;
            meshFloorHall.material.needUpdate = true;
          }
        },
        (xhr) => {
          loading = (xhr.loaded / xhr.total) * 95;
          updateLoadingBar();
        }
      );
    });

  const onWindowResize = () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", onWindowResize, false);

  animate();
};
