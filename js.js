window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded');
    
    // Fetch data from data.json
    let data;
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        data = await response.json();
        console.log('Data loaded from data.json:', data);
    } catch (error) {
        console.error('Error loading data:', error);
        return;
    }
    
    // Get current page from URL hash or default to portfolio1
    let currentPageId = window.location.hash.substring(1) || 'portfolio1';
    console.log('Current page ID:', currentPageId);
    
    // Populate navbar
    const navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) {
        console.error('Navbar container not found');
        return;
    }
    
    if (data.navbar && data.navbar.length > 0) {
        data.navbar.forEach(item => {
            const button = document.createElement('button');
            button.className = 'btn btn-outline-success mr-2';
            button.type = 'button';
            button.textContent = item.text;
            
            // Set up click handler for navigation
            button.onclick = () => {
                const targetPageId = item.link.substring(1); // Remove the # from the link
                loadPage(targetPageId);
                window.location.hash = targetPageId;
            };
            
            navbarContainer.appendChild(button);
        });
    }

    // Set portrait
    const portrait = document.getElementById('portrait');
    if (!portrait) {
        console.error('Portrait element not found');
        return;
    }
    
    if (data.portrait) {
        portrait.src = data.portrait.src;
        portrait.alt = data.portrait.alt;
        console.log('Portrait set to:', data.portrait.src);
    }

    // Function to load page content
    function loadPage(pageId) {
        console.log('Loading page:', pageId);
        
        // Get the page data
        const pageData = data.pages[pageId];
        if (!pageData) {
            console.error('Page not found:', pageId);
            return;
        }
        
        // Populate portfolio
        const portfolioContainer = document.getElementById('portfolio-container');
        if (!portfolioContainer) {
            console.error('Portfolio container not found');
            return;
        }
        
        // Clear existing portfolio
        portfolioContainer.innerHTML = '';
        
        if (pageData.portfolio && pageData.portfolio.length > 0) {
            pageData.portfolio.forEach(item => {
                const img = document.createElement('img');
                img.className = 'img';
                img.src = item.src;
                img.alt = item.alt;
                portfolioContainer.appendChild(img);
                console.log('Added portfolio image:', item.src);
            });
        }

        // Set about text
        const textContainer = document.getElementById('text');
        if (!textContainer) {
            console.error('Text container not found');
            return;
        }
        
        // Clear existing text
        textContainer.innerHTML = '';
        
        if (pageData.about && pageData.about.text) {
            const paragraph = document.createElement('p');
            paragraph.textContent = pageData.about.text;
            textContainer.appendChild(paragraph);
            console.log('About text set');
        }

        // Apply the layout logic
        applyLayoutLogic();
    }
    
    // Function to apply layout logic
    function applyLayoutLogic() {
        let allImages = [...document.querySelectorAll('.img')].filter(img => img.id !== 'portrait');
        console.log('All images found:', allImages.length);
        
        if (allImages.length > 0) {
            let mainBody = document.getElementById('main-body');
            if (!mainBody) {
                console.error('Main body element not found');
                return;
            }

            let mainBodyRect = mainBody.getBoundingClientRect();
            let mainBodyHeight = mainBodyRect.height;
            let topOffset = mainBodyRect.top + window.scrollY;

            let imageHeight = allImages[0].offsetHeight;
            let portraitHeight = portrait.offsetHeight;

            portrait.style.top = topOffset + (mainBodyHeight - portraitHeight) / 2 + 'px';

            let stAngle = -allImages.length * 8;
            let endAngl = allImages.length * 8;

            let stPos = topOffset + mainBodyHeight / 2 - imageHeight - 100;
            let endPos = topOffset + mainBodyHeight / 2 + imageHeight - 100;

            allImages.forEach((img, index) => {
                let rotation = stAngle + (index * (endAngl - stAngle) / (allImages.length - 1));
                let position = stPos + (index * (endPos - stPos) / (allImages.length - 1));

                img.style.top = position + 'px';
                img.style.left = '11rem';
                img.style.rotate = rotation + 'deg';
            });

            let portraitTop = portrait.getBoundingClientRect().top + window.scrollY;
            let mainBodyTop = mainBody.getBoundingClientRect().top + window.scrollY;
            let distanceFromMainBodyTop = portraitTop - mainBodyTop;

            portrait.addEventListener('click', () => {
                allImages.forEach((img) => {
                    console.log('Portrait clicked');
                    img.style.position = 'static';
                    img.style.rotate = '0deg';
                    img.style.marginLeft = '2rem';
                    img.style.marginBottom = '2rem';
                });

                let flexbox = document.querySelector('.flexbox');
                if (flexbox) {
                    flexbox.style.height = 'min-content';
                    flexbox.style.marginTop = distanceFromMainBodyTop + 'px';
                }

                let container = document.querySelector('.my-container');
                if (container) {
                    container.style.width = 'inherit';
                }

                let text = document.getElementById('text');
                if (text) {
                    text.style.marginTop = '3rem';
                    text.style.maxWidth = '40rem';
                    text.style.marginLeft = 'auto';
                    text.style.marginRight = 'auto';
                }
            });
        } else {
            console.warn('No images found to apply layout');
        }
    }
    
    // Listen for hash changes to handle browser back/forward navigation
    window.addEventListener('hashchange', () => {
        const newPageId = window.location.hash.substring(1) || 'portfolio1';
        loadPage(newPageId);
    });
    
    // Load initial page
    loadPage(currentPageId);
});
