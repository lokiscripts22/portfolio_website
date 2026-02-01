// ============================================
// SMOOTH SCROLL HANDLING
// ============================================
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

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// ============================================
// PRIVACY POLICY MODAL
// ============================================
const privacyModal = document.getElementById('privacyModal');

function openPrivacyModal() {
  privacyModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePrivacyModal() {
  privacyModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && privacyModal.classList.contains('active')) {
    closePrivacyModal();
  }
});

// ============================================
// FETCH GITHUB PROJECTS
// ============================================
const GITHUB_USERNAME = 'lokiscripts22';
const EXCLUDED_REPOS = ['lokiscripts22', 'portfolio_website', 'bybit_micro_bot']; // Exclude featured projects

async function fetchGitHubProjects() {
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=9`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }
    
    const repos = await response.json();
    const projectList = document.getElementById('project-list');
    
    // Filter out excluded repos and private repos
    const filteredRepos = repos.filter(repo => 
      !EXCLUDED_REPOS.includes(repo.name) && !repo.private
    );
    
    if (filteredRepos.length === 0) {
      projectList.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); grid-column: 1/-1;">
          <p>More projects coming soon!</p>
        </div>
      `;
      return;
    }
    
    projectList.innerHTML = filteredRepos.map(repo => `
      <div class="project-card">
        <h3>${repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
        <p>${repo.description || 'No description available'}</p>
        ${repo.language ? `<span class="tech-badge" style="display: inline-block; margin-bottom: 1rem; background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3); color: var(--primary);">${repo.language}</span>` : ''}
        <div>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
            View on GitHub →
          </a>
        </div>
      </div>
    `).join('');
    
    // Animate project cards
    observeElements();
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); grid-column: 1/-1;">
        <p>Unable to load projects at this time.</p>
        <p><a href="https://github.com/${GITHUB_USERNAME}" target="_blank" style="color: var(--primary);">Visit my GitHub profile</a></p>
      </div>
    `;
  }
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
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

function observeElements() {
  const elements = document.querySelectorAll('.project-card, .featured-card, .glass-card');
  elements.forEach(el => {
    if (!el.style.opacity) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    }
    observer.observe(el);
  });
}

// ============================================
// INIT ON LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Load GitHub projects
  fetchGitHubProjects();
  
  // Initial observation
  observeElements();
  
  // Add scroll animations to sections
  const sections = document.querySelectorAll('.section-projects, .section-lighthouse, .section-contact');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(section);
  });
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
  });
}

// ============================================
// CONSOLE EASTER EGG
// ============================================
const styles = {
  title: 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #00d4ff, #ff6b9d); -webkit-background-clip: text; color: transparent;',
  text: 'font-size: 14px; color: #cbd5e1;',
  link: 'font-size: 14px; color: #00d4ff; font-weight: bold;'
};

console.log('%c👋 Hey there, developer!', styles.title);
console.log('%cLike what you see? Check out the code on GitHub:', styles.text);
console.log(`%chttps://github.com/${GITHUB_USERNAME}`, styles.link);
console.log('%c\n🔐 Building secure, scalable solutions', styles.text);

// ============================================
// PARTICLES EFFECT (Optional Enhancement)
// ============================================
// Add subtle particle effect on hero
function createParticles() {
  const hero = document.querySelector('.hero-overlay');
  if (!hero) return;
  
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 1}px;
      height: ${Math.random() * 4 + 1}px;
      background: rgba(0, 212, 255, ${Math.random() * 0.5 + 0.2});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 10 + 10}s linear infinite;
      pointer-events: none;
    `;
    hero.appendChild(particle);
  }
}

// Add float animation
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translate(0, 0); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translate(${Math.random() * 100 - 50}px, -100vh); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Initialize particles
setTimeout(createParticles, 1000);
