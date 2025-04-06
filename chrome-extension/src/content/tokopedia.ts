/* eslint-disable prettier/prettier */

// Function to create tooltip button
function createTooltipButton() {
  const button = document.createElement('img');
  button.src = chrome.runtime.getURL('logo.png');
  button.className = 'cobaju-tooltip-button';
  button.addEventListener('click', e => {
    e.stopPropagation(); // Prevent event bubbling
    e.preventDefault(); // Prevent default anchor navigation
    alert('Cobaju tooltip button clicked!');
    return false; // Extra safeguard for older browsers
  });

  return button;
}

// Function to add tooltip button to product images
function addTooltipToProductImages() {
  // Combine both selectors
  const allProductImages = [
    ...Array.from(document.querySelectorAll('img[alt="product-image"]')),
    // ...Array.from(document.querySelectorAll('img[data-testid="PDPMainImage"]')),
  ];

  // Add tooltip button to each image
  allProductImages.forEach(image => {
    // Get the parent element to position the tooltip button properly
    const imageContainer = image.parentElement;

    if (imageContainer && !imageContainer.querySelector('.cobaju-tooltip-button')) {
      // Position the container as relative if it's not already
      if (window.getComputedStyle(imageContainer).position === 'static') {
        imageContainer.style.position = 'relative';
      }

      // Create and add the tooltip button
      const tooltipButton = createTooltipButton();
      imageContainer.appendChild(tooltipButton);
    }
  });
}

// Run immediately and also on DOM changes
function init() {
  // Run once on page load
  addTooltipToProductImages();

  // Create observer to handle dynamically loaded images
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        addTooltipToProductImages();
      }
    });
  });

  // Start observing the document with configured parameters
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
