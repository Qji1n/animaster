function animaster() {
    function getTransform(translation, ratio) {
        const result = [];
        if (translation) {
            result.push(`translate(${translation.x}px,${translation.y}px)`);
        }
        if (ratio) {
            result.push(`scale(${ratio})`);
        }
        return result.join(' ');
    }

    // Простые анимации

    // Анимация появления: элемент становится видимым
    function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    // Анимация скрытия: элемент становится невидимым
    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    // Анимация перемещения
    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    // Анимация масштабирования
    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    // Сложные анимации

    function moveAndHide(element, duration) {
        const moveDuration = (duration * 2) / 5;
        const fadeDuration = duration - moveDuration; // 3/5 от общей длительности
        move(element, moveDuration, { x: 100, y: 20 });
        setTimeout(() => {
            fadeOut(element, fadeDuration);
        }, moveDuration);
    }

    function showAndHide(element, duration) {
        const stepDuration = duration / 3;
        fadeIn(element, stepDuration);
        setTimeout(() => {
            fadeOut(element, stepDuration);
        }, 2 * stepDuration);
    }
    
    function heartBeating(element) {
        // Первый такт немедленно
        scale(element, 500, 1.4);
        setTimeout(() => {
            scale(element, 500, 1);
        }, 500);
        // Повторяем каждые 1000 мс
        return setInterval(() => {
            scale(element, 500, 1.4);
            setTimeout(() => {
                scale(element, 500, 1);
            }, 500);
        }, 1000);
    }

    return {
        fadeIn,
        fadeOut,
        move,
        scale,
        moveAndHide,
        showAndHide,
        heartBeating
    };
}

addListeners();

function addListeners() {
    const instance = animaster();

    // Простые анимации
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            instance.fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            instance.fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            instance.move(block, 1000, { x: 100, y: 10 });
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            instance.scale(block, 1000, 1.25);
        });

    // Сложные анимации

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            instance.moveAndHide(block, 5000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            instance.showAndHide(block, 3000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            instance.heartBeating(block);
        });
}
