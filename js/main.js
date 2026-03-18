// Main script file

document.addEventListener('DOMContentLoaded', function() {
    if (window.__websiteMainInitialized) {
        return;
    }
    window.__websiteMainInitialized = true;

    console.log('Site loaded');
    
    // Set active nav state
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('header nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.style.opacity = '0.5';
        }
    });

    initShuffleTextAnimations();
});

function initShuffleTextAnimations() {
    const targets = document.querySelectorAll('[data-shuffle-text]');

    const config = {
        shuffleDirection: 'up',
        duration: 0.95,
        shuffleTimes: 2,
        stagger: 0.02,
        triggerOnHover: false,
        loop: true,
        loopDelay: 1
    };

    targets.forEach((target) => {
        setupShuffleText(target, config);
    });
}

function setupShuffleText(target, config) {
    const originalText = (target.textContent || '').trim();
    if (!originalText) {
        return;
    }

    target.dataset.originalText = originalText;

    const play = () => runShuffleAnimation(target, config);

    play();

    if (config.loop) {
        const durationMs = config.duration * 1000;
        const staggerMs = config.stagger * 1000;
        const cycleMs = durationMs + ((originalText.length - 1) * staggerMs) + (config.loopDelay * 1000);
        window.setInterval(play, cycleMs);
    }

    if (config.triggerOnHover) {
        target.addEventListener('mouseenter', play);
    }
}

function runShuffleAnimation(target, config) {
    const text = target.dataset.originalText || '';
    const chars = Array.from(text);
    const durationMs = config.duration * 1000;
    const staggerMs = config.stagger * 1000;

    target.innerHTML = '';

    chars.forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'shuffle-char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        target.appendChild(span);

        const delay = index * staggerMs;
        window.setTimeout(() => {
            animateChar(span, char, config, durationMs);
        }, delay);
    });
}

function animateChar(span, finalChar, config, durationMs) {
    const randomPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const revealSteps = Math.max(1, config.shuffleTimes * 10);
    const frameInterval = Math.max(16, Math.floor(durationMs / revealSteps));

    span.style.opacity = '0';
    span.style.transform = config.shuffleDirection === 'up' ? 'translateY(0.75em)' : 'translateY(-0.75em)';

    let step = 0;
    const shuffler = window.setInterval(() => {
        if (finalChar === ' ') {
            span.textContent = '\u00A0';
        } else {
            span.textContent = randomPool[Math.floor(Math.random() * randomPool.length)];
        }

        step += 1;
        if (step >= revealSteps) {
            window.clearInterval(shuffler);
            span.textContent = finalChar === ' ' ? '\u00A0' : finalChar;
        }
    }, frameInterval);

    const fromY = config.shuffleDirection === 'up' ? '0.75em' : '-0.75em';

    if (window.gsap) {
        window.gsap.fromTo(
            span,
            {
                y: fromY,
                opacity: 0
            },
            {
                y: '0em',
                opacity: 1,
                duration: config.duration,
                ease: 'power2.out'
            }
        );
        return;
    }

    span.animate(
        [
            {
                transform: 'translateY(' + fromY + ')',
                opacity: 0
            },
            {
                transform: 'translateY(0)',
                opacity: 1
            }
        ],
        {
            duration: durationMs,
            easing: 'cubic-bezier(0.2, 0.65, 0.2, 1)',
            fill: 'forwards'
        }
    );
}
