document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

let previous = 0;
const topbar = document.querySelector('.topbar');

window.addEventListener('scroll', () => {
  const current = window.pageYOffset;
  if (current > 100) {
    topbar.classList.add('solid');
  } else {
    topbar.classList.remove('solid');
  }
  previous = current;
});

function showPolicy() {
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function hidePolicy() {
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Make functions globally accessible
window.showPolicy = showPolicy;
window.hidePolicy = hidePolicy;

document.addEventListener('keydown', (e) => {
  const overlay = document.getElementById('overlay');
  if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
    hidePolicy();
  }
});

const USERNAME = 'lokiscripts22';
const SKIP = ['lokiscripts22', 'portfolio_website', 'bybit_micro_bot'];

async function loadRepos() {
  try {
    const response = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=9`);
    if (!response.ok) throw new Error('Failed to fetch');
    
    const data = await response.json();
    const container = document.getElementById('repos');
    const filtered = data.filter(item => !SKIP.includes(item.name) && !item.private);
    
    if (filtered.length === 0) {
      container.innerHTML = '<div style="text-align: center; color: var(--muted); grid-column: 1/-1;"><p>More projects coming soon!</p></div>';
      return;
    }
    
    container.innerHTML = filtered.map(item => `
      <article>
        <h3>${item.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</h3>
        <p>${item.description || 'No description available'}</p>
        ${item.language ? `<span class="tech" style="display: inline-block; margin-bottom: 1rem; background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3); color: var(--cyan);">${item.language}</span>` : ''}
        <div><a href="${item.html_url}" target="_blank" rel="noopener noreferrer">View on GitHub →</a></div>
      </article>
    `).join('');
    
    watch();
  } catch (error) {
    console.error('Error:', error);
    const container = document.getElementById('repos');
    container.innerHTML = `
      <div style="text-align: center; color: var(--muted); grid-column: 1/-1;">
        <p>Unable to load projects.</p>
        <p><a href="https://github.com/${USERNAME}" target="_blank" style="color: var(--cyan);">Visit GitHub</a></p>
      </div>
    `;
  }
}

const settings = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const watcher = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, settings);

function watch() {
  const items = document.querySelectorAll('.grid article, .project, .card');
  items.forEach(item => {
    if (!item.style.opacity) {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    }
    watcher.observe(item);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadRepos();
  watch();
  
  const parts = document.querySelectorAll('.showcase, .proof, .connect');
  parts.forEach(part => {
    part.style.opacity = '0';
    part.style.transform = 'translateY(30px)';
    part.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    watcher.observe(part);
  });
  
  // Add click listener for privacy policy button
  const privacyButtons = document.querySelectorAll('.button.outline');
  privacyButtons.forEach(button => {
    if (button.textContent.includes('Privacy Policy')) {
      button.addEventListener('click', showPolicy);
    }
  });
  
  // Add click listeners for modal close
  const closeButton = document.querySelector('.close');
  const blanket = document.querySelector('.blanket');
  if (closeButton) closeButton.addEventListener('click', hidePolicy);
  if (blanket) blanket.addEventListener('click', hidePolicy);
});

if ('loading' in HTMLImageElement.prototype) {
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  imgs.forEach(img => {
    if (img.dataset.src) img.src = img.dataset.src;
  });
}

const format = {
  h1: 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #00d4ff, #ff6b9d); -webkit-background-clip: text; color: transparent;',
  h2: 'font-size: 14px; color: #cbd5e1;',
  h3: 'font-size: 14px; color: #00d4ff; font-weight: bold;'
};

console.log('%c👋 Developer Tools Open?', format.h1);
console.log('%cCheck out the source:', format.h2);
console.log(`%chttps://github.com/${USERNAME}`, format.h3);

function addEffects() {
  const region = document.querySelector('.layer');
  if (!region) return;
  
  for (let i = 0; i < 20; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 1}px;
      height: ${Math.random() * 4 + 1}px;
      background: rgba(0, 212, 255, ${Math.random() * 0.5 + 0.2});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: drift ${Math.random() * 10 + 10}s linear infinite;
      pointer-events: none;
    `;
    region.appendChild(dot);
  }
}

const motion = document.createElement('style');
motion.textContent = `
  @keyframes drift {
    0%, 100% { transform: translate(0, 0); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translate(${Math.random() * 100 - 50}px, -100vh); opacity: 0; }
  }
`;
document.head.appendChild(motion);

setTimeout(addEffects, 1000);