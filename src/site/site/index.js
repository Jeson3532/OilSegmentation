// index.js - обновленный код (добавьте в начало функции DOMContentLoaded)
document.addEventListener("DOMContentLoaded", function () {
    // Бургер-меню
    const hamburger = document.querySelector(".hamburger");
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.querySelector(".overlay");

    if (hamburger && sidebar && overlay) {
        hamburger.addEventListener("click", () => {
            sidebar.classList.toggle("active");
            overlay.classList.toggle("active");
        });

        overlay.addEventListener("click", () => {
            sidebar.classList.remove("active");
            overlay.classList.remove("active");
        });
    }

    // Карта и зум
    const backButton = document.getElementById("back-btn");
    const mapWrapper = document.querySelector(".map-wrapper");
    const mapImage = document.querySelector(".map");
    const mapConstructor = document.querySelector(".map-constructor");

    if (backButton && mapWrapper && mapImage && mapConstructor) {
        // Основные данные точек
        let zoomButtonsData = [
            {
                id: "zoom-btn-1",
                right: "30%",
                bottom: "45%",
                image: "/site/photo/photo1.jpg",
                maskImage: "/site/photo/photo1_mask.jpg",
                title: "Варьеганское месторождение",
                description: "МАСШТАБ ЗАГРЯЗНЕНИЯ: 4%",
                description_data: "ВРЕМЯ ОБНОВЛЕНИЯ: 01.06.2026"
            },
            {
                id: "zoom-btn-2",
                right: "66%",
                bottom: "17%",
                image: "/site/photo/photo2.jpg",
                maskImage: "/site/photo/photo2_mask.jpg",
                title: "Зимнее месторождение",
                description: "МАСШТАБ ЗАГРЯЗНЕНИЯ: 4%",
                description_data: "ВРЕМЯ ОБНОВЛЕНИЯ: 01.06.2026"
            },
            {
                id: "zoom-btn-3",
                right: "71%",
                bottom: "41%",
                image: "/site/photo/photo3.jpg",
                maskImage: "/site/photo/photo3_mask.jpg",
                title: "Каменное месторождение",
                description: "МАСШТАБ ЗАГРЯЗНЕНИЯ: 4%",
                description_data: "ВРЕМЯ ОБНОВЛЕНИЯ: 01.06.2026"
            },
            {
                id: "zoom-btn-4",
                right: "58%",
                bottom: "33%",
                image: "/site/photo/photo4.jpg",
                maskImage: "/site/photo/photo4_mask.jpg",
                title: "Приобское месторождение",
                description: "МАСШТАБ ЗАГРЯЗНЕНИЯ: 4%",
                description_data: "ВРЕМЯ ОБНОВЛЕНИЯ: 01.06.2026"
            },
            {
                id: "zoom-btn-5",
                right: "54%",
                bottom: "28%",
                image: "/site/photo/photo5.jpg",
                maskImage: "/site/photo/photo5_mask.jpg",
                title: "Салымское месторождение",
                description: "МАСШТАБ ЗАГРЯЗНЕНИЯ: 4%",
                description_data: "ВРЕМЯ ОБНОВЛЕНИЯ: 01.06.2026"
            },
            {
                id: "zoom-btn-6",
                right: "34%",
                bottom: "31%",
                image: "/site/photo/photo6.jpg",
                maskImage: "/site/photo/photo6_mask.jpg",
                title: "Самотлорское месторождение",
                description: "МАСШТАБ ЗАГРЯЗНЕНИЯ: 4%",
                description_data: "ВРЕМЯ ОБНОВЛЕНИЯ: 01.06.2026"
            },
            {
                id: "zoom-btn-7",
                right: "29%",
                bottom: "33%",
                image: "/site/photo/photo7.jpg",
                maskImage: "/site/photo/photo7_mask.jpg",
                title: "Северное месторождение",
                description: "МАСШТАБ ЗАГРЯЗНЕНИЯ: 4%",
                description_data: "ВРЕМЯ ОБНОВЛЕНИЯ: 01.06.2026"
            },
            {
                id: "zoom-btn-8",
                right: "42%",
                bottom: "15%",
                image: "/site/photo/photo8.jpg",
                maskImage: "/site/photo/photo8_mask.jpg",
                title: "Тайлоковское месторождение",
                description: "МАСШТАБ ЗАГРЯЗНЕНИЯ: 4%",
                description_data: "ВРЕМЯ ОБНОВЛЕНИЯ: 01.06.2026"
            },
            {
                id: "zoom-btn-9",
                right: "61%",
                bottom: "29%",
                image: "/site/photo/photo9.jpg",
                maskImage: "/site/photo/photo9_mask.jpg",
                title: "Эргинское месторождение",
                description: "МАСШТАБ ЗАГРЯЗНЕНИЯ: 4%",
                description_data: "ВРЕМЯ ОБНОВЛЕНИЯ: 01.06.2026"
            }
        ];

        // Загружаем точки из админ-панели
        const adminPoints = JSON.parse(localStorage.getItem('adminPoints')) || [];
        zoomButtonsData = zoomButtonsData.concat(adminPoints);

        // Создаем контейнер для детального просмотра
        const detailView = document.createElement("div");
        detailView.className = "detail-view";
        detailView.innerHTML = `
            <div class="images-container">
                <div class="image-wrapper">
                    <div class="image-title">Обычный вид</div>
                    <img src="" alt="Фото" class="normal-image">
                </div>
                <div class="image-wrapper">
                    <div class="image-title">Степень загрязнения</div>
                    <img src="" alt="Загрязнение" class="mask-image">
                </div>
            </div>
            <div class="description-container">
                <h3 class="location-title"></h3>
                <p class="location-description"></p>
                <p class="location-description_data"></p>
            </div>
        `;
        mapWrapper.appendChild(detailView);

        let currentImageData = null;

        const zoomButtons = [];
        zoomButtonsData.forEach(buttonData => {
            const zoomButton = document.createElement("div");
            zoomButton.className = "zoom-button";
            zoomButton.id = buttonData.id;
            zoomButton.style.right = buttonData.right;
            zoomButton.style.bottom = buttonData.bottom;
            zoomButton.style.background = buttonData.color || '#ff0000';
            
            zoomButton.addEventListener("click", function() {
                currentImageData = buttonData;
                
                mapConstructor.style.display = 'none';
                detailView.style.display = 'flex';
                backButton.style.display = 'block';
                
                detailView.querySelector('.normal-image').src = buttonData.image;
                detailView.querySelector('.mask-image').src = buttonData.maskImage;
                
                detailView.querySelector('.location-title').textContent = buttonData.title;
                detailView.querySelector('.location-description').textContent = buttonData.description;
                detailView.querySelector('.location-description_data').textContent = buttonData.description_data;
                
                zoomButtons.forEach(button => {
                    button.style.display = 'none';
                });
            });
            
            mapConstructor.appendChild(zoomButton);
            zoomButtons.push(zoomButton);
        });

        backButton.addEventListener("click", function() {
            mapConstructor.style.display = 'block';
            detailView.style.display = 'none';
            backButton.style.display = 'none';
            
            zoomButtons.forEach(button => {
                button.style.display = 'block';
            });
            
            currentImageData = null;
        });
    }
});