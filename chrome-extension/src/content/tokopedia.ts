// Import the notification function
import { showCustomNotification } from './notification';

// Function to create tooltip button
function createTooltipButton(imageSrc: string, imageElement: Element) {
  const button = document.createElement('img');
  button.src = chrome.runtime.getURL('logo.png');
  button.className = 'cobaju-tooltip-button';
  button.addEventListener('click', e => {
    e.stopPropagation(); // Prevent event bubbling
    e.preventDefault(); // Prevent default anchor navigation

    let productName;
    let size = "Can't be found";

    // Check if this is a search result image
    const isSearchResult = imageElement.getAttribute('alt') === 'product-image';
    // Check if this is a recommended product
    const isRecommendedProduct = imageElement.getAttribute('data-testid')?.startsWith('imgProduct');

    if (isSearchResult) {
      // For search result page, find the product name from the search result card
      const container = (e.target as HTMLElement).closest('.css-5wh65g');
      if (container) {
        const nameElement = container.querySelector('span[class*="_0T8-iGxMpV6NEsYEhwkqEg"]');
        if (nameElement && nameElement.textContent) {
          productName = nameElement.textContent.trim();
        } else {
          productName = "Can't be found";
        }
      } else {
        productName = "Can't be found";
      }
    } else if (isRecommendedProduct) {
      // For recommended products in the product page
      // Navigate up to find the container and then find the product name element
      const productCard = imageElement.closest('[data-testid="master-product-card"]');
      if (productCard) {
        const nameElement = productCard.querySelector('[data-testid="linkProductName"]');
        if (nameElement && nameElement.textContent) {
          productName = nameElement.textContent.trim();
        } else {
          productName = "Can't be found";
        }
      } else {
        productName = "Can't be found";
      }
    } else {
      // For product detail page, use the existing selectors
      const nameElement = document.querySelector('[data-testid="lblPDPDetailProductName"]');
      if (nameElement && nameElement.textContent) {
        productName = nameElement.textContent.trim();
      } else {
        productName = "Can't be found";
      }

      // Get selected size (only for product detail page)
      const selectedSizeElement = document.querySelector('[data-testid="btnVariantChipActiveSelected"] button');
      if (selectedSizeElement && selectedSizeElement.textContent) {
        size = selectedSizeElement.textContent.trim();
      }
    }

    // Save image to Chrome storage
    chrome.storage.sync.get(['apparelsData'], result => {
      const existingData = result.apparelsData || [];
      const newItem = {
        imgSrc: imageSrc,
        name: productName,
        size: size,
      };

      const updatedData = [...existingData, newItem];
      chrome.storage.sync.set({ apparelsData: updatedData }, () => {
        showCustomNotification('Product added to your items!');
      });
    });

    return false; // Extra safeguard for older browsers
  });

  return button;
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
        const tooltipButton = createTooltipButton(imageSrc, image);
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
        const tooltipButton = createTooltipButton(imageSrc, image);
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
