import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog"
import { useSettingsStore } from "@/hooks/useSettingsStore"
import { useUIStore } from "@/hooks/useUIStore"
import { cn } from "@/libs/utils"

const emojiOptions = ["🙌", "🙌🏻", "🙌🏼", "🙌🏽", "🙌🏾", "🙌🏿"]

export const EmojiSkinColorDialog = () => {
	const { isEmojiSkinColorOpen, setIsEmojiSkinColorOpen } = useUIStore()
	const { settings, setSettings } = useSettingsStore()

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Tab") {
			e.preventDefault()
			const nextIndex = e.shiftKey
				? (settings.emojiSkinColor - 1 + emojiOptions.length) %
					emojiOptions.length
				: (settings.emojiSkinColor + 1) % emojiOptions.length
			setSettings({ emojiSkinColor: nextIndex })
		}
	}

	return (
		<Dialog
			open={isEmojiSkinColorOpen}
			onOpenChange={setIsEmojiSkinColorOpen}
		>
			<DialogTitle hidden>Emoji</DialogTitle>
			<DialogContent className="w-[600px]" onKeyDown={handleKeyDown}>
				<div className="flex flex-col gap-6 p-6">
					<h2 className="text-xl font-semibold">Emoji</h2>
					<p className="text-sm text-slate-600">
						Choose a default skin tone for your emoji.
					</p>
					<div className="flex w-2/3 flex-row items-center justify-between">
						{emojiOptions.map((emoji, index) => (
							<div
								key={index}
								className={cn(
									"flex h-10 w-10 cursor-pointer flex-col items-center pb-[4px]",
									index === settings.emojiSkinColor &&
										"border-b-2 border-blue-600",
									index !== settings.emojiSkinColor &&
										"hover:border-b-2 hover:border-blue-400"
								)}
								onClick={() =>
									setSettings({ emojiSkinColor: index })
								}
							>
								<p className="text-[20px]">{emoji}</p>
							</div>
						))}
					</div>
					<p className="text-sm text-slate-600">
						To use an emoji just type{" "}
						<kbd className="rounded border border-slate-200 bg-slate-50 px-1 py-0.5 text-xs font-medium">
							:
						</kbd>{" "}
						and then the emoji's name!
					</p>
				</div>
			</DialogContent>
		</Dialog>
	)
}
