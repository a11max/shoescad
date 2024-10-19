document.addEventListener('DOMContentLoaded', function () {
    const langButtons = document.querySelectorAll('.lang-btn');
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
    closeBtn.addEventListener('click', function () {
        popup.style.display = 'none';
    });

    // Close the popup when clicking outside the popup content
    window.addEventListener('click', function (event) {
        if (event.target === popup) {
            popup.style.display = 'none';
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
            submit: "Grade",
            "name-form": "Grading module",
            grading: "Grading",
            "select-range": "Select a size:",
            modeling: "Modeling",
            "popup-h2": "Shoescad - tutorial",
            tutorial: "Here you can grade the last. To do this, upload a file with a 3D model to the page, set the size range and click the 'Send' button. Then download the files with the graded lasts.",
            "file-ready": "File Ready for Download",
            "your-file": "Your file has been modified successfully. Click the button below to download it.",
            "download": "Download"
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
            tutorial: "Здесь Вы можете отградировать колодку. Для этого загрузите на страницу файл с 3D - моделью, установите диапазон размеров и нажмите кнопку 'Отправить'. Далее скачайте файлы с отградированными колодками.",
            "file-ready": "Файл готов для загрузки",
            "your-file": "Колодка успешно отградирована. Нажмите кнопку ниже, чтобы загрузить файл.",
            "download": "Загрузить"
        }
    };

    function switchLanguage(language) {
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            element.textContent = translations[language][key];
        });
        sessionStorage.setItem('language', language); // Сохраняем язык в sessionStorage
    }

    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchLanguage(button.id);
        });
    });

    // Восстанавливаем язык из sessionStorage при загрузке страницы
    const savedLanguage = sessionStorage.getItem('language');
    if (savedLanguage) {
        switchLanguage(savedLanguage);
    } else {
        switchLanguage('en'); // Устанавливаем язык по умолчанию, если sessionStorage не установлено
    }
});

