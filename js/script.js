// Menü-Filter-Funktionalität
document.addEventListener('DOMContentLoaded', function() {
    // Initial animation for menu items
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach((item, index) => {
        // Set initial state
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        // Trigger animation with delay based on index
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100 * index);
    });
    
    // Menu filtering
    const categoryButtons = document.querySelectorAll('.category-button');
    const allMenuItems = document.querySelectorAll('.menu-item');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Reset animation for all items first
            allMenuItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
            });
            
            // Filter items and animate them
            allMenuItems.forEach((item, index) => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'flex';
                    
                    // Staggered animation for visible items
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100 * index);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Fallback for missing images
    const menuItemImages = document.querySelectorAll('.menu-item-image img');
    menuItemImages.forEach(img => {
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/150x150/f8f8f8/333333?text=Gericht';
            this.alt = 'Bildplatzhalter';
        };
    });
    
    // Search functionality
    const searchInput = document.getElementById('menu-search-input');
    const searchButton = document.getElementById('menu-search-button');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        // If search field is empty, show all items
        if (searchTerm === '') {
            // Reset menu items and show all
            allMenuItems.forEach((item, index) => {
                item.style.display = 'flex';
                
                // Staggered animation
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50 * index);
            });
            
            return;
        }
        
        // Hide all items first
        allMenuItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.display = 'none';
        });
        
        // Find matching items
        let visibleIndex = 0;
        allMenuItems.forEach(item => {
            const itemName = item.querySelector('h4').textContent.toLowerCase();
            const itemDescription = item.querySelector('.menu-item-description').textContent.toLowerCase();
            const itemTags = item.getAttribute('data-tags')?.toLowerCase() || '';
            
            if (itemName.includes(searchTerm) || itemDescription.includes(searchTerm) || itemTags.includes(searchTerm)) {
                item.style.display = 'flex';
                
                // Staggered animation for visible items
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100 * visibleIndex);
                
                visibleIndex++;
            }
        });
    }
    
    // Event listeners for search
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Allergen tooltips
    const allergenTags = document.querySelectorAll('.allergen-tag');
    const allergenLegend = document.querySelector('.allergen-legend');
    
    allergenTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            const code = this.textContent;
            const legendItem = allergenLegend.querySelector(`.allergen-item:has(.allergen-code:contains('${code}'))`);
            
            if (legendItem) {
                legendItem.style.fontWeight = 'bold';
                legendItem.style.backgroundColor = '#fffde7';
            }
        });
        
        tag.addEventListener('mouseleave', function() {
            const code = this.textContent;
            const legendItem = allergenLegend.querySelector(`.allergen-item:has(.allergen-code:contains('${code}'))`);
            
            if (legendItem) {
                legendItem.style.fontWeight = 'normal';
                legendItem.style.backgroundColor = 'transparent';
            }
        });
    });

    // Simpler tooltip implementation since :has and :contains selectors might not be supported in all browsers
    allergenTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            const code = this.textContent;
            const allergenText = getAllergenText(code);
            
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'allergen-tooltip';
            tooltip.textContent = allergenText;
            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = '#333';
            tooltip.style.color = '#fff';
            tooltip.style.padding = '5px 10px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '0.8rem';
            tooltip.style.zIndex = '100';
            tooltip.style.top = `${this.getBoundingClientRect().top - 40}px`;
            tooltip.style.left = `${this.getBoundingClientRect().left}px`;
            
            document.body.appendChild(tooltip);
            
            // Store the tooltip reference on the tag
            this.tooltip = tooltip;
        });
        
        tag.addEventListener('mouseleave', function() {
            if (this.tooltip) {
                document.body.removeChild(this.tooltip);
                this.tooltip = null;
            }
        });
    });
    
    // Helper function to get allergen text based on code
    function getAllergenText(code) {
        const allergenMap = {
            'G': 'Glutenhaltiges Getreide',
            'L': 'Laktose',
            'E': 'Eier',
            'F': 'Fisch',
            'K': 'Krebstiere',
            'N': 'Nüsse',
            'S': 'Soja',
            'V': 'Vegetarisch',
            'VG': 'Vegan'
        };
        
        return allergenMap[code] || `Allergen ${code}`;
    }
}); 