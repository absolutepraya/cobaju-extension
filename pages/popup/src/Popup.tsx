import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { IconHanger, IconX, IconExternalLink, IconTrashX } from '@tabler/icons-react';

const apparelsData = [
  {
    name: 'Blue Cardigan',
    size: 'M',
  },
  {
    name: 'Maroon Cardigan',
    size: 'L',
  },
  {
    name: 'Blue Cardigan',
    size: 'M',
  },
  {
    name: 'Maroon Cardigan',
    size: 'L',
  },
  {
    name: 'Blue Cardigan',
    size: 'M',
  },
  {
    name: 'Maroon Cardigan',
    size: 'L',
  },
];

const Popup = () => {
  // const logo = 'popup/logo.svg';
  const logoExtend = 'popup/logo-extend.svg';

  return (
    <div className="App bg-cwhite text-cblack flex flex-col w-full text-base font-poppins pt-[80px]">
      <div className="border-b-2 bg-white border-b-cgrey flex w-full items-center justify-center pb-3 pt-4 fixed top-0 left-0">
        <img src={chrome.runtime.getURL(logoExtend)} alt="logo" className="h-[2.4rem]" />
        <button className="">
          <IconX size={20} strokeWidth={2} className="absolute bottom-1/2 right-4 translate-y-1/2 text-cgrey" />
        </button>
      </div>

      <div className="flex space-x-2 px-4 items-center">
        <IconHanger size={20} />
        <p className="font-bold">Your apparels</p>
      </div>

      <div className="flex flex-col space-y-2 items-center justify-center mt-3 px-4">
        {apparelsData.map((apparel, index) => (
          <div
            key={index}
            className="flex justify-between items-center w-full bg-white border-2 border-cgrey rounded-lg p-2 h-20">
            <div className="flex flex-row space-x-2 h-full">
              <div className="aspect-square h-full rounded-md overflow-hidden bg-black"></div>
              <div className="flex flex-col h-full justify-center">
                <p className="text-sm font-bold text-cpurple">{apparel.name}</p>
                <p className="text-xs text-gray-500">Size: {apparel.size}</p>
              </div>
            </div>

            <button className="flex items-center space-x-0.5 text-red-500">
              <IconTrashX size={16} strokeWidth={2} />
              <span className="text-xs underline">Remove</span>
            </button>
          </div>
        ))}
      </div>

      <div className="w-full mt-4 text-xs text-gray-500 flex items-center text-center justify-center">
        <p>
          Go to Wardrobe to try on and
          <br />
          manage items
        </p>
      </div>

      <div className="w-full mt-4 text-base text-white flex items-center text-center justify-center">
        <button className="bg-cpurpledark w-[80%] flex flex-row items-center text-center justify-center rounded-lg p-2">
          <p>Go to Wardrobe</p>
          <IconExternalLink size={20} strokeWidth={2} className="inline-block ml-2" />
        </button>
      </div>

      <div className="h-4 w-4 bg-cwhite text-sm">&nbsp;</div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
