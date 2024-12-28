// Boundary dimensions
const boundaryWidth = 40;
const boundaryHeight = 20;
const wallHeight = 10;
const roofHeight = 2.7; // Height of the triangular peak


// Initialize scene
function initScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue background
    return scene;
}

// Initialize camera
function initCamera() {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(15, 10, 15); // Camera position
    camera.lookAt(0, 0, 0); // Camera looks at the center
    return camera;
}

// Initialize renderer
function initRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    return renderer;
}

// Initialize orbit controls
function initControls(camera, renderer) {
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.screenSpacePanning = false;
    return controls;
}

// Add lighting to the scene
function addLighting(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Soft ambient light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Directional light
    directionalLight.position.set(10, 10, 10); // Position the light
    scene.add(directionalLight);
}

// Create ground (floor)
function createGround() {
    const groundGeometry = new THREE.PlaneGeometry(boundaryWidth, boundaryHeight);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xa0a0a0, side: THREE.DoubleSide });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    return ground;
}

// Create walls of the house with texture
function createWalls() {
    const textureLoader = new THREE.TextureLoader();
    const wallTexture = textureLoader.load('walls_texture.jpg'); // Load your wall texture

    // Repeat the texture for better tiling, if needed
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(4, 4); // Adjust the repeat values to fit the wall size

    const wallMaterial = new THREE.MeshStandardMaterial({
        map: wallTexture, // Apply the wall texture
        side: THREE.DoubleSide,
        roughness: 0.8, // Adjust for a realistic look
    });

    const wall1 = new THREE.Mesh(new THREE.BoxGeometry(boundaryWidth, wallHeight, 0.1), wallMaterial); // Front wall
    wall1.position.set(0, wallHeight / 2, -boundaryHeight / 2);

    const wall2 = new THREE.Mesh(new THREE.BoxGeometry(boundaryWidth, wallHeight, 0.1), wallMaterial); // Back wall
    wall2.position.set(0, wallHeight / 2, boundaryHeight / 2);

    const wall3 = new THREE.Mesh(new THREE.BoxGeometry(0.1, wallHeight, boundaryHeight), wallMaterial); // Left wall
    wall3.position.set(-boundaryWidth / 2, wallHeight / 2, 0);

    const wall4 = new THREE.Mesh(new THREE.BoxGeometry(0.1, wallHeight, boundaryHeight), wallMaterial); // Right wall
    wall4.position.set(boundaryWidth / 2, wallHeight / 2, 0);

    return [wall1, wall2, wall3, wall4];
}


// Create roof with straw texture
function createRoof() {
    const roofWidth = boundaryWidth;
    const roofDepth = boundaryHeight * 3.8 / 5;

    // Load hay/straw texture
    const textureLoader = new THREE.TextureLoader();
    const strawTexture = textureLoader.load('straw_texture.jpg'); // Replace with your texture path

    // Repeat the texture to simulate clumps of straw
    strawTexture.wrapS = THREE.RepeatWrapping;
    strawTexture.wrapT = THREE.RepeatWrapping;
    strawTexture.repeat.set(4, 4);  // Repeat the texture 4 times in each direction

    const roofMaterial = new THREE.MeshStandardMaterial({
        map: strawTexture, // Apply the straw texture
        side: THREE.DoubleSide, // Make sure both sides of the roof have the texture
        roughness: 0.8,  // Add some roughness for a more natural look
        metalness: 0.1   // Low metalness for a natural material
    });

    // Roof geometry (two slanted triangular sections)
    const roofGeometry = new THREE.PlaneGeometry(roofWidth, roofDepth);

    // Create the first slanted roof section (slant at 45 degrees)
    const roof1 = new THREE.Mesh(roofGeometry, roofMaterial);
    roof1.rotation.x = Math.PI / 2.7; // Slant the roof to make it triangular (45 degrees)
    roof1.position.set(0, wallHeight + roofHeight / 2, -roofDepth / 2.2); // Position it at the back side
    return roof1;
}

// Create second slanted roof section (slant at -45 degrees)
function createRoof2() {
    const roofWidth = boundaryWidth;
    const roofDepth = boundaryHeight * 3.8 / 5;

    // Load hay/straw texture
    const textureLoader = new THREE.TextureLoader();
    const strawTexture = textureLoader.load('straw_texture.jpg'); // Replace with your texture path

    // Repeat the texture to simulate clumps of straw
    strawTexture.wrapS = THREE.RepeatWrapping;
    strawTexture.wrapT = THREE.RepeatWrapping;
    strawTexture.repeat.set(4, 4);  // Repeat the texture 4 times in each direction

    const roofMaterial = new THREE.MeshStandardMaterial({
        map: strawTexture, // Apply the straw texture
        side: THREE.DoubleSide, // Make sure both sides of the roof have the texture
        roughness: 0.8,  // Add some roughness for a more natural look
        metalness: 0.1   // Low metalness for a natural material
    });

    // Roof geometry (two slanted triangular sections)
    const roofGeometry = new THREE.PlaneGeometry(roofWidth, roofDepth);

    // Create the second slanted roof section (slant at -45 degrees)
    const roof2 = new THREE.Mesh(roofGeometry, roofMaterial);
    roof2.rotation.x = -Math.PI / 2.7; // Inverse slant (135 degrees)
    roof2.position.set(0, wallHeight + roofHeight / 2, roofDepth / 2.2); // Position it at the front side
    return roof2;
}

// Create a triangular prism to fill the space between the roof and walls
function createRoofFill() {
    const prismGeometry = new THREE.BufferGeometry();

    // Define the vertices for the triangular prism
    const vertices = new Float32Array([
        // Front face (triangle)
        -boundaryWidth / 2, wallHeight, -boundaryHeight / 2, // Bottom left
        boundaryWidth / 2, wallHeight, -boundaryHeight / 2,  // Bottom right
        0, wallHeight + roofHeight, -boundaryHeight / 2,     // Top center

        // Back face (triangle)
        -boundaryWidth / 2, wallHeight, boundaryHeight / 2,  // Bottom left
        boundaryWidth / 2, wallHeight, boundaryHeight / 2,   // Bottom right
        0, wallHeight + roofHeight, boundaryHeight / 2,      // Top center

        // Connecting edges (rectangles)
        -boundaryWidth / 2, wallHeight, -boundaryHeight / 2, // Front bottom left
        -boundaryWidth / 2, wallHeight, boundaryHeight / 2,  // Back bottom left
        0, wallHeight + roofHeight, -boundaryHeight / 2,     // Front top center
        0, wallHeight + roofHeight, boundaryHeight / 2,      // Back top center

        boundaryWidth / 2, wallHeight, -boundaryHeight / 2,  // Front bottom right
        boundaryWidth / 2, wallHeight, boundaryHeight / 2,   // Back bottom right
    ]);

    // Define the indices for the faces
    const indices = [
        0, 1, 2, // Front triangle
        3, 4, 5, // Back triangle
        0, 3, 6, 6, 3, 7, // Left rectangle
        1, 4, 8, 8, 4, 9, // Right rectangle
        6, 8, 7, 7, 8, 9  // Top rectangle
    ];

    // Add vertices and indices to the geometry
    prismGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    prismGeometry.setIndex(indices);
    prismGeometry.computeVertexNormals();

    // Use the wall texture for consistency
    const textureLoader = new THREE.TextureLoader();
    const wallTexture = textureLoader.load('walls_texture.jpg');
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;

    const prismMaterial = new THREE.MeshStandardMaterial({
        map: wallTexture, // Apply the wall texture
        side: THREE.DoubleSide,
        roughness: 0.8,
    });

    const prism = new THREE.Mesh(prismGeometry, prismMaterial);
    return prism;
}

// Updated Main function to include the triangular prism
function main() {
    const scene = initScene();
    const camera = initCamera();
    const renderer = initRenderer();
    const controls = initControls(camera, renderer);

    addLighting(scene); // Add lighting to the scene

    const ground = createGround(); // Create the ground
    scene.add(ground);

    const walls = createWalls(); // Create the walls
    walls.forEach(wall => scene.add(wall));

    const roof1 = createRoof(); // Create the first slanted roof section
    scene.add(roof1);

    const roof2 = createRoof2(); // Create the second slanted roof section
    scene.add(roof2);

    const roofFill = createRoofFill(); // Add the triangular prism to fill the gap
    scene.add(roofFill);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

// Run the main function to start the scene
main();
