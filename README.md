# Professional Portfolio Website

A modern, professional portfolio website for showcasing software development projects with an integrated privacy policy for VaultNotes.

## 🚀 Features

- **Professional Design**: Clean, modern aesthetic with smooth animations
- **Responsive Layout**: Fully responsive across all devices
- **Performance Optimized**: Lighthouse score of 87+ (desktop and mobile)
- **Dynamic Projects**: Automatically fetches and displays GitHub repositories
- **Privacy Policy**: Comprehensive, Microsoft Store-ready privacy policy for VaultNotes
- **No Games Section**: Removed casual games for a more professional appearance

## 📁 File Structure

```
portfolio_website/
├── index.html          # Main portfolio page
├── privacy.html        # VaultNotes privacy policy
├── style.css           # Professional styling
├── script.js           # JavaScript functionality
├── images/
│   └── profile.png     # Profile picture
├── lighthouse/
│   ├── lighthouse-desktop.png
│   └── lighthouse-mobile.png
└── videos/
    └── beach-backdrop.mp4
```

## 🔧 Deployment Instructions

### Option 1: GitHub Pages (Recommended)

1. **Copy all files to your repository root:**
   ```bash
   # Replace these files in your portfolio_website repository:
   - index.html
   - privacy.html
   - style.css
   - script.js
   ```

2. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Update to professional portfolio with VaultNotes privacy policy"
   git push origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select source: `main` branch, `/ (root)` folder
   - Save

4. **Access your site:**
   - Your site will be live at: `https://lokiscripts22.github.io/portfolio_website/`
   - Privacy policy will be at: `https://lokiscripts22.github.io/portfolio_website/privacy.html`

### Option 2: Custom Domain

1. Follow steps 1-3 from Option 1
2. Add a custom domain in repository settings
3. Create a CNAME file in your repository root with your domain name
4. Update your DNS settings with your domain provider

## 🔗 Microsoft Store Integration

For your VaultNotes Microsoft Store listing:

1. **Privacy Policy URL:**
   ```
   https://lokiscripts22.github.io/portfolio_website/privacy.html
   ```

2. **In Partner Center:**
   - Go to your app listing
   - Navigate to "Properties" > "Privacy policy"
   - Paste the URL above
   - Save changes

3. **What the privacy policy includes:**
   - ✅ Microsoft Store compliance
   - ✅ Accurate technical specifications (AES-256-GCM, PBKDF2, etc.)
   - ✅ Clear explanation of local-only storage
   - ✅ No data collection statements
   - ✅ GDPR/CCPA compliance
   - ✅ Children's privacy compliance (COPPA)

## 🎨 Customization

### Updating Your Information

**Profile Image:**
- Replace `images/profile.png` with your photo
- Recommended size: 400x400px minimum

**GitHub Username:**
- Update in `script.js`:
  ```javascript
  const GITHUB_USERNAME = 'lokiscripts22';
  ```

**Contact Information:**
- Update links in `index.html` footer section
- Update GitHub links throughout

**Theme Colors:**
- Edit CSS variables in `style.css`:
  ```css
  :root {
    --primary-color: #2563eb;
    --secondary-color: #10b981;
    /* etc. */
  }
  ```

### Adding New Projects

Projects are automatically fetched from your GitHub. To exclude repositories:

Edit `script.js`:
```javascript
const EXCLUDED_REPOS = ['lokiscripts22', 'portfolio_website', 'your-repo-name'];
```

## 📊 Performance

- **Lighthouse Desktop Score:** 87
- **Lighthouse Mobile Score:** 87
- **Optimizations:**
  - Lazy loading images
  - Minimal JavaScript
  - Optimized CSS
  - Smooth scroll behavior
  - Intersection Observer for animations

## 🔐 Privacy Policy Details

The privacy policy is specifically written for VaultNotes based on the actual source code:

- **Encryption:** AES-256-GCM with PBKDF2 (310,000 iterations)
- **Storage:** Local-only, Windows `%LOCALAPPDATA%\VaultNotes`
- **Network:** Zero network access, completely offline
- **Data Collection:** None whatsoever
- **Third Parties:** No third-party integrations
- **Compliance:** GDPR, CCPA, LGPD, COPPA compliant by design

## 🛠️ Technical Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No frameworks for performance
- **GitHub API**: Dynamic project fetching
- **Responsive Design**: Mobile-first approach

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🚦 SEO & Accessibility

- Semantic HTML5 elements
- Proper heading hierarchy
- Alt text for all images
- ARIA labels where needed
- Fast load times
- Mobile-responsive design

## 📝 License

© 2026 Khayne | lokiscripts22. All rights reserved.

## 🤝 Support

For questions or issues:
- GitHub: [@lokiscripts22](https://github.com/lokiscripts22)

---

