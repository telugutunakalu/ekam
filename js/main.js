/**
 * EKAM Website - Main JavaScript
 * Vanilla JS - No dependencies
 */

(function() {
    'use strict';

    // ========== DOM ELEMENTS ==========
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const scrollTopBtn = document.getElementById('scroll-top');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox__image');
    const lightboxClose = document.querySelector('.lightbox__close');
    const lightboxPrev = document.querySelector('.lightbox__prev');
    const lightboxNext = document.querySelector('.lightbox__next');
    const galleryItems = document.querySelectorAll('.gallery__item');
    const statNumbers = document.querySelectorAll('.stat-card__number');
    const animateElements = document.querySelectorAll('.animate-fade-up');

    // ========== STATE ==========
    let currentGalleryIndex = 0;
    let statsAnimated = false;

    // ========== MOBILE NAVIGATION ==========
    function openNav() {
        navMenu.classList.add('show');
        document.body.classList.add('nav-open');
    }

    function closeNav() {
        navMenu.classList.remove('show');
        document.body.classList.remove('nav-open');
    }

    if (navToggle) {
        navToggle.addEventListener('click', openNav);
    }

    if (navClose) {
        navClose.addEventListener('click', closeNav);
    }

    // Close nav when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeNav();
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('show') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            closeNav();
        }
    });

    // ========== HEADER SCROLL EFFECT ==========
    function handleHeaderScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // ========== SCROLL TO TOP BUTTON ==========
    function handleScrollTopVisibility() {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    }

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========== ACTIVE NAV LINK ON SCROLL ==========
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ========== STATISTICS COUNTER ANIMATION ==========
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const start = 0;
        const startTime = performance.now();

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.floor(start + (target - start) * easedProgress);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(update);
    }

    function handleStatsAnimation(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                statNumbers.forEach(stat => {
                    animateCounter(stat);
                });
            }
        });
    }

    // Set up stats observer
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(handleStatsAnimation, {
            threshold: 0.3
        });
        statsObserver.observe(statsSection);
    }

    // ========== SCROLL ANIMATIONS ==========
    function handleScrollAnimations(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }

    const animationObserver = new IntersectionObserver(handleScrollAnimations, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(element => {
        animationObserver.observe(element);
    });

    // ========== LIGHTBOX ==========
    function openLightbox(index) {
        currentGalleryIndex = index;
        const src = galleryItems[index].getAttribute('data-src');
        lightboxImage.src = src;
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
        lightboxImage.src = '';
    }

    function showPrevImage() {
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
        const src = galleryItems[currentGalleryIndex].getAttribute('data-src');
        lightboxImage.src = src;
    }

    function showNextImage() {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
        const src = galleryItems[currentGalleryIndex].getAttribute('data-src');
        lightboxImage.src = src;
    }

    // Gallery click handlers
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrevImage);
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }

    // Close lightbox on overlay click
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });

    // Touch swipe support for lightbox
    let touchStartX = 0;
    let touchEndX = 0;

    if (lightbox) {
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                showNextImage();
            } else {
                showPrevImage();
            }
        }
    }

    // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== THROTTLE FUNCTION ==========
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ========== SCROLL EVENT LISTENER ==========
    const handleScroll = throttle(() => {
        handleHeaderScroll();
        handleScrollTopVisibility();
        updateActiveNavLink();
    }, 100);

    window.addEventListener('scroll', handleScroll);

    // ========== PRELOADER (Optional) ==========
    window.addEventListener('load', () => {
        // Trigger initial animations for visible elements
        setTimeout(() => {
            animateElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    element.classList.add('animated');
                }
            });
        }, 100);
    });

    // ========== FORM HANDLING (If added later) ==========
    // This is a placeholder for form handling
    // You can add form validation and submission logic here

    // ========== SPONSOR CAROUSEL (Optional Enhancement) ==========
    // Basic infinite scroll for sponsor logos
    function initSponsorCarousel() {
        const sponsorLogos = document.querySelectorAll('.sponsor-tier__logos');

        sponsorLogos.forEach(container => {
            if (container.children.length > 3) {
                // Clone items for infinite scroll
                const items = Array.from(container.children);
                items.forEach(item => {
                    const clone = item.cloneNode(true);
                    container.appendChild(clone);
                });

                // Add CSS animation
                container.style.animation = 'scroll 20s linear infinite';
            }
        });
    }

    // Add scroll animation keyframes dynamically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
    `;
    document.head.appendChild(styleSheet);

    // ========== INITIALIZE ==========
    function init() {
        // Initial header state
        handleHeaderScroll();
        handleScrollTopVisibility();
        updateActiveNavLink();

        // Initialize carousel if needed
        // initSponsorCarousel(); // Uncomment if you want auto-scrolling sponsors

        console.log('EKAM website initialized');
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
