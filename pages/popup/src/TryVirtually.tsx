/* eslint-disable prettier/prettier */
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { IconX } from '@tabler/icons-react';

const TryVirtually = () => {
  const logoExtend = 'popup/logo-extend.svg';

  // Function to switch back to the list view
  const goBackToList = () => {
    window.close();
    chrome.storage.sync.set({ popupView: 'list' });
  };

  return (
    <div className="App bg-cwhite text-cblack flex flex-col w-full text-base font-poppins pt-[80px]">
      <div className="border-b-2 bg-white border-b-cgrey flex w-full items-center justify-center pb-3 pt-4 fixed top-0 left-0">
        <img src={chrome.runtime.getURL(logoExtend)} alt="logo" className="h-[2.4rem]" />
        <button onClick={goBackToList}>
          <IconX size={20} strokeWidth={2} className="absolute bottom-1/2 right-4 translate-y-1/2 text-cgrey" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center h-full w-full">
        <p className="font-bold text-xl">OK</p>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(TryVirtually, <div> Loading ... </div>), <div> Error Occur </div>);
