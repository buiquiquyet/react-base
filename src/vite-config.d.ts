/// <reference types="vite/client" />
  
  interface RuntimeConfig {
    API_URL: string;
  }
  
  interface Window {
    runtimeConfig: RuntimeConfig;
  }
  