function animaster() {
    // Вспомогательная функция для формирования строки трансформаций
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

    function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    // Сложные анимации

    function moveAndHide(element, duration) {
        const moveDuration = (duration * 2) / 5;
        const fadeDuration = duration - moveDuration;
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
        scale(element, 500, 1.4);
        setTimeout(() => {
            scale(element, 500, 1);
        }, 500);
        const intervalId = setInterval(() => {
            scale(element, 500, 1.4);
            setTimeout(() => {
                scale(element, 500, 1);
            }, 500);
        }, 1000);
        return {
            stop: () => clearInterval(intervalId)
        };
    }

    // Служебные функции для сброса состояний анимаций

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
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

    // Обработка для сердцебиения: если уже запущено, останавливаем перед запуском новой анимации
    let heartBeatController = null;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            if (heartBeatController) {
                heartBeatController.stop();
            }
            heartBeatController = instance.heartBeating(block);
        });
    
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (heartBeatController) {
                heartBeatController.stop();
                heartBeatController = null;
            }
        });
}
