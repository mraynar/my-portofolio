import { ICON_REGISTRY, DEFAULT_ICON } from "./registry.js";

// Unified SVG Icon component with token sizes
export function Icon({
  name,
  size = 20,
  className = "",
  ariaHidden = true,
  ariaLabel,
  strokeWidth = 2,
  style = {},
}) {
  const Component = ICON_REGISTRY[name] || DEFAULT_ICON;
  const isDecorative = ariaHidden && !ariaLabel;

  return (
    <Component
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden={isDecorative ? "true" : undefined}
      aria-label={ariaLabel}
      role={isDecorative ? undefined : "img"}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
