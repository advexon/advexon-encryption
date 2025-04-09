import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface LogoProps {
  src?: string
  alt?: string
  width?: number
  height?: number
  className?: string
  variant?: "default" | "light" | "dark"
  showText?: boolean
  textClassName?: string
  href?: string
}

export function Logo({
  src = "/logo.png", // Default logo path
  alt = "Fardo Encryption",
  width = 40,
  height = 40,
  className,
  variant = "default",
  showText = true,
  textClassName,
  href = "/",
}: LogoProps) {
  // Determine text color based on variant
  const textColorClass = variant === "light" ? "text-white" : variant === "dark" ? "text-gray-900" : "text-white"

  const logoContent = (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Logo image with fallback */}
      <div className="relative flex-shrink-0">
        {src ? (
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            width={width}
            height={height}
            className="object-contain"
            priority
          />
        ) : (
          <div
            className={cn(
              "flex items-center justify-center rounded-md bg-primary text-primary-foreground",
              `w-[${width}px] h-[${height}px]`,
            )}
          >
            <span className="font-bold text-lg">F</span>
          </div>
        )}
      </div>

      {/* Brand text */}
      {showText && (
        <span className={cn("font-bold text-xl tracking-tight", textColorClass, textClassName)}>Fardo Encryption</span>
      )}
    </div>
  )

  // Wrap in link if href is provided
  if (href) {
    return (
      <Link href={href} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}
