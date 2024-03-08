import * as React from "react";
import { JSX } from "react/jsx-runtime";

/**
 @name Unit Hz
 @author yeyus
 @license MIT
 @description Hz icon
*/
function UnitHzIcon(props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 22" fill="none" role="img" aria-labelledby="hertzIcon" {...props}>
      <title id="hertzIcon">hertz</title>
      <path d="M9.184 17H6.288V12.264H3.84V17H0.944V5.576H3.84V9.864H6.288V5.576H9.184V17Z" fill="currentColor" />
      <path
        d="M14.824 17H10.204V15.788L12.364 12.02H10.324V10.364H14.728V11.684L12.664 15.344H14.824V17Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default UnitHzIcon;
