# OilX - Spill Segmentation

Проект предназначен для автоматической сегментации разливов нефти на изображениях с использованием нейронных сетей. Модель обучена на собственном датасете изображений и масок, а результат сохраняется в формате COCO для дальнейшего использования в UNET++ или других системах.

---

## Установка проекта

### 1. Клонируйте репозиторий:
```bash
git clone https://github.com/Jeson3532/OilSegmentation.git
cd OilSegmentation
```
### 2. Создайте и активируйте виртуальное окружение:
```bash
python -m venv venv
source venv/bin/activate   # Linux / macOS
venv\Scripts\activate      # Windows
```
### 3. Установите зависимости
```bash
pip install -r requirements.txt
```

### Обучение модели

- Теперь вы можете использовать `.ipynb-файл` для конвертации собственных масок в COCO-аннотации для дальнейшего дообучения UNET++ модели.
- Используйте предоставленный бекенд (Entry: `src/entry/run.py`, Routers: `src/routers`) для доступа к Вашей модели удаленно.


#### Автор: `https://github.com/Jeson3532`, `jeson.jesonov@gmail.com`