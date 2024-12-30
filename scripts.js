(() => {
    /**
     * Function to include HTML components dynamically.
     */
    async function includeHTML() {
        console.log("Including HTML components...");
        const elements = document.querySelectorAll('[data-include]');

        for (const el of elements) {
            const file = el.getAttribute('data-include');
            try {
                const response = await fetch(file);
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${file}: ${response.statusText}`);
                }
                const data = await response.text();
                el.outerHTML = data; // Replace the placeholder with the included content
                console.log(`Loaded: ${file}`);
            } catch (error) {
                console.error(`Error loading ${file}:`, error);
                el.innerHTML = `<p>Error loading content from ${file}</p>`;
            }
        }

        console.log("All HTML components included.");
        initializeAllFeatures();
    }

    /**
     * Initialize additional features after HTML inclusion.
     */
    function initializeAllFeatures() {
        initializeBackToTop();
        initializeNavigationToggle();
        initializeDropdowns();
        initializeCarousel();
    }

    // Define other feature initialization functions as in your original code.
    function initializeBackToTop() {
        // Back to top button logic...
    }

    function initializeNavigationToggle() {
        // Navigation toggle logic...
    }

    function initializeDropdowns() {
        // Dropdown logic...
    }

    function initializeCarousel() {
        // Carousel logic...
    }

    // Initialize components when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', includeHTML);
})();
