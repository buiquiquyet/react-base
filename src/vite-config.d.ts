/// <reference types="vite/client" />
  
  interface RuntimeConfig {
    API_URL: string;
    FILE_URL: string
  }
  
  interface Window {
    runtimeConfig: RuntimeConfig;
  }
  