import { EmailSenderDetailsPane } from "@/components/EmailSenderDetailsPane"
import { KeyboardTooltip } from "@/components/KeyboardTooltip"
import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog"
import { sendEmailMutation, useContacts } from "@/hooks/dataHooks"
import { useUIStore } from "@/hooks/useUIStore"
import { useComposeStore } from "@/hooks/useZustand"
import { cn } from "@/libs/utils"
import {
	ArrowLeft,
	Braces as BracesIcon,
	Calendar as CalendarIcon,
	ChevronDown,
	ChevronUp,
	File,
	Paperclip,
	Trash2,
	X,
} from "lucide-react"
import { useEffect, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"

interface ComposePaneOverlayProps {
	isReply?: boolean
	replyToEmail?: EmailMessage
}

const ContactChip = ({
	contact,
	onRemove,
}: {
	contact: Contact
	onRemove: () => void
}) => (
	<span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-sm text-blue-700">
		{contact.name || contact.email}
		<Button
			onClick={onRemove}
			className="ml-1 rounded-full hover:bg-blue-100"
			variant="ghost"
		>
			<X className="h-3 w-3" />
		</Button>
	</span>
)

const SendEmptySubjectDialog = ({
	open,
	onOpenChange,
	onConfirm,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
	onConfirm: () => void
}) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Send without subject?</DialogTitle>
				<DialogDescription>
					Are you sure you want to send this email without a subject?
				</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button
					onClick={() => onOpenChange(false)}
					className="rounded-md px-3 py-1.5 text-sm hover:bg-slate-100"
				>
					Cancel
				</Button>
				<Button
					onClick={onConfirm}
					className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
				>
					Send anyway
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
)

const ContactSuggestion = ({
	contact,
	isSelected,
	onClick,
}: {
	contact: Contact
	isSelected: boolean
	onClick: () => void
}) => (
	<button
		onClick={onClick}
		className={cn(
			"flex w-full items-center gap-3 px-3 py-2 hover:bg-slate-50",
			isSelected && "bg-slate-100"
		)}
	>
		<Avatar className="h-6 w-6">
			<AvatarFallback className="text-xs">
				{contact.name?.[0].toUpperCase() ||
					contact.email[0].toUpperCase()}
			</AvatarFallback>
		</Avatar>
		<div className="flex flex-col items-start">
			<span className="text-sm font-medium">{contact.name}</span>
			<span className="text-xs text-slate-500">{contact.email}</span>
		</div>
	</button>
)

const MessageArea = ({
	message,
	onChange,
}: {
	message: string
	onChange: (value: string) => void
}) => (
	<div className="flex min-h-0 flex-1 flex-col">
		<div className="flex-1 overflow-y-auto">
			<TextareaAutosize
				value={message}
				onChange={(e) => onChange(e.target.value)}
				placeholder="Write your message..."
				className="w-full resize-none pt-1 font-light outline-none"
				minRows={12}
				maxRows={24}
			/>
		</div>
		<div className="flex items-center gap-2 border-t py-2 text-sm text-slate-500">
			<span>Hit</span>
			<kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
				Shift
			</kbd>
			<span>+</span>
			<kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
				Enter
			</kbd>
			<span>to add a new line</span>
		</div>
	</div>
)

const MessageActions = ({
	attachments,
	onAttach,
	onRemoveAttachment,
	onDelete,
	onSend,
	isSending,
}: {
	attachments: Attachment[]
	onAttach: () => void
	onRemoveAttachment: (path: string) => void
	onDelete: () => void
	onSend: () => void
	isSending: boolean
}) => (
	<div className="flex flex-col border-t border-slate-200">
		{attachments.length > 0 && (
			<div className="flex flex-wrap gap-2 border-b border-slate-200 p-4">
				{attachments.map((attachment) => (
					<AttachmentChip
						key={attachment.path}
						attachment={attachment}
						onRemove={() => onRemoveAttachment(attachment.path)}
					/>
				))}
			</div>
		)}
		<div className="flex items-center justify-between py-4">
			<div className="flex items-center gap-2">
				<KeyboardTooltip
					keys={["⌘", "Enter"]}
					label="Send"
					delayDuration={150}
				>
					<button
						onClick={onSend}
						disabled={isSending}
						className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
					>
						Send
					</button>
				</KeyboardTooltip>
				<KeyboardTooltip
					keys={["⌘", "shift", "L"]}
					label="Send later"
					delayDuration={150}
				>
					<button className="rounded-md border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50">
						Send later
					</button>
				</KeyboardTooltip>
				<KeyboardTooltip
					keys={["⌘", "shift", "H"]}
					label="Remind me"
					delayDuration={150}
				>
					<button className="rounded-md border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50">
						Remind me
					</button>
				</KeyboardTooltip>
			</div>
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-1">
					<KeyboardTooltip
						keys={["⌘", "J"]}
						label="Write with AI"
						delayDuration={150}
					>
						<button className="rounded-md p-2 hover:bg-slate-100">
							<span className="font-medium text-slate-500">
								AI
							</span>
						</button>
					</KeyboardTooltip>
					<KeyboardTooltip
						keys={["⌘", "shift", "A"]}
						label="Share availability"
						delayDuration={150}
					>
						<button className="rounded-md p-2 hover:bg-slate-100">
							<CalendarIcon className="h-5 w-5 text-slate-500" />
						</button>
					</KeyboardTooltip>
					<KeyboardTooltip
						keys={[";"]}
						label="Use snippet inline"
						delayDuration={150}
					>
						<button className="rounded-md p-2 hover:bg-slate-100">
							<BracesIcon className="h-5 w-5 text-slate-500" />
						</button>
					</KeyboardTooltip>

					<KeyboardTooltip
						keys={["⌘", "shift", "U"]}
						label="Attach"
						delayDuration={150}
					>
						<button
							onClick={onAttach}
							className="rounded-md p-2 hover:bg-slate-100"
						>
							<Paperclip className="h-5 w-5 text-slate-500" />
						</button>
					</KeyboardTooltip>
					<KeyboardTooltip
						keys={["⌘", "shift", ","]}
						label="Discard"
						delayDuration={150}
					>
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
	</div>
)

const AttachmentChip = ({
	attachment,
	onRemove,
}: {
	attachment: Attachment
	onRemove: () => void
}) => (
	<div className="flex items-center gap-2 rounded-md border border-slate-200 px-2 py-1">
		<File className="h-4 w-4 text-slate-500" />
		<div className="flex flex-col">
			<span className="text-sm">{attachment.name}</span>
			<span className="text-xs text-slate-500">
				{Math.round(attachment.size / 1024)}kb
			</span>
		</div>
		<button
			onClick={onRemove}
			className="ml-2 rounded-full p-1 hover:bg-slate-100"
		>
			<X className="h-3 w-3" />
		</button>
	</div>
)

const RecipientFields = ({
	toContacts,
	ccContacts,
	bccContacts,
	toQuery,
	ccQuery,
	bccQuery,
	showCcBcc,
	setShowCcBcc,
	onContactRemove,
	onQueryChange,
	onContactAdd,
	showSuggestions,
	filteredContacts,
	selectedContactIndex,
	activeField,
}: {
	toContacts: Contact[]
	ccContacts: Contact[]
	bccContacts: Contact[]
	toQuery: string
	ccQuery: string
	bccQuery: string
	showCcBcc: boolean
	setShowCcBcc: (show: boolean) => void
	onContactRemove: (email: string, field: "to" | "cc" | "bcc") => void
	onQueryChange: (value: string, field: "to" | "cc" | "bcc") => void
	onContactAdd: (contact: Contact, field: "to" | "cc" | "bcc") => void
	showSuggestions: boolean
	filteredContacts: Contact[]
	selectedContactIndex: number
	activeField: "to" | "cc" | "bcc"
}) => {
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault()
			const query =
				activeField === "to"
					? toQuery
					: activeField === "cc"
						? ccQuery
						: bccQuery

			if (query.includes("@")) {
				onContactAdd(
					{
						email: query,
					},
					activeField
				)
			}
		}

		if (e.key === "Backspace" && e.currentTarget.value === "") {
			e.preventDefault()
			const contacts =
				activeField === "to"
					? toContacts
					: activeField === "cc"
						? ccContacts
						: bccContacts
			const lastContact = contacts[contacts.length - 1]
			if (lastContact) {
				onContactRemove(lastContact.email, activeField)
			}
		}
	}
	return (
		<div className="relative">
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-2">
					<div className="relative flex flex-1 flex-wrap items-center gap-2 py-2">
						{toContacts.map((contact) => (
							<ContactChip
								key={contact.email}
								contact={contact}
								onRemove={() =>
									onContactRemove(contact.email, "to")
								}
							/>
						))}
						<input
							autoFocus
							type="text"
							value={toQuery}
							onChange={(e) =>
								onQueryChange(e.target.value, "to")
							}
							onKeyDown={handleKeyDown}
							placeholder={toContacts.length ? "" : "To"}
							className="flex-1 outline-none"
						/>
					</div>
					<button
						onClick={() => setShowCcBcc(!showCcBcc)}
						className="text-sm text-slate-500 hover:text-slate-700"
					>
						{showCcBcc ? "−" : "+"} Cc/Bcc
					</button>
				</div>

				{showCcBcc && (
					<>
						<div className="flex items-center gap-2 py-2">
							<span className="text-sm text-slate-500">Cc</span>
							<div className="flex flex-1 flex-wrap items-center gap-2">
								{ccContacts.map((contact) => (
									<ContactChip
										key={contact.email}
										contact={contact}
										onRemove={() =>
											onContactRemove(contact.email, "cc")
										}
									/>
								))}
								<input
									type="text"
									value={ccQuery}
									onChange={(e) =>
										onQueryChange(e.target.value, "cc")
									}
									onKeyDown={handleKeyDown}
									className="flex-1 outline-none"
								/>
							</div>
						</div>

						<div className="flex items-center gap-2 border-b border-slate-200 py-2">
							<span className="text-sm text-slate-500">Bcc</span>
							<div className="flex flex-1 flex-wrap items-center gap-2">
								{bccContacts.map((contact) => (
									<ContactChip
										key={contact.email}
										contact={contact}
										onRemove={() =>
											onContactRemove(
												contact.email,
												"bcc"
											)
										}
									/>
								))}
								<input
									type="text"
									value={bccQuery}
									onChange={(e) =>
										onQueryChange(e.target.value, "bcc")
									}
									onKeyDown={handleKeyDown}
									className="flex-1 outline-none"
								/>
							</div>
						</div>
					</>
				)}

				{showSuggestions && filteredContacts?.length > 0 && (
					<div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
						{filteredContacts.map((contact, index) => (
							<ContactSuggestion
								key={contact.email}
								contact={contact}
								isSelected={index === selectedContactIndex}
								onClick={() =>
									onContactAdd(contact, activeField)
								}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export const ComposePaneOverlay = ({
	isReply = false,
	replyToEmail,
}: ComposePaneOverlayProps) => {
	const { data: contacts } = useContacts()
	const { mutateAsync: sendEmail, isPending } = sendEmailMutation()
	const [showEmptySubjectDialog, setShowEmptySubjectDialog] = useState(false)
	const { setIsComposing } = useUIStore()
	const {
		toQuery,
		ccQuery,
		bccQuery,
		subject,
		message,
		toContacts,
		ccContacts,
		bccContacts,
		attachments,
		showCcBcc,
		showSuggestions,
		selectedContactIndex,
		setSelectedContactIndex,
		activeField,
		setActiveField,
		setShowSuggestions,
		setQuery,
		addContact,
		removeContact,
		setSubject,
		setMessage,
		addAttachment,
		removeAttachment,
		toggleCcBcc,
		reset,
	} = useComposeStore()

	const handleContactRemove = (email: string, field: "to" | "cc" | "bcc") => {
		removeContact(email, field)
	}

	const handleQueryChange = (value: string, field: "to" | "cc" | "bcc") => {
		setQuery(value, field)
		setActiveField(field)
		setShowSuggestions(true)
		setSelectedContactIndex(0)
	}

	const handleContactAdd = (contact: Contact, field: "to" | "cc" | "bcc") => {
		addContact(contact, field)
		setQuery("", field)
		setShowSuggestions(false)
	}

	const handleAttach = async () => {
		const result = await window.electron.openFile()
		if (!result.canceled && result.filePaths.length > 0) {
			const filePath = result.filePaths[0]
			const stats = await window.electron.getFileStats(filePath)
			addAttachment({
				name: filePath.split("/").pop()!,
				size: stats.size,
				path: filePath,
			})
		}
	}

	const handleRemoveAttachment = (path: string) => {
		removeAttachment(path)
	}

	const handleSend = () => {
		console.log("isReply", isReply)
		if (!subject.trim()) {
			setShowEmptySubjectDialog(true)
			return
		}
		sendEmail(
			{
				to: toContacts,
				cc: ccContacts,
				bcc: bccContacts,
				subject,
				body: message,
				attachments,
				replyToEmail: isReply ? replyToEmail : undefined,
			},
			{
				onSuccess: () => {
					setIsComposing(false)
				},
			}
		)
			.catch(() => {})
			.then(() => reset())
	}

	const filteredContacts =
		contacts
			?.filter((contact) => {
				const existingContacts =
					activeField === "to"
						? toContacts
						: activeField === "cc"
							? ccContacts
							: bccContacts

				const query =
					activeField === "to"
						? toQuery
						: activeField === "cc"
							? ccQuery
							: bccQuery

				return (
					!existingContacts.find(
						(c: Contact) => c.email === contact.email
					) &&
					(contact.email
						.toLowerCase()
						.includes(query.toLowerCase()) ||
						(contact.name?.toLowerCase() ?? "").includes(
							query.toLowerCase()
						))
				)
			})
			.slice(0, 5) || []

	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this draft?")) {
			setIsComposing(false)
		}
	}

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			console.log("handleKeyDown", e.key)
			if (!showSuggestions || !filteredContacts?.length) {
				if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
					e.preventDefault()
					handleSend()
					return
				}

				if (e.metaKey && e.shiftKey) {
					if (e.key === ",") {
						e.preventDefault()
						handleDelete()
						return
					}

					if (e.key === "u" || e.key === "U") {
						e.preventDefault()
						handleAttach()
						return
					}
				}
			}

			if (e.key === "ArrowDown") {
				e.preventDefault()

				setSelectedContactIndex(
					Math.min(
						selectedContactIndex + 1,
						filteredContacts.length - 1
					)
				)
			}
			if (e.key === "ArrowUp") {
				e.preventDefault()
				setSelectedContactIndex(Math.max(selectedContactIndex - 1, 0))
			}
			if (e.key === "Enter" && filteredContacts[selectedContactIndex]) {
				console.log(
					"adding contact",
					filteredContacts[selectedContactIndex]
				)
				e.preventDefault()
				addContact(filteredContacts[selectedContactIndex], activeField)
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [showSuggestions, filteredContacts, selectedContactIndex])

	return (
		<div className="absolute inset-0 z-40 flex flex-row bg-white">
			<SendEmptySubjectDialog
				open={showEmptySubjectDialog}
				onOpenChange={setShowEmptySubjectDialog}
				onConfirm={() => {
					setShowEmptySubjectDialog(false)
					sendEmail(
						{
							to: toContacts,
							cc: ccContacts,
							bcc: bccContacts,
							subject,
							body: message,
							attachments,
							replyToEmail: isReply ? replyToEmail : undefined,
						},
						{
							onSuccess: () => {
								setIsComposing(false)
							},
						}
					)
				}}
			/>
			<div className="flex w-64 flex-col bg-slate-50 p-4">
				<div className="flex flex-row gap-2">
					<Button
						onClick={() => setIsComposing(false)}
						variant="ghost"
						className="rounded-full bg-white shadow-md"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>

					<div className="flex flex-row gap-2 rounded-full bg-white shadow-md">
						<KeyboardTooltip
							keys={["K"]}
							label="Previous conversation"
						>
							<Button variant="ghost">
								<ChevronUp className="h-4 w-4" />
							</Button>
						</KeyboardTooltip>
						<KeyboardTooltip keys={["J"]} label="Next conversation">
							<Button variant="ghost">
								<ChevronDown className="h-4 w-4" />
							</Button>
						</KeyboardTooltip>
					</div>
				</div>
			</div>

			<div className="flex w-[calc(100%-400px-8rem)] flex-col items-center">
				<h2 className="w-4/5 p-4 pl-12 text-lg font-medium">
					New Message
				</h2>
				<div className="flex h-fit min-h-0 w-4/5 flex-col rounded-2xl p-4 shadow-2xl">
					<div className="flex flex-col gap-2">
						<RecipientFields
							toContacts={toContacts}
							ccContacts={ccContacts}
							bccContacts={bccContacts}
							toQuery={toQuery}
							ccQuery={ccQuery}
							bccQuery={bccQuery}
							showCcBcc={showCcBcc}
							setShowCcBcc={toggleCcBcc}
							onContactRemove={handleContactRemove}
							onQueryChange={handleQueryChange}
							onContactAdd={handleContactAdd}
							showSuggestions={showSuggestions}
							filteredContacts={filteredContacts}
							selectedContactIndex={selectedContactIndex}
							activeField={activeField}
						/>
						<input
							type="text"
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
							className="py-2 pr-4 outline-none"
							placeholder="Subject"
						/>
						<MessageArea message={message} onChange={setMessage} />
					</div>
					<MessageActions
						attachments={attachments}
						onAttach={handleAttach}
						onRemoveAttachment={handleRemoveAttachment}
						onDelete={handleDelete}
						onSend={handleSend}
						isSending={isPending}
					/>
				</div>
			</div>

			<div className="w-[400px] border-l border-slate-200">
				<EmailSenderDetailsPane email={replyToEmail} />
			</div>
		</div>
	)
}
