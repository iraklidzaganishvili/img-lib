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
    
    // Populate navbar
    const navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) {
        console.error('Navbar container not found');
        return;
    }
    
    if (data.navbar && data.navbar.length > 0) {
        data.navbar.forEach((item, index) => {
            const button = document.createElement('button');
            button.className = 'btn btn-outline-success mr-2';
            button.type = 'button';
            button.textContent = item.text;
            
            // Instead of redirecting, change the images when button is clicked
            button.onclick = () => {
                console.log(`Navbar button ${index} clicked`);
                
                // Clear existing portfolio images
                const portfolioContainer = document.getElementById('portfolio-container');
                if (portfolioContainer) {
                    portfolioContainer.innerHTML = '';
                }
                
                // Load new images based on the button clicked
                if (index === 0) {
                    // First button - load original portfolio images
                    if (data.portfolio && data.portfolio.length > 0) {
                        data.portfolio.forEach(item => {
                            const img = document.createElement('img');
                            img.className = 'img';
                            img.src = item.src;
                            img.alt = item.alt;
                            portfolioContainer.appendChild(img);
                        });
                    }
                } else if (index === 1) {
                    // Second button - load alternative images or different layout
                    // You can customize this section to load different images or change the layout
                    if (data.portfolio && data.portfolio.length > 0) {
                        // For example, load the same images but in a different order
                        const reversedPortfolio = [...data.portfolio].reverse();
                        reversedPortfolio.forEach(item => {
                            const img = document.createElement('img');
                            img.className = 'img';
                            img.src = item.src;
                            img.alt = item.alt;
                            portfolioContainer.appendChild(img);
                        });
                    }
                }
                
                // Reapply the layout logic
                applyLayoutLogic();
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

    // Populate portfolio
    const portfolioContainer = document.getElementById('portfolio-container');
    if (!portfolioContainer) {
        console.error('Portfolio container not found');
        return;
    }
    
    if (data.portfolio && data.portfolio.length > 0) {
        data.portfolio.forEach(item => {
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
    
    if (data.about && data.about.text) {
        const paragraph = document.createElement('p');
        paragraph.textContent = data.about.text;
        textContainer.appendChild(paragraph);
        console.log('About text set');
    }

    // Apply the layout logic
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

            allImages.forEach(img => {
                img.addEventListener('click', () => {
                    console.log('Image clicked');
                    const carousel = document.getElementById('carousel-section');
                    if (carousel) {
                        carousel.classList.remove('hidden-el');
                    }
                });
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
    
    // Apply initial layout
    applyLayoutLogic();
});
