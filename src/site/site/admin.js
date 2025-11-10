// admin.js - обновленный код
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

    // Функционал админ-панели
    const mapImage = document.getElementById("admin-map");
    const addPointBtn = document.getElementById("add-point-btn");
    const savePointsBtn = document.getElementById("save-points-btn");
    const resetPointsBtn = document.getElementById("reset-points-btn");
    const editModal = document.getElementById("edit-modal");
    
    // Загружаем точки из localStorage
    let points = JSON.parse(localStorage.getItem('adminPoints')) || [];
    let currentEditingPoint = null;

    // Загрузка точек на карту админ-панели
    function loadPoints() {
        // Очищаем существующие точки
        document.querySelectorAll('.admin-point').forEach(point => point.remove());
        
        points.forEach(point => {
            createPointElement(point);
        });
    }

    // Создание элемента точки на карте
    function createPointElement(pointData) {
        const point = document.createElement("div");
        point.className = "admin-point";
        point.style.right = pointData.right;
        point.style.bottom = pointData.bottom;
        point.dataset.pointId = pointData.id;
        
        point.addEventListener("click", function(e) {
            e.stopPropagation();
            openEditModal(pointData);
        });
        
        mapImage.parentElement.appendChild(point);
        return point;
    }

    // Открытие модального окна редактирования
    function openEditModal(pointData) {
        currentEditingPoint = pointData;
        
        document.getElementById("edit-title").value = pointData.title || "";
        document.getElementById("edit-pollution").value = pointData.description || "";
        document.getElementById("edit-update-time").value = pointData.description_data || "";
        document.getElementById("edit-normal-image").value = pointData.image || "";
        document.getElementById("edit-mask-image").value = pointData.maskImage || "";
        document.getElementById("edit-x-coord").value = pointData.right ? pointData.right.replace('%', '') : "";
        document.getElementById("edit-y-coord").value = pointData.bottom ? pointData.bottom.replace('%', '') : "";
        
        editModal.style.display = "block";
    }

    // Добавление новой точки
    addPointBtn.addEventListener("click", function() {
        const x = document.getElementById("x-coord").value;
        const y = document.getElementById("y-coord").value;
        const title = document.getElementById("point-title").value;
        const pollution = document.getElementById("pollution-scale").value;
        const updateTime = document.getElementById("update-time").value;
        const normalImage = document.getElementById("normal-image").value;
        const maskImage = document.getElementById("mask-image").value;

        if (x && y && title) {
            const newPoint = {
                id: 'admin-point-' + Date.now(),
                right: x + "%",
                bottom: y + "%",
                title: title,
                description: pollution || "МАСШТАБ ЗАГРЯЗНЕНИЯ: 4%",
                description_data: updateTime || "ВРЕМЯ ОБНОВЛЕНИЯ: " + new Date().toLocaleDateString('ru-RU'),
                image: normalImage || "/site/photo/default.jpg",
                maskImage: maskImage || "/site/photo/default_mask.jpg",
                color: '#ff0000'
            };

            points.push(newPoint);
            createPointElement(newPoint);
            savePointsToStorage();
            
            // Очищаем поля ввода
            document.querySelectorAll('.admin-controls input').forEach(input => {
                if (input.type !== 'button') input.value = "";
            });
        } else {
            alert("Заполните обязательные поля: X, Y координаты и название");
        }
    });

    // Сохранение точек в localStorage
    function savePointsToStorage() {
        localStorage.setItem('adminPoints', JSON.stringify(points));
    }

    savePointsBtn.addEventListener("click", function() {
        savePointsToStorage();
        alert("Точки успешно сохранены! Они появятся на основной карте.");
    });

    // Сброс всех точек
    resetPointsBtn.addEventListener("click", function() {
        if (confirm("Вы уверены, что хотите удалить все точки?")) {
            points = [];
            localStorage.removeItem('adminPoints');
            document.querySelectorAll('.admin-point').forEach(point => point.remove());
            alert("Все точки удалены!");
        }
    });

    // Обработчики модального окна
    document.getElementById("save-edit-btn").addEventListener("click", function() {
        if (currentEditingPoint) {
            currentEditingPoint.title = document.getElementById("edit-title").value;
            currentEditingPoint.description = document.getElementById("edit-pollution").value;
            currentEditingPoint.description_data = document.getElementById("edit-update-time").value;
            currentEditingPoint.image = document.getElementById("edit-normal-image").value;
            currentEditingPoint.maskImage = document.getElementById("edit-mask-image").value;
            
            const x = document.getElementById("edit-x-coord").value;
            const y = document.getElementById("edit-y-coord").value;
            if (x && y) {
                currentEditingPoint.right = x + "%";
                currentEditingPoint.bottom = y + "%";
            }
            
            // Обновляем точку на карте
            const pointElement = document.querySelector(`[data-point-id="${currentEditingPoint.id}"]`);
            if (pointElement) {
                pointElement.style.right = currentEditingPoint.right;
                pointElement.style.bottom = currentEditingPoint.bottom;
            }
            
            savePointsToStorage();
            editModal.style.display = "none";
        }
    });

    document.getElementById("delete-point-btn").addEventListener("click", function() {
        if (currentEditingPoint && confirm("Удалить эту точку?")) {
            points = points.filter(p => p.id !== currentEditingPoint.id);
            const pointElement = document.querySelector(`[data-point-id="${currentEditingPoint.id}"]`);
            if (pointElement) pointElement.remove();
            savePointsToStorage();
            editModal.style.display = "none";
        }
    });

    document.getElementById("cancel-edit-btn").addEventListener("click", function() {
        editModal.style.display = "none";
    });

    // Закрытие модального окна при клике вне его
    window.addEventListener("click", function(event) {
        if (event.target === editModal) {
            editModal.style.display = "none";
        }
    });

    // Загрузка точек при старте
    loadPoints();
});