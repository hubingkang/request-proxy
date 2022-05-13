declare module 'jsonlint-mod';

interface Window {
  myBridge: (value: any) => void;
  jsonlint: any;
}

