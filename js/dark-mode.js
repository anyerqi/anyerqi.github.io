// Dark Mode Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Find the sub-nav element to add our dark mode toggle
  const subNav = document.getElementById('sub-nav');
  
  if (!subNav) return; // Exit if element not found
  
  // Create dark mode toggle link with proper class for styling consistency
  const darkModeToggle = document.createElement('a');
  darkModeToggle.className = 'nav-icon dark-mode-toggle';
  darkModeToggle.title = 'Toggle dark/light mode';
  
  // Create icon span with Font Awesome
  const iconSpan = document.createElement('span');
  iconSpan.className = 'fa fa-adjust'; // Using adjust icon for dark/light toggle
  darkModeToggle.appendChild(iconSpan);
  
  // Add the toggle button to sub-nav, right before the search button
  //const searchBtn = subNav.querySelector('.nav-search-btn');
  subNav.appendChild(darkModeToggle);

  // Handle dark banner setup
  const setupDarkBanner = () => {
    const bannerElement = document.getElementById('banner');
    if (!bannerElement) return;
    
    // Get dark banner URL from meta tag
    const darkBannerMeta = document.querySelector('meta[name="dark-banner"]');
    if (darkBannerMeta && darkBannerMeta.content) {
      // Set the CSS variable for dark mode banner
      document.documentElement.style.setProperty('--dark-banner-url', `url(${darkBannerMeta.content})`);
      
      // Add listener to apply dark banner when dark mode is active
      const applyDarkBanner = () => {
        if (document.body.classList.contains('dark-mode')) {
          bannerElement.classList.add('dark-banner-loaded');
        } else {
          bannerElement.classList.remove('dark-banner-loaded');
        }
      };
      
      // Set up a MutationObserver to monitor dark mode class changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            applyDarkBanner();
          }
        });
      });
      
      observer.observe(document.body, { attributes: true });
      
      // Initial application based on current mode
      applyDarkBanner();
    }
  };

  // Function to update toggle button icon based on mode
  const updateToggleIcon = (isDarkMode) => {
    iconSpan.className = isDarkMode ? 'fa fa-sun' : 'fa fa-moon';
  };

  // Check for system preference
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check for saved user preference or use system preference
  let savedTheme = localStorage.getItem('theme');
  const systemPreference = prefersDarkScheme.matches ? 'dark' : 'light';

  // If no saved preference, use system preference
  if (!savedTheme) {
    savedTheme = systemPreference;
    localStorage.setItem('theme', savedTheme);
  }
  
  // Apply the theme
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
  
  // Set up the dark banner
  setupDarkBanner();
  
  // Update toggle button icon based on current mode
  updateToggleIcon(document.body.classList.contains('dark-mode'));

  // Toggle dark mode on click
  darkModeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.toggle('dark-mode');
    
    // Save user preference to local storage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Update toggle icon
    updateToggleIcon(isDarkMode);
  });

  // Listen for changes in system preference
  prefersDarkScheme.addEventListener('change', (e) => {
    // Only change theme if user hasn't manually set a preference
    const userHasPreference = localStorage.getItem('theme') !== null;
    if (!userHasPreference) {
      const newSystemPreference = e.matches ? 'dark' : 'light';
      
      if (newSystemPreference === 'dark') {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      
      // Update localStorage and toggle icon
      localStorage.setItem('theme', newSystemPreference);
      updateToggleIcon(e.matches);
    }
  });
});