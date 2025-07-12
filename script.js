// Sample data for courses (in a real app, this would come from a database)
const freeCourses = [
    {
        id: 1,
        title: "Basic English Grammar",
        description: "Learn fundamental English grammar rules and structures for beginners.",
        duration: "45 min",
        level: "Beginner",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 2,
        title: "English Pronunciation",
        description: "Master English pronunciation with clear examples and practice exercises.",
        duration: "30 min",
        level: "Beginner",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 3,
        title: "Business English Vocabulary",
        description: "Essential business English vocabulary for professional communication.",
        duration: "60 min",
        level: "Intermediate",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 4,
        title: "Academic Writing Skills",
        description: "Learn how to write academic essays and research papers in English.",
        duration: "90 min",
        level: "Advanced",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 5,
        title: "English Conversation Practice",
        description: "Practice everyday English conversations with native speakers.",
        duration: "40 min",
        level: "Intermediate",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 6,
        title: "TOEFL Preparation",
        description: "Comprehensive TOEFL exam preparation with practice tests.",
        duration: "120 min",
        level: "Advanced",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
];

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const coursesGrid = document.getElementById('coursesGrid');
const contactForm = document.getElementById('contactForm');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Load courses
async function loadCourses() {
    if (!coursesGrid) return;
    
    coursesGrid.innerHTML = '';
    
    // Fetch free videos from Firestore
    const freeVideos = await DatabaseService.getVideos('free');
    
    if (freeVideos.length === 0) {
        coursesGrid.innerHTML = '<p style="text-align: center; color: #6b7280; grid-column: 1 / -1;">No free videos available yet.</p>';
        return;
    }
    
    // In loadCourses, before rendering each video, log the videoUrl
    freeVideos.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        const videoUrl = course.videoUrl;
        courseCard.innerHTML = `
            <div class="course-thumbnail">
                <video controls style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                    <source src="${videoUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <div class="play-button" onclick="openVideoModal('${videoUrl}', '${course.title}', true)">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="course-content">
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    ${course.fileSize ? `<span><i class="fas fa-file"></i> ${course.fileSize}</span>` : ''}
                </div>
            </div>
        `;
        coursesGrid.appendChild(courseCard);
    });
}

// Video Modal
function openVideoModal(videoUrl, title, isUploaded) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    if (isUploaded) {
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="closeVideoModal()">&times;</span>
                <h2>${title}</h2>
                <div class="video-container">
                    <video controls style="width: 100%;">
                        <source src="${videoUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        `;
    } else {
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="closeVideoModal()">&times;</span>
                <h2>${title}</h2>
                <div class="video-container">
                    <iframe src="${videoUrl}" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
        `;
    }
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeVideoModal();
        }
    });
}

function closeVideoModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Contact Form Handler
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        try {
            await db.collection('messages').add({
                name,
                email,
                message,
                createdAt: new Date()
            });
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        } catch (error) {
            alert('Failed to send message. Please try again later.');
        }
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', async () => {
    const animateElements = document.querySelectorAll('.course-card, .about-text, .about-image, .contact-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Load courses
    await loadCourses();
});

// Add loading animation
function showLoading() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="spinner"></div>';
    return loading;
}

// Simulate loading delay for better UX
setTimeout(() => {
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => el.remove());
}, 1000);

// Keyboard navigation for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeVideoModal();
    }
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to course cards
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple effect CSS
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 