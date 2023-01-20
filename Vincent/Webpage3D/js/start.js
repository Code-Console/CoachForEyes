const envHDRUrl = "./assets/env.hdr";
const billboardUrl = "./assets/futuristic_aged_billboard/scene.gltf";
const texturesApiUrl = "https://api.mockaroo.com/api/59d7cdf0?count=1&key=d89be5e0";
let loading = 0;
let scene, camera, renderer;
let cube;
let billboardGLB;
let controls;
let tileTex;
let json;
let textureLoader;
const onSelect = (url,id) => {
  console.log(url,id);
  const meshFloorHall = billboardGLB.getObjectByName("Object_6");
  const tileTex = textureLoader.load(url);
  if (meshFloorHall && tileTex) {
    meshFloorHall.material.map = tileTex;
    meshFloorHall.material.needUpdate = true;
  }
};
const updateLoadingBar = () => {
  document.getElementById("loading-bar").style.width = `${loading}%`;
  if (loading >= 98 && billboardGLB) {
    document.getElementById("loading").style.display = "none";
    const imgCont = document.getElementById("image-container");
    const items = json?.[0]?.items;
    for (let i = 0; i < items?.length; i++) {
      const img = document.createElement("img");
      img.setAttribute("src", items[i].image_address);
      img.setAttribute(
        "onclick",
        `onSelect('${items[i].image_address}','img-${i}')`
      );
      img.setAttribute("id", `img-${i}`);
      imgCont.appendChild(img);
    }
  }
};

const animate = () => {
  requestAnimationFrame(animate);
  controls?.update();
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
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  const manager = new THREE.LoadingManager();
  manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    loading = (itemsLoaded / itemsTotal) * 100;
    updateLoadingBar();
  };
  textureLoader = new THREE.TextureLoader();
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
      }
    },
    undefined,
    undefined
  );
  const loader = new THREE.GLTFLoader(manager);
  fetch(texturesApiUrl)
    .then((response) => response.json())
    .then((data) => {
      json = data;
      console.log("json~~~", json);
      const tileTex = textureLoader.load(data[0].items[0].image_address);
      loader.load(
        billboardUrl,
        (gltf) => {
          scene.add(gltf.scene);
          billboardGLB = gltf.scene;
          billboardGLB.position.y = -8;
          const meshFloorHall = billboardGLB.getObjectByName("Object_6");
          if (meshFloorHall && tileTex) {
            meshFloorHall.material.map = tileTex;
            meshFloorHall.material.needUpdate = true;
          }
        },
        (xhr) => {
          loading = (xhr.loaded / xhr.total) * 100;
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
