import Image from "next/image";
import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  maxWidthClassName?: string;
  /** The "space for the logo" placeholder. */
  showLogoPlaceholder?: boolean;
};

export function AuthShell({
  children,
  maxWidthClassName = "max-w-md",
  showLogoPlaceholder = true,
}: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-6">
      <Image
        src="/loginbackground.png"
        alt=""
        fill
        priority
        className="-z-10 object-cover"
      />

      <div
        className={`w-full ${maxWidthClassName} rounded-[2rem] bg-white p-10 shadow-2xl sm:p-12`}
      >
        {showLogoPlaceholder && (
          <p className="text-sm text-zinc-500">space for the logo</p>
        )}
        {children}
      </div>
    </div>
  );
}