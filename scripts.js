(() => {
    /**
     * Utility function to debounce events.
     * @param {Function} func - Function to debounce.
     * @param {number} wait - Wait time in milliseconds.
     * @param {boolean} immediate - If true, trigger on leading edge.
     * @returns {Function} - Debounced function.
     */
    function debounce(func, wait = 15, immediate = false) {
        let timeout;
        return function (...args) {
            const context = this;
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    /**
     * Function to include HTML components.
     */
    async function includeHTML() {
        console.log("Including HTML components...");
        const elements = document.querySelectorAll('[data-include]');
        const includePromises = Array.from(elements).map(async (el) => {
            const file = el.getAttribute('data-include');
            try {
                const response = await fetch(file);
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${file}: ${response.statusText}`);
                }
                const data = await response.text();
                el.innerHTML = data;
                console.log(`${file} loaded successfully.`);

                // Handle special cases
                if (file === 'components/footer.html') {
                    const currentYearElem = el.querySelector('#current-year');
                    if (currentYearElem) {
                        currentYearElem.textContent = new Date().getFullYear();
                    }
                }
            } catch (error) {
                console.error(`Error loading component "${file}":`, error);
                el.innerHTML = '<p>Sorry, an error occurred while loading this section.</p>';
            }
        });

        await Promise.all(includePromises);
        console.log("All HTML components included.");
        // Initialize functionalities
        initializeBackToTop();
        initializeNavigationToggle();
        initializeDropdowns();
        initializeCarousel(); // If applicable
    }

    /**
     * Back to Top Button Functionality
     */
    function initializeBackToTop() {
        console.log("Initializing Back to Top Button...");
        const backToTopButton = document.getElementById('backToTop');
        if (!backToTopButton) return;

        /**
         * Show or hide the Back to Top button based on scroll position
         */
        function toggleVisibility() {
            const scrollPosition = window.scrollY || document.documentElement.scrollTop;
            if (scrollPosition > 200) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }

        /**
         * Scroll smoothly to the top when the button is clicked
         */
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Attach event listeners
        window.addEventListener('scroll', debounce(toggleVisibility));
        backToTopButton.addEventListener('click', scrollToTop);
    }

    /**
     * Navigation Menu Toggle Functionality
     */
    function initializeNavigationToggle() {
        console.log("Initializing Navigation Toggle...");
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');

        if (!hamburger || !navMenu) return;

        /**
         * Toggle the navigation menu's active state
         */
        function toggleMenu() {
            const isActive = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
            navMenu.setAttribute('aria-hidden', !isActive);
            console.log(`Menu toggled. Active: ${isActive}`);
        }

        // Attach event listener to hamburger button
        hamburger.addEventListener('click', toggleMenu);

        /**
         * Close the navigation menu when clicking outside of it
         */
        function closeMenuOnClickOutside(e) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', false);
                    navMenu.setAttribute('aria-hidden', true);
                    console.log("Menu closed by clicking outside.");
                }
            }
        }

        // Attach event listener to the document
        document.addEventListener('click', closeMenuOnClickOutside);

        /**
         * Reset menu states on window resize
         */
        function resetMenuOnResize() {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', false);
                navMenu.setAttribute('aria-hidden', true);
                console.log("Menu reset on window resize.");
            }
        }

        // Attach event listener to window resize
        window.addEventListener('resize', debounce(resetMenuOnResize));
    }

    /**
     * Dropdown Menu Functionality within the Header
     */
    function initializeDropdowns() {
        console.log("Initializing Dropdowns...");
        const dropdownItems = document.querySelectorAll('.nav-item.dropdown');

        if (!dropdownItems.length) return;

        dropdownItems.forEach((item) => {
            const dropdownToggle = item.querySelector('.dropdown-toggle');
            const dropdownMenu = item.querySelector('.dropdown-menu');

            if (!dropdownToggle || !dropdownMenu) return;

            /**
             * Toggle dropdown on click for mobile devices
             */
            dropdownToggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const isActive = item.classList.toggle('active');
                    dropdownMenu.classList.toggle('active');
                    dropdownToggle.setAttribute('aria-expanded', isActive);
                    console.log(`Dropdown toggled. Active: ${isActive}`);
                }
            });

            /**
             * Show dropdown on hover for desktop devices
             */
            item.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) {
                    dropdownMenu.classList.add('active');
                    dropdownToggle.setAttribute('aria-expanded', true);
                    console.log("Dropdown shown on hover.");
                }
            });

            /**
             * Hide dropdown on mouse leave for desktop devices
             */
            item.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    dropdownMenu.classList.remove('active');
                    dropdownToggle.setAttribute('aria-expanded', false);
                    console.log("Dropdown hidden on mouse leave.");
                }
            });

            /**
             * Accessibility: Toggle dropdown with keyboard
             */
            dropdownToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const isActive = item.classList.toggle('active');
                    dropdownMenu.classList.toggle('active');
                    dropdownToggle.setAttribute('aria-expanded', isActive);
                    console.log(`Dropdown toggled via keyboard. Active: ${isActive}`);
                }
            });
        });

        /**
         * Close all dropdowns when clicking outside
         */
        function closeDropdownsOnClickOutside(e) {
            dropdownItems.forEach((item) => {
                if (!item.contains(e.target)) {
                    item.classList.remove('active');
                    const dropdownToggle = item.querySelector('.dropdown-toggle');
                    const dropdownMenu = item.querySelector('.dropdown-menu');
                    if (dropdownToggle && dropdownMenu) {
                        dropdownToggle.setAttribute('aria-expanded', false);
                        dropdownMenu.classList.remove('active');
                        console.log("Dropdown closed by clicking outside.");
                    }
                }
            });
        }

        // Attach event listener to the document
        document.addEventListener('click', closeDropdownsOnClickOutside);

        /**
         * Reset dropdown states on window resize
         */
        function resetDropdownsOnResize() {
            dropdownItems.forEach((item) => {
                const dropdownToggle = item.querySelector('.dropdown-toggle');
                const dropdownMenu = item.querySelector('.dropdown-menu');
                item.classList.remove('active');
                if (dropdownToggle && dropdownMenu) {
                    dropdownToggle.setAttribute('aria-expanded', false);
                    dropdownMenu.classList.remove('active');
                }
            });
            console.log("Dropdowns reset on window resize.");
        }

        // Attach event listener to window resize
        window.addEventListener('resize', debounce(resetDropdownsOnResize));
    }

    /**
     * Initialize Carousel Functionality (if applicable)
     * Assuming you're using Bootstrap's Carousel, ensure it's correctly initialized.
     */
    function initializeCarousel() {
        console.log("Initializing Carousel...");
        const carousel = document.querySelector('#header-carousel');
        if (!carousel) {
            console.log("Carousel not found.");
            return;
        }

        const carouselItems = carousel.querySelectorAll('.carousel-item');

        carousel.addEventListener('slide.bs.carousel', function (event) {
            // Remove animation classes from all captions
            carouselItems.forEach((item) => {
                const captionDiv = item.querySelector('.carousel-caption > div');
                if (captionDiv) {
                    captionDiv.classList.remove('animate__animated', 'animate__bounceInDown', 'animate__zoomIn', 'animate__slideInLeft', 'animate__slideInRight');
                    console.log("Animation classes removed from caption.");
                }
            });
        });

        carousel.addEventListener('slid.bs.carousel', function (event) {
            // Add animation classes to the active slide's caption
            const activeItem = carousel.querySelector('.carousel-item.active');
            const captionDiv = activeItem.querySelector('.carousel-caption > div');
            if (captionDiv) {
                captionDiv.classList.add('animate__animated', 'animate__bounceInDown', 'animate__zoomIn', 'animate__slideInLeft', 'animate__slideInRight');
                console.log("Animation classes added to active caption.");
            }
        });

        // Initialize animations for the first slide
        const firstCaptionDiv = carouselItems[0].querySelector('.carousel-caption > div');
        if (firstCaptionDiv) {
            firstCaptionDiv.classList.add('animate__animated', 'animate__bounceInDown', 'animate__zoomIn', 'animate__slideInLeft', 'animate__slideInRight');
            console.log("Animation classes added to first caption.");
        }
    }

    /**
     * Initialize all functionalities when DOM is fully loaded
     */
    document.addEventListener('DOMContentLoaded', () => {
        includeHTML();
    });
})();
