import { withErrorBoundary, withSuspense } from '@extension/shared';
import { IconX, IconShirt, IconPalette, IconCheck, IconHanger } from '@tabler/icons-react';
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
  const [selectedColor, setSelectedColor] = useState<string>('#2d0c18');
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = ['#ada097', '#584a4a', '#252a41', '#2d0c18', '#24671b'];

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
        color: selectedColor,
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
    <div className="App bg-cwhite text-cblack flex flex-col w-full text-base font-poppins pt-[74px]">
      <ReactNotifications />

      <div className="border-b-2 bg-white border-b-cgrey flex w-full items-center justify-center pb-3 pt-4 fixed top-0 left-0">
        <img src={chrome.runtime.getURL(logoExtend)} alt="logo" className="h-[2.4rem]" />
        <button onClick={goBackToList}>
          <IconX size={20} strokeWidth={2} className="absolute bottom-1/2 right-4 translate-y-1/2 text-cgrey" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-start p-4 pb-0 w-full">
        {tempProductData && (
          <>
            <div className="w-40 h-40 rounded-md overflow-hidden mb-4">
              <img src={tempProductData.imgSrc} alt={tempProductData.name} className="h-full w-full object-cover" />
            </div>

            <p className="font-bold text-sm text-center mb-4 text-cblack">{tempProductData.name}</p>

            <div className="flex flex-col w-full mb-4">
              <div className="flex items-center mb-2">
                <IconPalette size={18} />
                <p className="font-bold ml-1 text-sm">Select Color</p>
              </div>

              <div className="flex justify-start gap-3 mt-2">
                {availableColors.map(color => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      selectedColor === color ? 'ring-2 ring-cpurpledark ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Color ${color}`}>
                    {selectedColor === color && <IconCheck size={16} color="white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col w-full mb-4">
              <div className="flex flex-row justify-between w-full">
                <div className="flex items-center mb-0">
                  <IconShirt size={18} />
                  <p className="font-bold ml-1 text-sm">Select Size</p>
                </div>
                <p className="text-cpurpledark text-sm underline ml-2">View Size Guide</p>
              </div>

              <div className="flex justify-start gap-1 mt-2">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    className={`w-10 py-2 rounded-md text-xs font-bold ${
                      selectedSize === size ? 'border-cpurpledark bg-cpurpledark text-white' : 'text-cgraydark'
                    }`}
                    onClick={() => setSelectedSize(size)}>
                    {size}
                  </button>
                ))}
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Recommended size based on <br />
                your measurements: <b>M</b>
              </p>
            </div>
          </>
        )}
      </div>

      <div className="w-full mt-auto text-base text-white flex items-center text-center justify-center p-4 pt-0">
        <button
          className="bg-cpurpledark w-full flex flex-row items-center text-center justify-center rounded-lg p-2 gap-1"
          onClick={handleAddItem}>
          <p>Add item</p>
          <IconHanger size={20} strokeWidth={2} className="" />
        </button>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(SelectSize, <div> Loading ... </div>), <div> Error Occur </div>);
