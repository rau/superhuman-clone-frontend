import { clsx, type ClassValue } from "clsx"
import { UseFormGetValues, UseFormSetValue } from "react-hook-form"
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

export const handleAttach = async (
	setIsFileDialogOpen: (isOpen: boolean) => void,
	setValue: UseFormSetValue<ComposeFormData>,
	getValues: UseFormGetValues<ComposeFormData>
) => {
	setIsFileDialogOpen(true)
	const result = await window.electron.openFile()
	setIsFileDialogOpen(false)
	if (!result.canceled && result.filePaths.length > 0) {
		const filePath = result.filePaths[0]
		const stats = await window.electron.getFileStats(filePath)
		const content = await window.electron.readFile(filePath)
		setValue("attachments.current", [
			...getValues("attachments.current"),
			{
				name: filePath.split("/").pop()!,
				size: stats.size,
				path: filePath,
				content: content,
				type: "file",
			},
		])
	}
}
