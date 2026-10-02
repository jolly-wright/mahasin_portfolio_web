document.addEventListener('DOMContentLoaded', () => {

    // --- Dynamic Header Scroll Spy ---
    const sections = document.querySelectorAll('[data-section]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -50% 0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetKey = entry.target.getAttribute('data-section');
                
                navLinks.forEach(link => {
                    const navKey = link.getAttribute('data-nav');
                    if (navKey === targetKey) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));

    // --- Three.js Dynamic Space Canvas (Earth Model) ---
    const canvas = document.getElementById('space-canvas');
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 3.2;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const textureLoader = new THREE.TextureLoader();

    // Earth Textures
    const earthMap = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
    const bumpMap = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-topology.png');
    const specMap = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-water.png');
    const cloudMap = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-clouds.png');

    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // 1. Earth Sphere
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: earthMap,
        bumpMap: bumpMap,
        bumpScale: 0.05,
        specularMap: specMap,
        specular: new THREE.Color(0x333333),
        shininess: 15
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earthMesh);

    // 2. Cloud Layer
    const cloudGeometry = new THREE.SphereGeometry(1.02, 64, 64);
    const cloudMaterial = new THREE.MeshStandardMaterial({
        map: cloudMap,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    earthGroup.add(cloudMesh);

    // 3. Atmosphere Glow
    const atmosphereGeometry = new THREE.SphereGeometry(1.18, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                gl_FragColor = vec4(0.22, 0.74, 0.97, 1.0) * intensity;
            }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    earthGroup.add(atmosphereMesh);

    // 4. Starfield
    const STAR_COUNT = 300;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(STAR_COUNT * 3);

    for (let i = 0; i < STAR_COUNT; i++) {
        const radius = 6 + Math.random() * 14;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        starPositions[i * 3 + 2] = radius * Math.cos(phi);
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        transparent: true,
        opacity: 0.85
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // Lighting
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0x111827, 0.2));

    function animateSpace() {
        requestAnimationFrame(animateSpace);
        earthMesh.rotation.y += 0.0015;
        cloudMesh.rotation.y += 0.0019;
        starField.rotation.y += 0.0001;
        renderer.render(scene, camera);
    }
    animateSpace();

    // Preserve Earth Scroll Logic Before Projects
    const projectsSection = document.getElementById('projects');

    function updateSceneOnScroll() {
        if (!projectsSection) return;

        const projectsRect = projectsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (projectsRect.top < windowHeight) {
            const progress = (windowHeight - projectsRect.top) / windowHeight;
            earthGroup.position.y = progress * 3.5;
            earthGroup.position.z = -progress * 2.0;
            canvas.style.opacity = '0';
        } else {
            earthGroup.position.y = 0;
            earthGroup.position.z = 0;
            canvas.style.opacity = '1';
        }
    }

    window.addEventListener('scroll', updateSceneOnScroll);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- Three.js 3D Open Grimoire Book ---
    const bookContainer = document.getElementById('3d-book-canvas');
    if (bookContainer) {
        const bookScene = new THREE.Scene();
        const bookCamera = new THREE.PerspectiveCamera(40, bookContainer.clientWidth / bookContainer.clientHeight, 0.1, 100);
        bookCamera.position.set(0, 0, 7.5);

        const bookRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        bookRenderer.setSize(bookContainer.clientWidth, bookContainer.clientHeight);
        bookRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        bookContainer.appendChild(bookRenderer.domElement);

        const bookGroup = new THREE.Group();
        bookScene.add(bookGroup);

        // Warm Vintage Lighting
        const bookLight = new THREE.PointLight(0xffe6b3, 2.5, 20);
        bookLight.position.set(0, 3, 5);
        bookScene.add(bookLight);

        const bookAmbient = new THREE.AmbientLight(0x3a2517, 1.8);
        bookScene.add(bookAmbient);

        // 3D Curved Open Pages Geometry
        function createOpenPageGeometry(isLeft) {
            const geom = new THREE.PlaneGeometry(2.4, 3.4, 32, 32);
            const pos = geom.attributes.position;
            for (let i = 0; i < pos.count; i++) {
                let x = pos.getX(i);
                // Curve pages slightly upward toward spine and downward toward edges
                let curve = Math.sin((x + (isLeft ? 1.2 : -1.2)) * 0.8) * 0.18;
                pos.setZ(i, curve);
            }
            geom.computeVertexNormals();
            return geom;
        }

        const leatherMat = new THREE.MeshStandardMaterial({ color: 0x1e120a, roughness: 0.8 });
        const coverGeom = new THREE.BoxGeometry(5.2, 3.6, 0.1);
        const coverMesh = new THREE.Mesh(coverGeom, leatherMat);
        coverMesh.position.z = -0.12;
        bookGroup.add(coverMesh);

        // Spine Center
        const spineGeom = new THREE.CylinderGeometry(0.12, 0.12, 3.6, 16);
        const spineMesh = new THREE.Mesh(spineGeom, leatherMat);
        spineMesh.rotation.x = Math.PI / 2;
        spineMesh.position.z = -0.05;
        bookGroup.add(spineMesh);

        // Add 3D open book subtle tilt
        bookGroup.rotation.x = 0.25;

        // Interactive Mouse Parallax Tilt
        let targetRotY = 0;
        let targetRotX = 0.25;

        window.addEventListener('mousemove', (e) => {
            const rect = bookContainer.getBoundingClientRect();
            if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
                const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
                const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
                targetRotY = mouseX * 0.35;
                targetRotX = 0.25 + mouseY * 0.2;
            }
        });

        function animateBook() {
            requestAnimationFrame(animateBook);
            bookGroup.rotation.y += (targetRotY - bookGroup.rotation.y) * 0.05;
            bookGroup.rotation.x += (targetRotX - bookGroup.rotation.x) * 0.05;
            bookRenderer.render(bookScene, bookCamera);
        }
        animateBook();

        window.addEventListener('resize', () => {
            if (!bookContainer) return;
            bookCamera.aspect = bookContainer.clientWidth / bookContainer.clientHeight;
            bookCamera.updateProjectionMatrix();
            bookRenderer.setSize(bookContainer.clientWidth, bookContainer.clientHeight);
        });
    }

    // Mobile Navigation Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });
    }

    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Owl dispatched! Signal transmitted successfully.');
            contactForm.reset();
        });
    }
});