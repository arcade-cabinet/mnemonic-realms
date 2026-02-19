export interface PWAManifest {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  background_color: string;
  theme_color: string;
  orientation?: 'any' | 'natural' | 'landscape' | 'portrait';
  icons: PWAIcon[];
  screenshots?: PWAScreenshot[];
  categories?: string[];
  prefer_related_applications?: boolean;
}

export interface PWAIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: 'any' | 'maskable' | 'any maskable';
}

export interface PWAScreenshot {
  src: string;
  sizes: string;
  type: string;
  form_factor?: 'narrow' | 'wide';
}
