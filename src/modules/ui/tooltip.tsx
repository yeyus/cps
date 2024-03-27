import { useFloating, useHover, useInteractions } from "@floating-ui/react";
import { Popover } from "@headlessui/react";
import classNames from "classnames";
import * as React from "react";

import styles from "./tooltip.module.css";

interface TooltipProps {
  className?: string;
  tooltipRenderer: () => React.ReactNode;
  children: React.ReactNode;
}

export default function Tooltip({ className, tooltipRenderer, children, ...props }: TooltipProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-end",
    open: isOpen,
    onOpenChange: setIsOpen,
  });
  const hover = useHover(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <Popover>
      <Popover.Button
        ref={refs.setReference}
        className={classNames(className, styles.hoverElement)}
        {...getReferenceProps()}
        {...props}
      >
        {children}
      </Popover.Button>

      {isOpen && (
        <Popover.Panel
          static
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className={styles.tooltip}
        >
          {tooltipRenderer()}
        </Popover.Panel>
      )}
    </Popover>
  );
}
