import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
document.addEventListener('DOMContentLoaded', function () {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const langButtons = document.querySelectorAll('.lang-btn');
    //const submitButton = document.getElementById('submitButton');
    //const dataForm = document.getElementById('dataForm');
    const viewer = document.getElementById('viewer');
    const menuItems = document.querySelectorAll('nav ul li a');
    const currentLocation = window.location.href;
    const dropdown1 = document.getElementById('dropdown1');
    const dropdown2 = document.getElementById('dropdown2');
    const showPopupButton = document.getElementById('q');
        
    // Показ popup по клику на кнопку
    showPopupButton.addEventListener('click', function () {
        popup.style.display = 'flex';
        popupOverlay.style.display = 'flex';
    });

    // Popup functionality
    const popup = document.getElementById('popup');
    const popupOverlay = document.getElementById('popup-overlay');
    const closeBtn = document.querySelector('.close-btn');

    // Проверяем, был ли popup уже показан в этой сессии

    if (!sessionStorage.getItem('popupShown')) {
        popup.style.display = 'flex';
        popupOverlay.style.display = 'flex';
        sessionStorage.setItem('popupShown', 'true');
    }

    // Закрытие popup при клике на overlay
    popupOverlay.addEventListener('click', function () {
        popup.style.display = 'none';
        popupOverlay.style.display = 'none';
    });


    // Close the popup when the close button is clicked
    closeBtn.addEventListener('click', function() {
        popup.style.display = 'none';
    });

    // Close the popup when clicking outside the popup content
    window.addEventListener('click', function(event) {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });

    // Function to add options from 1 to 10
    function addOptions(dropdown) {
        // Очищаем выпадающий список перед добавлением новых опций
        dropdown.innerHTML = ''; // или dropdown.options.length = 0;

        for (let i = 15; i <= 48; i++) {
            let option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            dropdown.appendChild(option);
        }
    }

    dropdown1.addEventListener('focus', function () {
        addOptions(dropdown1);
    });

    dropdown2.addEventListener('focus', function () {
        addOptions(dropdown2);
    });

    menuItems.forEach(item => {
        if (item.href === currentLocation) {
            item.classList.add('active');
        }
    });

    const translations = {
        en: {
            header: "Shoescad",
            field1: "Length, mm:",
            field2: "Width, mm:",
            field3: "Height, mm:",
            field4: "Size, EUR:",
            "upload-area": "Drag and drop files here or click to select files",
            submit: "Resize",
            "name-form": "Resize module",
            grading: "Resize",
            "select-range": "Select a size:",
            modeling: "Modeling",
            "popup-h2": "Shoescad - tutorial",
            tutorial: "Here you can grade the last. To do this, upload a file with a 3D model to the page, set the size range and click the 'Send' button. Then download the files with the graded lasts."
        },
        ru: {
            header: "Shoescad",
            field1: "Длина, мм:",
            field2: "Ширина, мм:",
            field3: "Высота, мм:",
            field4: "Размер, EUR:",
            "upload-area": "Перетащите файлы сюда или нажмите, чтобы выбрать файлы",
            submit: "Градировать",
            "name-form": "Модуль градирования",
            grading: "Градирование",
            "select-range": "Выберите размер:",
            modeling: "Моделирование",
            "popup-h2": "Shoescad - инструкция",
            tutorial: "Здесь Вы можете отградировать колодку. Для этого загрузите на страницу файл с 3D - моделью, установите диапазон размеров и нажмите кнопку 'Отправить'. Далее скачайте файлы с отградированными колодками."
        }
    };

    function switchLanguage(language) {
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            element.textContent = translations[language][key];
        });
        sessionStorage.setItem('language', language); // Сохраняем язык в sessionStorage
    }

    // Восстанавливаем язык из sessionStorage при загрузке страницы
    const savedLanguage = sessionStorage.getItem('language');
    if (savedLanguage) {
        switchLanguage(savedLanguage);
    } else {
        switchLanguage('en'); // Устанавливаем язык по умолчанию, если sessionStorage не установлено
    }


    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchLanguage(button.id);
        });
    });

    uploadArea.addEventListener('click', function () {
        fileInput.click();
    });

    uploadArea.addEventListener('dragover', function (event) {
        event.preventDefault();
        event.stopPropagation();
        uploadArea.style.backgroundColor = '#e9ecef';
    });

    uploadArea.addEventListener('dragleave', function (event) {
        event.preventDefault();
        event.stopPropagation();
        uploadArea.style.backgroundColor = 'white';
    });

    uploadArea.addEventListener('drop', function (event) {
        event.preventDefault();
        event.stopPropagation();
        uploadArea.style.backgroundColor = 'white';

        const files = event.dataTransfer.files;
        handleFiles(files);
    });

    fileInput.addEventListener('change', function (event) {
        const files = event.target.files;
        handleFiles(files);
    });

    function handleFiles(files) {
        const file = files[0];
        if (file && file.name.endsWith('.stl')) {
            const reader = new FileReader();
            reader.onload = function (event) {
                console.log("STL file loaded successfully.");
                displaySTL(event.target.result);
            };
            reader.onerror = function (event) {
                console.error("Error reading file:", event.target.error);
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert('Please upload an STL file.');
        }
    }

    function displaySTL(data) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, viewer.clientWidth / viewer.clientHeight, 0.1, 2000); // Увеличить FOV и дальнюю плоскость отсечения
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(viewer.clientWidth, viewer.clientHeight);
        viewer.innerHTML = '';
        viewer.appendChild(renderer.domElement);

        // Установить фон сцены в серый цвет
        scene.background = new THREE.Color(0xf5f5f5);

        // Добавить окружающее освещение
        const ambientLight = new THREE.AmbientLight(0x404040, 2); // Увеличить интенсивность для более равномерного освещения
        scene.add(ambientLight);

        // Добавить несколько направленных источников света
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight1.position.set(1, 1, 1).normalize();
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight2.position.set(-1, 1, 1).normalize();
        scene.add(directionalLight2);

        const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight3.position.set(1, -1, 1).normalize();
        scene.add(directionalLight3);

        const directionalLight4 = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight4.position.set(1, 1, -1).normalize();
        scene.add(directionalLight4);

        const loader = new STLLoader();
        const geometry = loader.parse(data);
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, shininess: 200 });
        const mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh);

        // Настроить OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;


        // Центрирование модели
        const boundingBox = new THREE.Box3().setFromObject(mesh);
        const center = boundingBox.getCenter(new THREE.Vector3());
        mesh.position.sub(center); // Перемещаем модель так, чтобы ее центр оказался в (0, 0, 0)

        // Функция для масштабирования и центрирования модели
        function resizeModel() {
            const size = boundingBox.getSize(new THREE.Vector3());

            // Подходящее расстояние для камеры от модели
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)));

            // Центрировать камеру на модели
            camera.position.set(0, 0, cameraZ);
            camera.lookAt(new THREE.Vector3(0, 0, 0));

            // Настроить дальнюю плоскость отсечения камеры
            const cameraToFarEdge = cameraZ * 2;
            camera.far = cameraToFarEdge * 3;
            camera.updateProjectionMatrix();

            // Обновить поля с размерами модели
            document.getElementById('field1').value = size.x.toFixed(2);
            document.getElementById('field2').value = size.y.toFixed(2);
            document.getElementById('field3').value = size.z.toFixed(2);
            checkField1Value();
        }

        resizeModel();

        // Обработчик изменения размера окна
        window.addEventListener('resize', () => {
            camera.aspect = viewer.clientWidth / viewer.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(viewer.clientWidth, viewer.clientHeight);
            resizeModel();
        });

        const animate = function () {
            requestAnimationFrame(animate);
            //mesh.rotation.x += 0.01;
            //mesh.rotation.y += 0.01;
            controls.update();
            renderer.render(scene, camera);
        };

        animate();
    }
});
    function checkField1Value() {
        const value = (3 / 20 * parseFloat(field1.textContent));
        field4.textContent = Math.round(value);
        field5.value = Math.round(value);
}