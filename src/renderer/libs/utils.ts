import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const decodeHtml = (html: string) => {
	const txt = document.createElement("textarea")
	txt.innerHTML = html
	return txt.value.trim()
}
