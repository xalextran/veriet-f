import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

interface LogoProps {
  height?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  height = 16,
  className = "",
}) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // SVG natural size is 151x29, so aspect ratio is 151/29
  const width = Math.round((151 / 29) * (typeof height === "number" ? height : parseInt(height || "16", 10)));

  // Only render the logo after the component is mounted to avoid hydration mismatch
  if (!mounted) {
    return <span className={className} style={{ height, display: "flex", alignItems: "center" }} />;
  }

  const logoSrc = resolvedTheme === "dark" ? "/logo-white.svg" : "/logo-black.svg";

  return (
    <span
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        lineHeight: 0,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    >
      <Image
        src={logoSrc}
        alt="Logo"
        height={height}
        width={width}
        style={{
          height: "100%",
          width: "auto",
          maxWidth: "100%",
          display: "block",
        }}
        draggable={false}
        priority
        unoptimized
      />
    </span>
  );
}; 