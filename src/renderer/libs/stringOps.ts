export function isDateString(value: any): boolean {
	return typeof value === "string" && !isNaN(Date.parse(value))
}

export function convertDateStringsToDate(obj: any): any {
	if (Array.isArray(obj)) {
		return obj.map(convertDateStringsToDate)
	} else if (obj !== null && typeof obj === "object") {
		Object.keys(obj).forEach((key) => {
			obj[key] = convertDateStringsToDate(obj[key])
		})
		return obj
	} else if (isDateString(obj)) {
		return new Date(obj)
	}
	return obj
}

export const getTimeFromDates = (start: Date, end: Date) => {
	start = convertDateStringsToDate(start)
	end = convertDateStringsToDate(end)
	if (start instanceof Date && end instanceof Date) {
		const diff = end.getTime() - start.getTime()
		const hours = Math.floor(diff / 1000 / 60 / 60)
		const minutes = Math.floor((diff / 1000 / 60) % 60)
		const seconds = Math.floor((diff / 1000) % 60)

		return `${hours} hours, ${minutes} minutes, and ${seconds} seconds`
	}
	return "Invalid Dates"
}

export const formatSeconds = (seconds: number) => {
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)
	const remainingSeconds = seconds % 60

	return `${hours} hours, ${minutes} minutes, and ${remainingSeconds} seconds`
}

export function formatSecondsAsHours(seconds: number) {
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)
	return `${hours} hours and ${minutes} minutes`
}

export const formatMilliseconds = (milliseconds: number) => {
	const hours = Math.floor(milliseconds / 3600000)
	const minutes = Math.floor((milliseconds % 3600000) / 60000)
	const seconds = Math.floor((milliseconds % 60000) / 1000)
	if (hours === 0) return `${minutes}m ${seconds}s`
	return `${hours}h ${minutes}m ${seconds}s`
}

export const formatSender = (sender: string) => {
	const match = sender.match(/(.*?)\s*<(.+?)>/)
	if (!match) return sender

	const [_, name, email] = match
	return name.trim() || email
}
