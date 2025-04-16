window.addEventListener('DOMContentLoaded', async () => {
    // Fetch data from data.json
    let data;
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        data = await response.json();
    } catch (error) {
        console.error('Error loading data:', error);
        return;
    }
    
    // Get current page from URL hash or default to portfolio1
    let currentPageId = window.location.hash.substring(1) || 'portfolio1';
    
    // Track if portrait has been clicked
    let portraitClicked = false;
    
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
                // Reset portrait clicked state when changing pages
                portraitClicked = false;
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
    }

    // Function to load page content
    function loadPage(pageId) {
        // Get the page data
        const pageData = data.pages[pageId];
        if (!pageData) {
            console.error('Page not found:', pageId);
            return;
        }
        
        // Handle the creator page differently
        if (pageId === 'creator') {
            // Hide the portfolio container and portrait for the creator page
            const portfolioContainer = document.getElementById('portfolio-container');
            if (portfolioContainer) {
                portfolioContainer.innerHTML = '';
                portfolioContainer.style.display = 'none';
            }
            
            if (portrait) {
                portrait.style.display = 'none';
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
                paragraph.style.fontSize = '1.2rem';
                paragraph.style.lineHeight = '1.6';
                paragraph.style.maxWidth = '800px';
                paragraph.style.margin = '2rem auto';
                paragraph.style.padding = '2rem';
                paragraph.style.backgroundColor = '#f8f9fa';
                paragraph.style.borderRadius = '8px';
                paragraph.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                textContainer.appendChild(paragraph);
            }
            
            return;
        }
        
        // For portfolio pages, show the portfolio container and portrait
        const portfolioContainer = document.getElementById('portfolio-container');
        if (portfolioContainer) {
            portfolioContainer.style.display = 'block';
        }
        
        if (portrait) {
            portrait.style.display = 'block';
        }
        
        // Populate portfolio
        if (!portfolioContainer) {
            console.error('Portfolio container not found');
            return;
        }
        
        // Clear existing portfolio
        portfolioContainer.innerHTML = '';
        
        if (pageData.portfolio && pageData.portfolio.length > 0) {
            pageData.portfolio.forEach(item => {
                // Create a link element
                const link = document.createElement('a');
                link.href = item.link || '#';
                link.target = '_blank'; // Open in a new tab
                
                // Create the image element
                const img = document.createElement('img');
                img.className = 'img';
                img.src = item.src;
                img.alt = item.alt;
                
                // Add the image to the link
                link.appendChild(img);
                
                // Add the link to the portfolio container
                portfolioContainer.appendChild(link);
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
        }

        // Apply the layout logic
        applyLayoutLogic();
    }
    
    // Function to apply layout logic
    function applyLayoutLogic() {
        let allImages = [...document.querySelectorAll('.img')].filter(img => img.id !== 'portrait');
        
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

                // Apply styles to the parent link element
                const link = img.parentElement;
                if (link && link.tagName === 'A') {
                    link.style.position = 'absolute';
                    link.style.top = position + 'px';
                    link.style.left = '11rem';
                    link.style.transform = `rotate(${rotation}deg)`;
                    link.style.display = 'block';
                    link.style.textDecoration = 'none';
                } else {
                    img.style.top = position + 'px';
                    img.style.left = '11rem';
                    img.style.rotate = rotation + 'deg';
                }
            });

            let portraitTop = portrait.getBoundingClientRect().top + window.scrollY;
            let mainBodyTop = mainBody.getBoundingClientRect().top + window.scrollY;
            let distanceFromMainBodyTop = portraitTop - mainBodyTop;

            // Remove any existing click event listeners from portrait
            const newPortrait = portrait.cloneNode(true);
            portrait.parentNode.replaceChild(newPortrait, portrait);
            
            // Add click event listener to the new portrait element
            newPortrait.addEventListener('click', () => {
                portraitClicked = true;
                allImages.forEach((img) => {
                    const link = img.parentElement;
                    if (link && link.tagName === 'A') {
                        link.style.position = 'static';
                        link.style.transform = 'rotate(0deg)';
                        link.style.marginLeft = '2rem';
                        link.style.marginBottom = '2rem';
                    } else {
                        img.style.position = 'static';
                        img.style.rotate = '0deg';
                        img.style.marginLeft = '2rem';
                        img.style.marginBottom = '2rem';
                    }
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
        }
    }
    
    // Listen for hash changes to handle browser back/forward navigation
    window.addEventListener('hashchange', () => {
        const newPageId = window.location.hash.substring(1) || 'portfolio1';
        // Reset portrait clicked state when changing pages
        portraitClicked = false;
        loadPage(newPageId);
    });
    
    // Load initial page
    loadPage(currentPageId);
});
