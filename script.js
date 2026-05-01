document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Image Loading Optimization
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });
    
    // Custom Cursor Movement
    const cursor = document.querySelector('.cursor-follower');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        const interactives = document.querySelectorAll('a, button, .feature-card, .screenshot-card');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.style.transform = 'scale(4)');
            el.addEventListener('mouseleave', () => cursor.style.transform = 'scale(1)');
        });
    }

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navContainer = document.querySelector('.nav-container');
    const navLinksList = document.querySelectorAll('.nav-links a');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            navContainer.classList.toggle('open');
            document.body.style.overflow = navContainer.classList.contains('open') ? 'hidden' : 'auto';
        });
    }

    // Close menu when links are clicked
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('open');
            navContainer.classList.remove('open');
            document.body.style.overflow = 'auto';
        });
    });

    // Sticky Header
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Reveal on Scroll Animation
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve after animation to prevent re-triggering if desired
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Add staggered delay to feature cards if they don't have it
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Section Tracking (Scroll Spy)
    const sections = document.querySelectorAll('section[id]');
    
    const updateActiveLink = () => {
        let currentSectionId = '';
        const scrollPos = window.scrollY + 100; // Offset for header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Initial check

    // Drag to scroll for screenshots
    const sliders = document.querySelectorAll('.screenshots-scroll');
    sliders.forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active-scroll');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active-scroll');
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active-scroll');
        });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed
            slider.scrollLeft = scrollLeft - walk;
        });
    });

    // Features Carousel Smooth Auto-next
    const track = document.querySelector('.carousel-track');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    let autoPlayInterval;

    const moveNext = () => {
        currentIndex = (currentIndex + 1) % dots.length;
        const itemWidth = track.querySelector('.carousel-item').offsetWidth + 30; // width + gap
        track.scrollTo({
            left: currentIndex * itemWidth,
            behavior: 'smooth'
        });
        updateDots(currentIndex);
    };

    const updateDots = (index) => {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    };

    const startAutoPlay = () => {
        autoPlayInterval = setInterval(moveNext, 3500);
    };

    if (track) {
        startAutoPlay();
        
        // Pause on interaction
        track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        track.addEventListener('mouseleave', startAutoPlay);
        
        // Manual dot clicking
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                currentIndex = i;
                const itemWidth = track.querySelector('.carousel-item').offsetWidth + 30;
                track.scrollTo({ left: i * itemWidth, behavior: 'smooth' });
                updateDots(i);
                clearInterval(autoPlayInterval);
                startAutoPlay();
            });
        });

        // Sync dots on manual scroll
        let isScrolling;
        track.addEventListener('scroll', () => {
            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(() => {
                const itemWidth = track.querySelector('.carousel-item').offsetWidth + 30;
                const newIndex = Math.round(track.scrollLeft / itemWidth);
                if (newIndex !== currentIndex) {
                    currentIndex = newIndex;
                    updateDots(currentIndex);
                }
            }, 100);
        });
    }
});
