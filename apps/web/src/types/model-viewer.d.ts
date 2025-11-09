declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      alt?: string;
      poster?: string;
      ar?: boolean;
      'ar-modes'?: string;
      'camera-controls'?: boolean;
      'auto-rotate'?: boolean;
      exposure?: string | number;
      'shadow-intensity'?: string | number;
      'environment-image'?: string;
      style?: React.CSSProperties;
      // Hotspot slots like slot="hotspot-0" are added on children buttons
    };
  }
}
