import settings from "electron-settings"

export const getQuickTips = async () => {
	return (await settings.get("quickTips")) as boolean
}

export const setQuickTips = async (value: boolean) => {
	await settings.set("quickTips", value)
}
