import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function allTruthy(...args) {
  return args.every(
    (arg) => arg !== undefined && arg !== null && arg !== false
  );
}

export function anyTruthy(...args) {
  return args.some((arg) => arg !== undefined && arg !== null && arg !== false);
}

export function valueOrDefault(value, defaultValue) {
  return value || defaultValue;
}
