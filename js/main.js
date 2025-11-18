// ==========================================
// TUVALU TOURISM - MAIN JAVASCRIPT
// ==========================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    setupScrollEffects();
    setupCategoryFilters();
    setupFavorites();
    setupModals();
    setupDateInputs();
    setupAnimations();
}

// ==========================================
// SCROLL EFFECTS
// ==========================================
function setupScrollEffects() {
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add shadow to header on scroll
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ==========================================
// CATEGORY FILTERS
// ==========================================
function setupCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter experiences
            const category = this.dataset.category;
            filterExperiences(category);
        });
    });
}

function filterExperiences(category) {
    const cards = document.querySelectorAll('.experience-card');
    
    cards.forEach((card, index) => {
        const cardCategories = card.dataset.category;
        
        if (category === 'all' || cardCategories.includes(category)) {
            // Fade in animation
            setTimeout(() => {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease-out';
            }, index * 50);
        } else {
            card.style.display = 'none';
        }
    });
}

// ==========================================
// FAVORITES
// ==========================================
function setupFavorites() {
    const favoriteButtons = document.querySelectorAll('.card-favorite');
    
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click
            
            this.classList.toggle('active');
            
            // Add animation
            this.style.transform = 'scale(1.3)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            // Update icon
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        });
    });
}

// ==========================================
// SEARCH FUNCTIONALITY
// ==========================================
function searchExperiences() {
    const destination = document.getElementById('destination').value;
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const guests = document.getElementById('guests').value;
    
    // Show loading state
    const searchButton = document.querySelector('.btn-search');
    const originalText = searchButton.textContent;
    searchButton.textContent = 'Zoeken...';
    searchButton.disabled = true;
    
    // Simulate search
    setTimeout(() => {
        searchButton.textContent = originalText;
        searchButton.disabled = false;
        
        // Show results (in real app, this would filter based on search)
        showNotification('Zoekresultaten worden geladen...', 'success');
        
        // Scroll to results
        document.getElementById('experiences').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 1000);
}

// ==========================================
// BOOKING FUNCTIONALITY
// ==========================================
let currentBookingExperience = {};

function bookExperience(experienceName, price) {
    currentBookingExperience = {
        name: experienceName,
        price: price
    };
    
    // Update modal content
    document.getElementById('bookingExperienceName').textContent = experienceName;
    document.getElementById('bookingExperiencePrice').textContent = price;
    
    // Show modal
    showModal('bookingModal');
}

function handleBooking(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('bookingName').value,
        email: document.getElementById('bookingEmail').value,
        date: document.getElementById('bookingDate').value,
        guests: document.getElementById('bookingGuests').value,
        phone: document.getElementById('bookingPhone').value,
        notes: document.getElementById('bookingNotes').value,
        experience: currentBookingExperience.name,
        price: currentBookingExperience.price
    };
    
    // Show loading
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Bezig met boeken...';
    submitButton.disabled = true;
    
    // Simulate booking process
    setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Close modal
        closeModal('bookingModal');
        
        // Show success notification
        showNotification(`Boeking succesvol! Een bevestigingsmail is verzonden naar ${formData.email}`, 'success');
        
        // Reset form
        event.target.reset();
        
        // Show confirmation modal (optional)
        showBookingConfirmation(formData);
    }, 2000);
}

function showBookingConfirmation(data) {
    const confirmationHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 4rem; color: var(--primary-color); margin-bottom: 1rem;">✓</div>
            <h2 style="margin-bottom: 1rem;">Boeking Bevestigd!</h2>
            <p style="color: var(--text-gray); margin-bottom: 2rem;">
                Bedankt voor je boeking, ${data.name}! We hebben een bevestigingsmail gestuurd naar ${data.email}.
            </p>
            <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 8px; text-align: left;">
                <h3 style="margin-bottom: 1rem;">Boekingsdetails:</h3>
                <p><strong>Ervaring:</strong> ${data.experience}</p>
                <p><strong>Datum:</strong> ${formatDate(data.date)}</p>
                <p><strong>Gasten:</strong> ${data.guests}</p>
                <p><strong>Totaal:</strong> ${data.price}</p>
            </div>
            <button onclick="closeModal('confirmationModal')" class="btn-primary" style="margin-top: 2rem; width: 100%;">
                Sluiten
            </button>
        </div>
    `;
    
    // Create and show confirmation modal
    let confirmModal = document.getElementById('confirmationModal');
    if (!confirmModal) {
        confirmModal = document.createElement('div');
        confirmModal.id = 'confirmationModal';
        confirmModal.className = 'modal';
        confirmModal.innerHTML = `<div class="modal-content">${confirmationHTML}</div>`;
        document.body.appendChild(confirmModal);
    } else {
        confirmModal.querySelector('.modal-content').innerHTML = confirmationHTML;
    }
    
    showModal('confirmationModal');
}

// ==========================================
// LOGIN FUNCTIONALITY
// ==========================================
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Show loading
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Inloggen...';
    submitButton.disabled = true;
    
    // Simulate login
    setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        closeModal('loginModal');
        showNotification(`Welkom terug! Je bent ingelogd als ${email}`, 'success');
        
        // Update UI to show logged in state
        updateLoginState(email);
    }, 1500);
}

function updateLoginState(email) {
    const loginButton = document.querySelector('.btn-secondary');
    if (loginButton) {
        loginButton.textContent = email.split('@')[0];
        loginButton.onclick = null; // Remove login handler
    }
}

// ==========================================
// MODAL MANAGEMENT
// ==========================================
function setupModals() {
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
            }
        }
    });
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        // Only unlock scroll if no other modal is open
        setTimeout(() => {
            if (!document.querySelector('.modal.active')) {
                document.body.style.overflow = '';
            }
        }, 100);
    }
}

function showLoginModal() {
    showModal('loginModal');
}

// ==========================================
// DATE INPUTS
// ==========================================
function setupDateInputs() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = ['checkin', 'checkout', 'bookingDate'];
    
    dateInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.setAttribute('min', today);
        }
    });
    
    // Update checkout min date when checkin changes
    const checkin = document.getElementById('checkin');
    const checkout = document.getElementById('checkout');
    
    if (checkin && checkout) {
        checkin.addEventListener('change', function() {
            checkout.setAttribute('min', this.value);
        });
    }
}

// ==========================================
// ANIMATIONS
// ==========================================
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    document.querySelectorAll('.experience-card, .feature, .destination-card').forEach(el => {
        observer.observe(el);
    });
}

// ==========================================
// NOTIFICATIONS
// ==========================================
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary-color)' : '#333'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// EXPERIENCE DETAIL MODAL
// ==========================================
const experiencesData = {
    'snorkelen': {
        id: 'snorkelen',
        name: 'Koraalrif Snorkelen Adventure',
        price: '€45',
        location: 'Funafuti Lagune',
        duration: '3 uur',
        groupSize: 'Max 8 personen',
        rating: 4.8,
        reviews: 245,
        images: [
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&h=600&fit=crop',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&h=600&fit=crop',
            'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=900&h=600&fit=crop',
            'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=900&h=600&fit=crop',
            'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=900&h=600&fit=crop'
        ],
        description: `Duik in de kristalheldere wateren van de Funafuti Lagune en ontdek een onderwater paradijs vol leven en kleur. 
        Deze snorkelervaring brengt je naar de beste spots waar je zwemt tussen honderden tropische vissen, kleurrijke koraalriffen en misschien 
        wel zeeschildpadden spot.`,
        longDescription: `Onze expert lokale gidsen kennen alle geheime plekken en delen hun kennis over het mariene ecosysteem. 
        Je krijgt professionele snorkeluitrusting en een veiligheidsbriefing voordat we vertrekken. De tour is geschikt voor alle niveaus, 
        van beginners tot ervaren snorkelaars.`,
        highlights: [
            'Zwem met tropische vissen',
            'Ontdek kleurrijke koraalriffen',
            'Spot zeeschildpadden',
            'Professionele uitrusting inbegrepen',
            'Expert lokale gids',
            'Kleine groepen voor persoonlijke aandacht'
        ],
        included: [
            'Snorkeluitrusting (masker, snorkel, vinnen)',
            'Zwemvest',
            'Professionele gids',
            'Verfrissingen en water',
            'Verzekering',
            'Hotel pickup (optioneel)'
        ],
        notIncluded: [
            'Lunch',
            'Persoonlijke uitgaven',
            'Foto\'s (kunnen apart gekocht worden)'
        ],
        requirements: [
            'Minimale leeftijd: 8 jaar',
            'Redelijke conditie vereist',
            'Kunnen zwemmen',
            'Niet geschikt voor zwangere vrouwen'
        ],
        reviewsData: {
            5: 180,
            4: 45,
            3: 15,
            2: 3,
            1: 2
        },
        recentReviews: [
            {
                author: 'Sarah Johnson',
                date: '2 weken geleden',
                rating: 5,
                text: 'Absoluut fantastisch! De onderwaterwereld is adembenemend. Onze gids was super kundig en wees ons op alle mooie plekken. We hebben zelfs een zeeschildpad gezien!'
            },
            {
                author: 'Marco de Vries',
                date: '1 maand geleden',
                rating: 5,
                text: 'Geweldige ervaring voor het hele gezin. Onze kinderen (10 en 12) vonden het geweldig. De uitrusting was top en de gids nam echt de tijd voor iedereen.'
            },
            {
                author: 'Emma Peters',
                date: '1 maand geleden',
                rating: 4,
                text: 'Mooie ervaring, het water was kristalhelder. Enige minpunt was dat we wel veel andere toeristen tegenkwamen, maar dat is te verwachten bij populaire spots.'
            }
        ]
    },
    'homestay': {
        id: 'homestay',
        name: 'Traditionele Familie Homestay',
        price: '€65',
        location: 'Nanumea Eiland',
        duration: 'Per nacht',
        groupSize: 'Familie vriendelijk',
        rating: 5.0,
        reviews: 89,
        images: [
            'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=900&h=600&fit=crop',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&h=600&fit=crop',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&h=600&fit=crop',
            'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=900&h=600&fit=crop'
        ],
        description: `Ervaar het authentieke leven op Tuvalu door te verblijven bij een lokale familie op het prachtige eiland Nanumea. 
        Dit is meer dan een accommodatie - het is een culturele uitwisseling en een kans om het dagelijks leven te ervaren.`,
        longDescription: `Je krijgt je eigen comfortabele kamer in een traditioneel huis, inclusief alle basisvoorzieningen. 
        Geniet van heerlijke traditionele maaltijden die worden bereid door je gastfamilie. Leer lokale gebruiken, verhalen en misschien 
        wel een paar woorden Tuvaluaans!`,
        highlights: [
            'Authentieke culturele ervaring',
            'Traditionele maaltijden inbegrepen',
            'Eigen privé kamer',
            'Leer lokale tradities',
            'Maak nieuwe vrienden',
            'Steun directe lokale gemeenschap'
        ],
        included: [
            'Privé slaapkamer',
            'Ontbijt, lunch en diner',
            'Wi-Fi toegang',
            'Handdoeken en beddengoed',
            'Toegang tot gemeenschappelijke ruimtes',
            'Culturele activiteiten'
        ],
        notIncluded: [
            'Transfer van/naar luchthaven',
            'Persoonlijke uitgaven',
            'Extra tours'
        ],
        requirements: [
            'Respectvol gedrag',
            'Open minded houding',
            'Interesse in lokale cultuur'
        ],
        reviewsData: {
            5: 85,
            4: 3,
            3: 1,
            2: 0,
            1: 0
        },
        recentReviews: [
            {
                author: 'Lisa Anderson',
                date: '3 dagen geleden',
                rating: 5,
                text: 'Dit was echt het hoogtepunt van mijn reis! De familie was zo warm en gastvrij. Het eten was heerlijk en ik heb zoveel geleerd over hun cultuur. Aanrader!'
            },
            {
                author: 'Jan Bakker',
                date: '2 weken geleden',
                rating: 5,
                text: 'Onvergetelijke ervaring. Je voelt je meteen deel van de familie. De kinderen namen ons mee naar het strand en leerden ons vissen op traditionele wijze.'
            }
        ]
    },
    'island-hopping': {
        id: 'island-hopping',
        name: 'Eiland Hopping Boot Tour',
        price: '€120',
        location: 'Alle Eilanden',
        duration: 'Hele dag',
        groupSize: 'Max 12 personen',
        rating: 4.9,
        reviews: 312,
        images: [
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=900&h=600&fit=crop',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=600&fit=crop',
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&h=600&fit=crop',
            'https://images.unsplash.com/photo-1540202404-d0c7fe46a087?w=900&h=600&fit=crop',
            'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=900&h=600&fit=crop'
        ],
        description: `Bezoek meerdere paradijselijke eilanden in één dag! Deze boottour brengt je langs de mooiste spots van Tuvalu, 
        van verborgen stranden tot lokale dorpjes waar je de cultuur kunt ervaren.`,
        longDescription: `Start vroeg in de ochtend en vaar langs kristalheldere lagunes, ongerepte stranden en levendige koraalriffen. 
        Stop bij 3-4 verschillende eilanden, met tijd voor zwemmen, snorkelen en verkennen. Geniet van een authentieke BBQ lunch 
        bereid door lokale bewoners op een privéstrand.`,
        highlights: [
            'Bezoek 3-4 verschillende eilanden',
            'Zwemmen in kristalheldere lagunes',
            'Snorkelen bij koraalriffen',
            'Traditionele BBQ lunch',
            'Ontmoet lokale gemeenschappen',
            'Verborgen stranden ontdekken'
        ],
        included: [
            'Boottransport',
            'BBQ lunch met lokale gerechten',
            'Snorkeluitrusting',
            'Drankjes (water, frisdrank)',
            'Professionele gids',
            'Verzekering'
        ],
        notIncluded: [
            'Hotel pickup',
            'Alcoholische dranken',
            'Souvenirs'
        ],
        requirements: [
            'Redelijke conditie',
            'Kunnen zwemmen aanbevolen',
            'Geschikt voor alle leeftijden',
            'Niet geschikt bij slecht weer'
        ],
        reviewsData: {
            5: 280,
            4: 25,
            3: 5,
            2: 1,
            1: 1
        },
        recentReviews: [
            {
                author: 'Sophie Martin',
                date: '5 dagen geleden',
                rating: 5,
                text: 'Beste dag van onze vakantie! We hebben zoveel gezien en gedaan. De lunch was heerlijk en de crew was super vriendelijk. Absolute must-do!'
            },
            {
                author: 'David Brown',
                date: '1 week geleden',
                rating: 5,
                text: 'Perfect georganiseerd. Elk eiland had zijn eigen charme. De snorkel stops waren geweldig en we zagen zelfs dolfijnen onderweg!'
            }
        ]
    }
};

let currentGalleryIndex = 0;
let currentExperience = null;

function showExperienceDetail(experienceId) {
    const experience = experiencesData[experienceId];
    if (!experience) return;
    
    currentExperience = experience;
    currentGalleryIndex = 0;
    
    const modalHTML = createExperienceModalHTML(experience);
    
    let detailModal = document.getElementById('experienceDetailModal');
    if (!detailModal) {
        detailModal = document.createElement('div');
        detailModal.id = 'experienceDetailModal';
        detailModal.className = 'modal';
        document.body.appendChild(detailModal);
    }
    
    detailModal.innerHTML = modalHTML;
    showModal('experienceDetailModal');
    
    // Initialize gallery
    updateGalleryImage(0);
}

function createExperienceModalHTML(exp) {
    const totalReviews = Object.values(exp.reviewsData).reduce((a, b) => a + b, 0);
    
    return `
        <div class="modal-content large">
            <button class="modal-close" onclick="closeModal('experienceDetailModal')">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="experience-modal-header">
                <div class="experience-image-gallery">
                    <img id="galleryMainImage" src="${exp.images[0]}" alt="${exp.name}" class="gallery-main-image">
                    
                    <div class="gallery-navigation">
                        <button class="gallery-nav-btn" onclick="previousImage()">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="gallery-nav-btn" onclick="nextImage()">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    
                    <div class="gallery-indicators">
                        ${exp.images.map((_, index) => 
                            `<div class="gallery-indicator ${index === 0 ? 'active' : ''}" onclick="goToImage(${index})"></div>`
                        ).join('')}
                    </div>
                </div>
            </div>
            
            <div class="experience-modal-body">
                <h2 class="experience-modal-title">${exp.name}</h2>
                
                <div class="experience-modal-meta">
                    <div class="meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${exp.location}</span>
                    </div>
                    <div class="meta-item">
                        <i class="far fa-clock"></i>
                        <span>${exp.duration}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-users"></i>
                        <span>${exp.groupSize}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-star" style="color: #ffa726;"></i>
                        <span><strong>${exp.rating}</strong> (${exp.reviews} reviews)</span>
                    </div>
                </div>
                
                <div class="experience-modal-description">
                    <h3>Over deze ervaring</h3>
                    <p>${exp.description}</p>
                    <p>${exp.longDescription}</p>
                </div>
                
                <div class="experience-highlights">
                    <h3>Highlights</h3>
                    <ul class="highlights-list">
                        ${exp.highlights.map(h => `
                            <li><i class="fas fa-check-circle"></i> ${h}</li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="experience-info-grid">
                    <div class="info-section">
                        <h4>Inbegrepen</h4>
                        <ul>
                            ${exp.included.map(item => `
                                <li><i class="fas fa-check"></i> ${item}</li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="info-section">
                        <h4>Niet Inbegrepen</h4>
                        <ul>
                            ${exp.notIncluded.map(item => `
                                <li><i class="fas fa-times"></i> ${item}</li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="info-section">
                    <h4>Vereisten</h4>
                    <ul>
                        ${exp.requirements.map(req => `
                            <li><i class="fas fa-info-circle"></i> ${req}</li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="experience-reviews">
                    <h3>Reviews & Ratings</h3>
                    
                    <div class="review-summary">
                        <div class="review-score">
                            <div class="review-score-number">${exp.rating}</div>
                            <div class="review-score-stars">
                                ${generateStars(exp.rating)}
                            </div>
                            <div class="review-score-count">${totalReviews} reviews</div>
                        </div>
                        
                        <div class="review-bars">
                            ${generateReviewBars(exp.reviewsData, totalReviews)}
                        </div>
                    </div>
                    
                    <div class="reviews-list">
                        ${exp.recentReviews.map(review => `
                            <div class="review-item">
                                <div class="review-header">
                                    <div class="review-avatar">${review.author.charAt(0)}</div>
                                    <div class="review-author-info">
                                        <h5>${review.author}</h5>
                                        <div class="review-date">${review.date}</div>
                                    </div>
                                </div>
                                <div class="review-rating">
                                    ${generateStars(review.rating)}
                                </div>
                                <div class="review-text">${review.text}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="experience-modal-footer">
                <div class="modal-price-section">
                    <div class="modal-price">${exp.price}</div>
                    <div class="modal-price-label">per persoon</div>
                </div>
                <button class="modal-book-btn" onclick="closeModal('experienceDetailModal'); bookExperience('${exp.name}', '${exp.price}')">
                    <i class="fas fa-calendar-check"></i> Nu Boeken
                </button>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

function generateReviewBars(reviewsData, total) {
    let html = '';
    for (let stars = 5; stars >= 1; stars--) {
        const count = reviewsData[stars] || 0;
        const percentage = (count / total) * 100;
        html += `
            <div class="review-bar-item">
                <div class="review-bar-label">${stars} sterren</div>
                <div class="review-bar-track">
                    <div class="review-bar-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="review-bar-count">${count}</div>
            </div>
        `;
    }
    return html;
}

// ==========================================
// IMAGE GALLERY CONTROLS
// ==========================================
function updateGalleryImage(index) {
    if (!currentExperience) return;
    
    const images = currentExperience.images;
    currentGalleryIndex = index;
    
    // Update main image
    const mainImage = document.getElementById('galleryMainImage');
    if (mainImage) {
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.src = images[index];
            mainImage.style.opacity = '1';
        }, 150);
    }
    
    // Update indicators
    const indicators = document.querySelectorAll('.gallery-indicator');
    indicators.forEach((indicator, i) => {
        if (i === index) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function nextImage() {
    if (!currentExperience) return;
    const nextIndex = (currentGalleryIndex + 1) % currentExperience.images.length;
    updateGalleryImage(nextIndex);
}

function previousImage() {
    if (!currentExperience) return;
    const prevIndex = (currentGalleryIndex - 1 + currentExperience.images.length) % currentExperience.images.length;
    updateGalleryImage(prevIndex);
}

function goToImage(index) {
    updateGalleryImage(index);
}

// Add keyboard navigation for gallery
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('experienceDetailModal');
    if (modal && modal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
            previousImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    }
});

// Make functions globally accessible
window.searchExperiences = searchExperiences;
window.bookExperience = bookExperience;
window.handleBooking = handleBooking;
window.handleLogin = handleLogin;
window.showLoginModal = showLoginModal;
window.closeModal = closeModal;
window.showModal = showModal;
window.toggleMobileMenu = toggleMobileMenu;
window.showExperienceDetail = showExperienceDetail;
window.nextImage = nextImage;
window.previousImage = previousImage;
window.goToImage = goToImage;