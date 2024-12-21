// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron"

export type Channels = "ipc-example" | "open-external-url"

const electronHandler = {
	ipcRenderer: {
		sendMessage(channel: Channels, ...args: unknown[]) {
			ipcRenderer.send(channel, ...args)
		},
		on(channel: Channels, func: (...args: unknown[]) => void) {
			const subscription = (
				_event: IpcRendererEvent,
				...args: unknown[]
			) => func(...args)
			ipcRenderer.on(channel, subscription)

			return () => {
				ipcRenderer.removeListener(channel, subscription)
			}
		},
		once(channel: Channels, func: (...args: unknown[]) => void) {
			ipcRenderer.once(channel, (_event, ...args) => func(...args))
		},
	},
}

contextBridge.exposeInMainWorld("electron", {
	openFile: () => ipcRenderer.invoke("open-file"),
	getFileStats: (path: string) => ipcRenderer.invoke("get-file-stats", path),
})

export type ElectronHandler = typeof electronHandler
