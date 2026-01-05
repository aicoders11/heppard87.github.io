document.addEventListener('DOMContentLoaded', () => {
    // 1. Centralized Logic: Merged the two listeners into one
    
    // --- Smooth scrolling for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Safety Check: Prevent errors if href is just "#" or invalid
            if (targetId === '#' || !targetId) return; 
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll-triggered animations ---
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Performance: Stop watching the element once it has been revealed
                observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('reveal');
        observer.observe(section);
    });

    // --- Card Flip Logic ---
    const cards = document.querySelectorAll('.feature-item');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('is-flipped');
        });
    });
});
