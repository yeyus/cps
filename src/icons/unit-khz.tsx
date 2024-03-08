import * as React from "react";
import { JSX } from "react/jsx-runtime";

/**
 @name Unit KKhz
 @author yeyus
 @license MIT
 @description Khz icon
*/
function UnitKhzIcon(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 22 22" fill="none" role="img" aria-labelledby="kiloHertzIcon" {...props}>
      <title id="kiloHertzIcon">kilohertz</title>
      <path
        d="M9.328 17H6.128L4.512 12.712L3.84 13.176V17H0.944V5.576H3.84V10.536C3.91467 10.3013 4.00533 10.0667 4.112 9.832C4.22933 9.58667 4.35733 9.336 4.496 9.08L6.288 5.576H9.408L6.592 10.696L9.328 17Z"
        fill="currentColor"
      />
      <path
        d="M12.688 9.44C12.688 9.776 12.676 10.092 12.652 10.388C12.628 10.676 12.596 10.94 12.556 11.18H12.664C12.76 10.964 12.876 10.788 13.012 10.652C13.156 10.508 13.32 10.404 13.504 10.34C13.696 10.276 13.908 10.244 14.14 10.244C14.524 10.244 14.86 10.336 15.148 10.52C15.436 10.704 15.66 10.976 15.82 11.336C15.98 11.696 16.06 12.144 16.06 12.68V17H13.948V13.328C13.948 12.88 13.904 12.548 13.816 12.332C13.736 12.108 13.608 11.996 13.432 11.996C13.232 11.996 13.076 12.068 12.964 12.212C12.86 12.356 12.788 12.58 12.748 12.884C12.708 13.18 12.688 13.552 12.688 14V17H10.6V7.88H12.688V9.44ZM21.4568 17H16.8368V15.788L18.9968 12.02H16.9568V10.364H21.3608V11.684L19.2968 15.344H21.4568V17Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default UnitKhzIcon;
