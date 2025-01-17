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

export const debounce = <T extends (...args: any[]) => any>(
	func: T,
	wait: number
) => {
	let timeout: NodeJS.Timeout

	const executedFunction = function (...args: Parameters<T>) {
		const later = () => {
			clearTimeout(timeout)
			func(...args)
		}

		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
	}

	executedFunction.cancel = () => {
		clearTimeout(timeout)
	}

	return executedFunction
}
