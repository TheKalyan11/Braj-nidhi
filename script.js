window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Simple animation for the reserve button
const reserveBtn = document.querySelector('.btn-reserve');
if (reserveBtn) {
    reserveBtn.addEventListener('click', () => {
        reserveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        setTimeout(() => {
            reserveBtn.innerHTML = 'Reservation Sent!';
            reserveBtn.style.background = '#2ecc71';
            reserveBtn.style.color = '#fff';
        }, 1500);
    });
}

// Intersection Observer for Stats Section
const statsContainer = document.querySelector('.stats-container');
const counters = document.querySelectorAll('.counter');
let animated = false;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
            statsContainer.classList.add('animate-up');
            
            counters.forEach(counter => {
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const isDecimal = counter.getAttribute('data-decimal') === 'true';
                    const count = +counter.innerText;
                    
                    const inc = target / 50; 

                    if(count < target) {
                        if (isDecimal) {
                            counter.innerText = (count + inc).toFixed(1);
                        } else {
                            counter.innerText = Math.ceil(count + inc);
                        }
                        setTimeout(updateCount, 30);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
            animated = true;
        }
    });
}, { threshold: 0.3 });

if (statsContainer) {
    observer.observe(statsContainer);
}

// Initialize Swiper for Gallery
document.addEventListener('DOMContentLoaded', () => {
    const swiper = new Swiper('.gallery-slider', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: true,
        },
        navigation: {
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
        },
    });

    // Initialize Swiper for Testimonials
    const testimonialSwiper = new Swiper('.testimonials-slider', {
        slidesPerView: 'auto',
        spaceBetween: 24,
        loop: true,
        autoplay: {
            delay: 1000,
            disableOnInteraction: false,
        },
        grabCursor: true,
    });

    // FAQ Toggle Logic
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items (optional, but clean)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });
});
