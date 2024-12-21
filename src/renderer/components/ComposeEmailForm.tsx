import { KeyboardTooltip } from "@/components/KeyboardTooltip"
import { useComposeStore } from "@/hooks/useZustand"
import { cn } from "@/libs/utils"
import { Paperclip, Trash2 } from "lucide-react"
import TextareaAutosize from "react-textarea-autosize"

interface ComposeEmailFormProps {
	onSend: () => void
	onDelete: () => void
	onAttach: () => void
	isSending: boolean
	isReply?: boolean
}

export const ComposeEmailForm = ({
	onSend,
	onDelete,
	onAttach,
	isSending,
	isReply = false,
}: ComposeEmailFormProps) => {
	const { message, subject, attachments, setMessage, setSubject } =
		useComposeStore()

	return (
		<div
			className={cn(
				"flex flex-col bg-white",
				isReply ? "border-t border-slate-200" : "flex-1"
			)}
		>
			{!isReply && (
				<input
					type="text"
					placeholder="Subject"
					value={subject}
					onChange={(e) => setSubject(e.target.value)}
					className="border-b border-slate-200 px-4 py-2 outline-none"
				/>
			)}

			<div className="flex min-h-0 flex-1 flex-col p-4">
				<TextareaAutosize
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="Write your message..."
					className="w-full resize-none outline-none"
					minRows={6}
					maxRows={12}
				/>
			</div>

			<div className="flex items-center justify-between border-t border-slate-200 p-4">
				<div className="flex items-center gap-2">
					<KeyboardTooltip keys={["⌘", "Enter"]} label="Send">
						<button
							onClick={onSend}
							disabled={isSending}
							className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
						>
							Send
						</button>
					</KeyboardTooltip>
				</div>

				<div className="flex items-center gap-1">
					<KeyboardTooltip keys={["⌘", "J"]} label="Write with AI">
						<button className="rounded-md p-2 hover:bg-slate-100">
							<span className="font-medium text-slate-500">
								AI
							</span>
						</button>
					</KeyboardTooltip>

					<KeyboardTooltip keys={["⌘", "⇧", "U"]} label="Attach">
						<button
							onClick={onAttach}
							className="rounded-md p-2 hover:bg-slate-100"
						>
							<Paperclip className="h-5 w-5 text-slate-500" />
						</button>
					</KeyboardTooltip>

					<KeyboardTooltip keys={["⌘", "shift", ","]} label="Discard">
						<button
							onClick={onDelete}
							className="rounded-md p-2 text-red-500 hover:bg-red-50"
						>
							<Trash2 className="h-5 w-5" />
						</button>
					</KeyboardTooltip>
				</div>
			</div>
		</div>
	)
}
