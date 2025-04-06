// Function to create tooltip button
function createTooltipButton(imageSrc: string) {
  const button = document.createElement('img');
  button.src = chrome.runtime.getURL('logo.png');
  button.className = 'cobaju-tooltip-button';
  button.addEventListener('click', e => {
    e.stopPropagation(); // Prevent event bubbling
    e.preventDefault(); // Prevent default anchor navigation

    // Save image to Chrome storage
    chrome.storage.sync.get(['apparelsData'], result => {
      const existingData = result.apparelsData || [];
      const newItem = {
        imgSrc: imageSrc,
        name: 'Product Name', // Placeholder
        size: 'M', // Placeholder
      };

      const updatedData = [...existingData, newItem];
      chrome.storage.sync.set({ apparelsData: updatedData }, () => {
        // Instead of using alert, create a custom notification element
        showCustomNotification('Product added to your items!');
      });
    });

    return false; // Extra safeguard for older browsers
  });

  return button;
}

// Function to show a custom notification in the page
function showCustomNotification(message: string) {
  // Create notification container if it doesn't exist
  let notificationContainer = document.getElementById('cobaju-notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'cobaju-notification-container';
    notificationContainer.style.position = 'fixed';
    notificationContainer.style.bottom = '20px';
    notificationContainer.style.right = '20px';
    notificationContainer.style.zIndex = '9999';
    document.body.appendChild(notificationContainer);
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'cobaju-notification';
  notification.style.backgroundColor = '#4CAF50';
  notification.style.color = 'white';
  notification.style.padding = '15px 20px';
  notification.style.marginBottom = '10px';
  notification.style.borderRadius = '4px';
  notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  notification.style.display = 'flex';
  notification.style.alignItems = 'center';
  notification.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2.7s';
  notification.textContent = message;

  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(20px); }
    }
  `;
  document.head.appendChild(style);

  // Add to container
  notificationContainer.appendChild(notification);

  // Remove after animation completes
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Function to add tooltip button to product images
function addTooltipToProductImages() {
  // Combine both selectors
  const allProductImages = [
    ...Array.from(document.querySelectorAll('img[alt="product-image"]')),
    ...Array.from(document.querySelectorAll('img[data-testid="PDPMainImage"]')),
    ...Array.from(document.querySelectorAll('img[data-testid="PDPImageDetail"]')),
    ...Array.from(document.querySelectorAll('img[data-testid^="imgProduct"]')),
  ];

  // Add tooltip button to each image
  allProductImages.forEach(image => {
    // Get image source
    const imageSrc = image.getAttribute('src') || '';

    // Special handling for product page with magnifier
    if (image.getAttribute('data-testid') === 'PDPMainImage') {
      // Find the top-level container (the button parent)
      const buttonContainer =
        image.closest('.css-pefdcn') || image.closest('button[popovertarget="preview-image"]')?.parentElement;

      if (buttonContainer && !buttonContainer.querySelector('.cobaju-tooltip-button')) {
        // Position the container properly
        if (window.getComputedStyle(buttonContainer).position === 'static') {
          (buttonContainer as HTMLElement).style.position = 'relative';
        }

        // Create and add the tooltip button with high z-index
        const tooltipButton = createTooltipButton(imageSrc);
        (tooltipButton as HTMLElement).style.zIndex = '9999'; // Ensure it stays on top
        buttonContainer.appendChild(tooltipButton);

        // Disable the magnifier feature
        const magnifier = buttonContainer.querySelector('.magnifier');
        if (magnifier) {
          // Override the display style to always be none
          const originalStyle = magnifier.getAttribute('style');
          magnifier.setAttribute('style', originalStyle + '; display: none !important;');

          // Prevent hover events from showing the magnifier
          const activeContainer = buttonContainer.querySelector('.css-1logqad');
          if (activeContainer) {
            activeContainer.addEventListener(
              'mouseover',
              () => {
                const magnifierEl = activeContainer.querySelector('.magnifier');
                if (magnifierEl) {
                  (magnifierEl as HTMLElement).style.display = 'none';
                }
              },
              true,
            );
          }
        }
      }
    } else {
      // Regular handling for other images
      const imageContainer = image.parentElement;

      if (imageContainer && !imageContainer.querySelector('.cobaju-tooltip-button')) {
        // Position the container as relative if it's not already
        if (window.getComputedStyle(imageContainer).position === 'static') {
          (imageContainer as HTMLElement).style.position = 'relative';
        }

        // Create and add the tooltip button
        const tooltipButton = createTooltipButton(imageSrc);
        imageContainer.appendChild(tooltipButton);
      }
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
