import { withErrorBoundary, withSuspense } from '@extension/shared';
import { IconX, IconShirt } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { ReactNotifications } from 'react-notifications-component';

// Define the temporary product data type
interface TempProductData {
  imgSrc: string;
  name: string;
}

const SelectSize = () => {
  const logoExtend = 'popup/logo-extend.svg';
  const [tempProductData, setTempProductData] = useState<TempProductData | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL'];

  // Function to switch back to the list view
  const goBackToList = () => {
    chrome.storage.sync.set({ popupView: 'list' });
  };

  // Function to handle adding the item with the selected size
  const handleAddItem = () => {
    if (!tempProductData) return;

    // Get existing items from storage
    chrome.storage.sync.get(['apparelsData'], result => {
      const existingData = result.apparelsData || [];
      const newItem = {
        imgSrc: tempProductData.imgSrc,
        name: tempProductData.name,
        size: selectedSize,
      };

      const updatedData = [...existingData, newItem];

      // Update storage and go back to list view
      chrome.storage.sync.set(
        {
          apparelsData: updatedData,
          popupView: 'list',
        },
        () => {
          // Show notification in the next view
          // (Note: This would need a notification component in Popup.tsx to be shown)
        },
      );
    });
  };

  // Load product data when component mounts
  useEffect(() => {
    chrome.storage.sync.get(['tempProductData'], result => {
      if (result.tempProductData) {
        setTempProductData(result.tempProductData);
      }
    });
  }, []);

  return (
    <div className="App bg-cwhite text-cblack flex flex-col w-full text-base font-poppins pt-[80px]">
      <ReactNotifications />

      <div className="border-b-2 bg-white border-b-cgrey flex w-full items-center justify-center pb-3 pt-4 fixed top-0 left-0">
        <img src={chrome.runtime.getURL(logoExtend)} alt="logo" className="h-[2.4rem]" />
        <button onClick={goBackToList}>
          <IconX size={20} strokeWidth={2} className="absolute bottom-1/2 right-4 translate-y-1/2 text-cgrey" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-start p-4 w-full">
        {tempProductData && (
          <>
            <div className="w-32 h-32 rounded-md overflow-hidden bg-black mb-4">
              <img src={tempProductData.imgSrc} alt={tempProductData.name} className="h-full w-full object-cover" />
            </div>

            <p className="font-bold text-sm text-center mb-6 text-cpurple">{tempProductData.name}</p>

            <div className="flex flex-col w-full mb-6">
              <div className="flex items-center mb-2">
                <IconShirt size={18} />
                <p className="font-bold ml-2">Select Size</p>
              </div>

              <div className="flex justify-between gap-2 mt-2">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    className={`flex-1 py-2 border-2 rounded-md text-sm font-bold ${
                      selectedSize === size ? 'border-cpurple bg-cpurple text-white' : 'border-cgrey text-cgraydark'
                    }`}
                    onClick={() => setSelectedSize(size)}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="w-full mt-auto text-base text-white flex items-center text-center justify-center p-4">
        <button
          className="bg-cpurpledark w-full flex flex-row items-center text-center justify-center rounded-lg p-2"
          onClick={handleAddItem}>
          <p>Add to Apparels</p>
        </button>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(SelectSize, <div> Loading ... </div>), <div> Error Occur </div>);
