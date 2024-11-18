import { clsx, type ClassValue } from 'clsx';  // import clsx for conditional classnames
import { twMerge } from 'tailwind-merge';  // import tailwind-merge to combine classnames

// utility function to combine and merge classnames
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));  // merge clsx output with tailwind-merge
}
