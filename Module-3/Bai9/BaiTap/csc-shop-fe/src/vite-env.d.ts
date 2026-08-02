/// <reference types="vite/client" />

// Typed access to our custom env variable (import.meta.env.VITE_API_URL)
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
