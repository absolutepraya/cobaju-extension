import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { IconHanger, IconX, IconExternalLink, IconTrashX, IconShoppingBagPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import SelectSize from './SelectSize';

// Define the apparel item type
interface ApparelItem {
  imgSrc: string;
  name: string;
  size: string;
}

const Popup = () => {
  const [apparelsData, setApparelsData] = useState<ApparelItem[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'selectSize'>('list');
  const logoExtend = 'popup/logo-extend.svg';

  // Load data from Chrome storage when component mounts
  useEffect(() => {
    chrome.storage.sync.get(['apparelsData', 'popupView'], result => {
      if (result.apparelsData) {
        setApparelsData(result.apparelsData);
      }
      if (result.popupView) {
        setCurrentView(result.popupView);
      }
    });

    // Listen for changes to storage
    chrome.storage.onChanged.addListener(changes => {
      if (changes.apparelsData) {
        setApparelsData(changes.apparelsData.newValue || []);
      }
      if (changes.popupView) {
        setCurrentView(changes.popupView.newValue || 'list');
      }
    });
  }, []);

  // Handle removing an item
  const handleRemoveItem = (index: number) => {
    const updatedApparels = [...apparelsData];
    updatedApparels.splice(index, 1);

    // Update storage
    chrome.storage.sync.set({ apparelsData: updatedApparels }, () => {
      setApparelsData(updatedApparels);
    });
  };

  // Handle opening the wardrobe in a new tab
  const handleOpenWardrobe = () => {
    chrome.tabs.create({ url: 'https://cobaju.vercel.app/wardrobe' });
  };

  // Render Select Size view if that's the current view
  if (currentView === 'selectSize') {
    return <SelectSize />;
  }

  // Otherwise render the list view (default)
  return (
    <div className="App bg-cwhite text-cblack flex flex-col w-full text-base font-poppins pt-[80px]">
      <ReactNotifications />

      <div className="border-b-2 bg-white border-b-cgrey flex w-full items-center justify-center pb-3 pt-4 fixed top-0 left-0">
        <img src={chrome.runtime.getURL(logoExtend)} alt="logo" className="h-[2.4rem]" />
        <button onClick={() => window.close()}>
          <IconX size={20} strokeWidth={2} className="absolute bottom-1/2 right-4 translate-y-1/2 text-cgrey" />
        </button>
      </div>

      <div className="flex space-x-2 px-4 items-center">
        <IconHanger size={20} />
        <p className="font-bold">Your items</p>
      </div>

      <div className="flex flex-col space-y-2 items-center justify-center mt-3 px-4">
        {apparelsData.length > 0 ? (
          apparelsData.map((apparel, index) => (
            <div
              key={index}
              className="flex justify-between items-center w-full bg-white border-2 border-cgrey rounded-lg p-2 h-20">
              <div className="flex flex-row space-x-2 h-full">
                <div className="aspect-square h-full rounded-md overflow-hidden bg-black">
                  {apparel.imgSrc && (
                    <img src={apparel.imgSrc} alt={apparel.name} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex flex-col h-full justify-center">
                  <p className="text-xs font-bold text-cpurple whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                    {apparel.name}
                  </p>
                  <p className="text-xs text-gray-500">Size: {apparel.size}</p>
                </div>
              </div>

              <button className="flex items-center space-x-0.5 text-red-500" onClick={() => handleRemoveItem(index)}>
                <IconTrashX size={16} strokeWidth={2} />
                <span className="text-xs underline">Remove</span>
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 font-base text-center py-8 text-sm">
            <IconShoppingBagPlus size={48} strokeWidth={1.5} className="mb-4" />
            <p>
              You can add your items from
              <br />{' '}
              <a href="https://www.tokopedia.com/" className="text-blue-400 underline">
                Tokopedia
              </a>{' '}
              or{' '}
              <a href="https://shopee.co.id/" className="text-blue-400 underline">
                Shopee
              </a>
              !
            </p>
          </div>
        )}
      </div>

      <div className="w-full mt-4 text-xs text-gray-500 flex items-center text-center justify-center">
        <p>
          Go to Wardrobe to try on and
          <br />
          manage items
        </p>
      </div>

      <div className="w-full mt-4 text-base text-white flex items-center text-center justify-center">
        <button
          className={`bg-cpurpledark w-[80%] flex flex-row items-center text-center justify-center rounded-lg p-2 ${apparelsData.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={apparelsData.length === 0}
          onClick={handleOpenWardrobe}>
          <p>Go to Wardrobe</p>
          <IconExternalLink size={20} strokeWidth={2} className="inline-block ml-2" />
        </button>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
