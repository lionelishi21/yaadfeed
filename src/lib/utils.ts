import { twMerge } from "tailwind-merge"

// Simple clsx replacement
function clsx(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs
    .filter(Boolean)
    .join(' ')
}

export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(...inputs))
}
