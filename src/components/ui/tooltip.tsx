import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

type TooltipContentElement = React.ElementRef<typeof TooltipPrimitive.Content>;
type TooltipContentPrimitiveProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>;

interface TooltipContentProps extends TooltipContentPrimitiveProps {
  variant?: "default" | "light" | "dark";
}

const VARIANT_CLASSES = {
  default: "bg-primary text-primary-foreground",
  light: "bg-white text-gray-600 outline outline-gray-100",
  dark: "bg-black text-white",
} as const;

const TooltipContent = React.forwardRef<TooltipContentElement, TooltipContentProps>(
  ({ className, sideOffset = 4, variant = "default", ...props }, ref) => {
    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            "z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            VARIANT_CLASSES[variant],
            className
          )}
          {...props}
        />
      </TooltipPrimitive.Portal>
    );
  }
);

TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };