import * as React from "react";
import { JSX } from "react/jsx-runtime";

/**
 @name Document Digital Waveform
 @author yeyus
 @license MIT
 @description based upon collection: Scarlab Oval Line Icons by scarlab
 @see: https://www.svgrepo.com/svg/507648/document
*/
function DocumentDigitalIcon(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="transparent" {...props}>
      <path
        d="M17.8284 6.82843C18.4065 7.40649 18.6955 7.69552 18.8478 8.06306C19 8.4306 19 8.83935 19 9.65685L19 17C19 18.8856 19 19.8284 18.4142 20.4142C17.8284 21 16.8856 21 15 21H9C7.11438 21 6.17157 21 5.58579 20.4142C5 19.8284 5 18.8856 5 17L5 7C5 5.11438 5 4.17157 5.58579 3.58579C6.17157 3 7.11438 3 9 3H12.3431C13.1606 3 13.5694 3 13.9369 3.15224C14.3045 3.30448 14.5935 3.59351 15.1716 4.17157L17.8284 6.82843Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <polyline
        stroke="currentColor"
        strokeWidth="1"
        points="7.116 12.186 7.174 15.433 10.147 15.452 10.03 8.802 13.414 8.861 13.61 15.55 16.641 15.608 16.543 12.244"
      />
      <line stroke="currentColor" strokeWidth="0.5" x1="6.435" y1="12.166" x2="17.526" y2="12.284" />
    </svg>
  );
}

export default DocumentDigitalIcon;
