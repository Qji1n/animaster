function animaster() {
    const _steps = [];

    // Вспомогательная функция для формирования строки transform
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

    // Элементарные анимации

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

    function addMove(duration, translation) {
        _steps.push(new animeStep('move', duration, translation));
        return this;
    }
    function addFadeIn(duration) {
        _steps.push(new animeStep('fadeIn', duration));
        return this;
    }
    function addFadeOut(duration) {
        _steps.push(new animeStep('fadeOut', duration));
        return this;
    }
    function addScale(duration, ratio) {
        _steps.push(new animeStep('scale', duration, ratio));
        return this;
    }

    function addDelay(duration) {
        _steps.push(new animeStep('delay', duration));
        return this;
    }

    function play(element, cycled = false) {
        const steps = _steps.slice();
        _steps.length = 0;
        let timeoutIds = [];
        let stopped = false;
        const initialState = element.classList.contains('hide') ? 'hide' : 'show';

        function runSteps() {
            let time = 0;
            for (const step of steps) {
                const id = setTimeout(() => {
                    if (stopped) return;
                    switch (step.operation) {
                        case 'move':
                            move(element, step.duration, step.params[0]);
                            break;
                        case 'fadeIn':
                            fadeIn(element, step.duration);
                            break;
                        case 'fadeOut':
                            fadeOut(element, step.duration);
                            break;
                        case 'scale':
                            scale(element, step.duration, step.params[0]);
                            break;
                        case 'delay':
                            // Задержка — ничего не делаем
                            break;
                    }
                }, time);
                timeoutIds.push(id);
                time += step.duration;
            }
            if (cycled && !stopped) {
                const id = setTimeout(() => {
                    runSteps();
                }, time);
                timeoutIds.push(id);
            }
        }
        runSteps();

        return {
            stop: () => {
                stopped = true;
                timeoutIds.forEach(id => clearTimeout(id));
            },
            reset: () => {
                stopped = true;
                timeoutIds.forEach(id => clearTimeout(id));
                timeoutIds = [];
                resetMoveAndScale(element);
                if (initialState === 'hide') {
                    resetFadeIn(element);
                } else {
                    resetFadeOut(element);
                }
            }
        };
    }

    // Сложные анимации через цепочку методов

    function moveAndHide(element, duration) {
        return this.addMove(duration * 2/5, { x: 100, y: 20 })
                   .addFadeOut(duration * 3/5)
                   .play(element);
    }

    function showAndHide(element, duration) {
        return this.addFadeIn(duration / 3)
                   .addDelay(duration / 3)
                   .addFadeOut(duration / 3)
                   .play(element);
    }

    function heartBeating(element) {
        return this.addScale(500, 1.4)
                   .addScale(500, 1)
                   .play(element, true); 
    }

    return {
        fadeIn,
        fadeOut,
        move,
        scale,
        addMove,
        addFadeIn,
        addFadeOut,
        addScale,
        addDelay,
        play,
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
            instance.addFadeIn(5000).play(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            instance.addFadeOut(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            instance.addMove(1000, { x: 100, y: 10 }).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            instance.addScale(1000, 1.25).play(block);
        });

    // Сложная анимация moveAndHide
    let moveAndHideController = null;
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            if (moveAndHideController) {
                moveAndHideController.stop();
            }
            moveAndHideController = instance.moveAndHide(block, 5000);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            if (moveAndHideController) {
                moveAndHideController.reset();
                moveAndHideController = null;
            } else {
                resetMoveAndScale(block);
                if (block.classList.contains('hide')) {
                    resetFadeIn(block);
                } else {
                    resetFadeOut(block);
                }
            }
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            instance.showAndHide(block, 3000);
        });

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
                heartBeatController.reset();
                heartBeatController = null;
            }
        });
}

function resetMoveAndScale(element) {
    element.style.transitionDuration = null;
    element.style.transform = null;
}
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

class animeStep {
    constructor(operation, duration, ...params) {
        this.operation = operation;
        this.duration = duration;
        this.params = params;
    }
}
