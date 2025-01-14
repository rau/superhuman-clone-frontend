import { IconButton } from "@/components/ui/IconButton"
import { useComposeStore } from "@/hooks/useComposeStore"
import { useAddContact, useRemoveContact } from "@/libs/composeUtils"
import { filterContacts } from "@/libs/contactUtils"
import { cn } from "@/libs/utils"
import { ChevronDown, ChevronUp, PictureInPicture2, X } from "lucide-react"
import { useFormContext } from "react-hook-form"

const ContactChip = ({
	contact,
	field,
}: {
	contact: EmailParticipant
	field: RecipientField
}) => {
	const form = useFormContext<ComposeFormData>()
	const removeContact = useRemoveContact(form, field)
	const { selectedContacts, setSelectedContacts } = useComposeStore()
	const isSelected = selectedContacts[field].has(contact.email)

	return (
		<div
			className={cn(
				"group flex items-center gap-1 p-[2px]",
				isSelected || "hover:bg-slate-100 dark:hover:bg-slate-800",
				isSelected && "bg-slate-100 dark:bg-slate-800"
			)}
			onClick={() => {
				const newSelected = new Set(selectedContacts[field])
				if (isSelected) {
					newSelected.delete(contact.email)
				} else {
					newSelected.add(contact.email)
				}
				setSelectedContacts(field, newSelected)
			}}
		>
			<span className="select-none text-sm font-medium">
				{contact.name || contact.email}
			</span>

			<X
				className={cn(
					"h-3 w-3 text-slate-500 hover:cursor-pointer hover:text-slate-700",
					isSelected ? "block" : "hidden group-hover:block"
				)}
				onClick={(e) => {
					e.stopPropagation()
					removeContact(contact)
				}}
			/>
		</div>
	)
}

const ContactSuggestion = ({
	index,
	contact,
}: {
	index: number
	contact: EmailParticipant
}) => {
	const { selectedContactIndex, setSelectedContactIndex } = useComposeStore()
	const form = useFormContext<ComposeFormData>()
	const addContact = useAddContact(form)

	return (
		<div
			onClick={() => addContact(contact)}
			onMouseEnter={() => setSelectedContactIndex(index)}
			className={cn(
				"flex w-full cursor-pointer items-center gap-3 px-3 py-2",
				index === selectedContactIndex && "bg-slate-100"
			)}
		>
			<div className="flex w-full min-w-[500px] flex-row items-center">
				<span className="w-1/3 select-none text-left text-xs font-medium">
					{contact.name}
				</span>
				<span className="w-2/3 select-none text-left text-xs text-slate-500">
					{contact.email}
				</span>
			</div>
		</div>
	)
}

const RecipientFields = () => {
	const form = useFormContext<ComposeFormData>()
	const { showSuggestions, showCcBcc, activeField } = useComposeStore()

	const filteredContacts = filterContacts(form)

	const getSuggestionsPosition = () => {
		if (!showSuggestions || !filteredContacts?.length) return null

		const inputContainer = document.querySelector(
			`.${activeField}-container`
		)

		if (!inputContainer) return null
		if (activeField !== "to" && !showCcBcc) return null

		const rect = inputContainer.getBoundingClientRect()
		return {
			top: `${rect.bottom + window.scrollY}px`,
			width: `${rect.width - 50}px`,
			left: `${rect.left + 50}px`,
		}
	}

	return (
		<div className="relative">
			<div className="flex flex-col">
				<RecipientField field="to" />

				{showCcBcc && (
					<>
						<RecipientField field="cc" />
						<RecipientField field="bcc" />
					</>
				)}

				{showSuggestions && filteredContacts?.length > 0 && (
					<div
						className="fixed z-10 mt-1 rounded-md border border-slate-200 bg-white py-1 shadow-lg"
						style={getSuggestionsPosition() || {}}
					>
						{filteredContacts.map((contact, index) => (
							<ContactSuggestion
								key={index}
								index={index}
								contact={contact}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

const RecipientField = ({ field }: { field: RecipientField }) => {
	const {
		activeField,
		setActiveField,
		showCcBcc,
		setShowCcBcc,
		setToQuery,
		setCcQuery,
		setBccQuery,
		setShowSuggestions,
		setSelectedContactIndex,
		toQuery,
		ccQuery,
		bccQuery,
		setSelectedContacts,
		selectedContacts,
	} = useComposeStore()
	const { watch, setValue } = useFormContext<ComposeFormData>()
	const { to, cc, bcc } = watch()

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const contacts =
			activeField === "to" ? to : activeField === "cc" ? cc : bcc

		if (
			(e.key === "ArrowLeft" || e.key === "ArrowRight") &&
			e.currentTarget.value === ""
		) {
			e.preventDefault()

			const currentSelectedIndex = contacts.findIndex((c) =>
				selectedContacts[field].has(c.email)
			)
			let newIndex = currentSelectedIndex

			if (e.key === "ArrowLeft") {
				newIndex =
					currentSelectedIndex === -1
						? contacts.length - 1
						: Math.max(0, currentSelectedIndex - 1)
			} else if (currentSelectedIndex !== -1) {
				newIndex = Math.min(
					contacts.length - 1,
					currentSelectedIndex + 1
				)
			}

			if (newIndex !== -1 && newIndex !== currentSelectedIndex) {
				const newSelectedContact = contacts[newIndex]
				if (newSelectedContact) {
					setSelectedContacts(
						field,
						new Set([newSelectedContact.email])
					)
				}
			}
		}

		if (e.key === "Backspace") {
			const hasSelectedContacts = selectedContacts[field].size > 0

			if (e.currentTarget.value === "") {
				e.preventDefault()
				if (hasSelectedContacts) {
					const contacts = watch(field)
					const currentSelectedIndex = contacts.findIndex((c) =>
						selectedContacts[field].has(c.email)
					)
					setValue(
						field,
						contacts.filter(
							(c) => !selectedContacts[field].has(c.email)
						)
					)

					const remainingContacts = contacts.filter(
						(c) => !selectedContacts[field].has(c.email)
					)
					if (
						remainingContacts.length > 0 &&
						currentSelectedIndex < remainingContacts.length
					) {
						setSelectedContacts(
							field,
							new Set([
								remainingContacts[currentSelectedIndex].email,
							])
						)
					} else {
						setSelectedContacts(field, new Set())
					}
				} else {
					const contacts =
						activeField === "to"
							? to
							: activeField === "cc"
								? cc
								: bcc
					const lastContact = contacts[contacts.length - 1]
					if (lastContact) {
						setValue(activeField, [...contacts.slice(0, -1)])
						if (contacts.length > 1) {
							setSelectedContacts(
								field,
								new Set([contacts[contacts.length - 2].email])
							)
						}
					}
				}
			}
		}
	}

	const handleQueryChange = (value: string) => {
		if (value.length > 0) {
			setSelectedContacts(field, new Set())
		}

		if (activeField === "to") {
			setToQuery(value)
		} else if (activeField === "cc") {
			setCcQuery(value)
		} else if (activeField === "bcc") {
			setBccQuery(value)
		}
		if (value.length === 0) {
			setShowSuggestions(false)
		} else {
			setShowSuggestions(true)
			setSelectedContactIndex(0)
		}
	}

	let label = ""
	let contacts: EmailParticipant[] = []
	let query = ""

	if (field === "to") {
		label = "To"
		contacts = to
		query = toQuery
	} else if (field === "cc") {
		label = "Cc"
		contacts = cc
		query = ccQuery
	} else if (field === "bcc") {
		label = "Bcc"
		contacts = bcc
		query = bccQuery
	}

	return (
		<div className="flex items-center">
			<div
				className={`${field}-container flex flex-1 flex-wrap items-center py-1`}
			>
				<span className="w-[50px] text-sm font-medium">{label}</span>
				{contacts.map((contact, index) => (
					<div className="flex items-center" key={index}>
						<ContactChip contact={contact} field={field} />
						<span className="px-1 text-sm font-medium text-slate-400">
							&#183;
						</span>
					</div>
				))}
				<input
					data-field={field}
					type="text"
					value={query}
					onChange={(e) => handleQueryChange(e.target.value)}
					onFocus={() => setActiveField(field)}
					onBlur={() => {
						setSelectedContacts(field, new Set())
					}}
					onKeyDown={handleKeyDown}
					className={cn(
						"text-sm outline-none",
						field === "to" ? "ml-2 min-h-4 flex-1" : "flex-1"
					)}
					autoFocus={field === "to"}
				/>
			</div>
			{field === "to" && (
				<>
					<IconButton
						icon={showCcBcc ? ChevronUp : ChevronDown}
						onClick={() => setShowCcBcc(!showCcBcc)}
						keyboardShortcuts={[
							{
								keys: ["⌘", "shift", "C"],
								label: "Cc",
							},
							{
								keys: ["⌘", "shift", "B"],
								label: "Bcc",
							},
						]}
						tabIndex={-1}
						type="button"
					/>
					<IconButton
						icon={PictureInPicture2}
						tabIndex={-1}
						keyboardShortcuts={[
							{
								keys: ["⌘", "shift", "P"],
								label: "Popout",
							},
							{
								keys: ["⌘", "/"],
								label: "Popout and search",
							},
						]}
						size="sm"
						type="button"
					/>
				</>
			)}
		</div>
	)
}

export default RecipientFields
