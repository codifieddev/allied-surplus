import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isHex(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export const setWithExpiry = (key: string, value: any, ttl: number) => {
  const now = new Date();

  const item = {
    value,
    expiry: now.getTime() + ttl, // ttl in ms
  };

  localStorage.setItem(key, JSON.stringify(item));
};

export const getWithExpiry = (key: string) => {
  const itemStr = localStorage.getItem(key);

  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key); // ⛔ expired → delete
    return null;
  }

  return item.value;
};
