// Add this to your types or create a new file
interface Window {
  google: {
    accounts: {
      id: {
        initialize: (config: any) => void;
        renderButton: (element: HTMLElement, options: any) => void;
        prompt: () => void;
      };
      oauth2: {
        initCodeClient: (config: any) => {
          requestCode: () => void;
        };
      };
    };
  };
  
}
