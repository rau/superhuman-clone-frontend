import { KeyboardTooltip } from "@/components/KeyboardTooltip"
import { useContacts } from "@/hooks/dataHooks"
import { useComposeStore } from "@/hooks/useComposeStore"
import { filterContacts } from "@/libs/contactUtils"
import { cn } from "@/libs/utils"
import { ChevronDown, ChevronUp, PictureInPicture2, X } from "lucide-react"

const ContactChip = ({
	contact,
	field,
}: {
	contact: EmailParticipant
	field: RecipientField
}) => {
	const { removeContact } = useComposeStore()

	return (
		<div className="group flex items-center gap-1 hover:bg-slate-100">
			<span className="select-none text-sm font-medium">
				{contact.name || contact.email}
			</span>

			<X
				className="hidden h-3 w-3 text-slate-500 hover:cursor-pointer hover:text-slate-700 group-hover:block"
				onClick={() => removeContact(contact.email, field)}
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
	const {
		selectedContactIndex,
		setSelectedContactIndex,
		setShowSuggestions,
		setQuery,
		addContact,
		activeField,
	} = useComposeStore()

	const handleAddContact = () => {
		addContact(contact, activeField)
		setShowSuggestions(false)
		setQuery("", activeField)
	}

	return (
		<div
			onClick={handleAddContact}
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
	const { data: contacts } = useContacts()
	const {
		showSuggestions,
		removeContact,
		toContacts,
		ccContacts,
		bccContacts,
		toQuery,
		ccQuery,
		bccQuery,
		showCcBcc,
		setShowCcBcc,
		activeField,
		setActiveField,
		setShowSuggestions,
		setQuery,
		setSelectedContactIndex,
	} = useComposeStore()
	const filteredContacts = filterContacts(
		contacts,
		activeField === "to"
			? toQuery
			: activeField === "cc"
				? ccQuery
				: bccQuery,
		activeField === "to"
			? toContacts
			: activeField === "cc"
				? ccContacts
				: bccContacts
	)

	const handleQueryChange = (value: string, field: RecipientField) => {
		setQuery(value, field)
		if (value === "") {
			setShowSuggestions(false)
		} else {
			setShowSuggestions(true)
			setSelectedContactIndex(0)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
				removeContact(lastContact.email, activeField)
			}
		}
	}

	const getSuggestionsPosition = () => {
		if (!showSuggestions || !filteredContacts?.length) return null

		const inputContainer = document.querySelector(
			activeField === "to" ? ".to-container" : `.${activeField}-container`
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
				<div className="flex flex-row items-center">
					<div className="to-container flex flex-1 flex-wrap items-center py-1">
						<span className="w-[50px] text-sm font-medium">To</span>
						{toContacts.map((contact) => (
							<div className="flex items-center">
								<ContactChip
									key={contact.email}
									contact={contact}
									field="to"
								/>
								<span className="px-1 text-sm font-medium text-slate-400">
									&#183;
								</span>
							</div>
						))}
						<input
							autoFocus
							type="text"
							value={toQuery}
							onChange={(e) =>
								handleQueryChange(e.target.value, "to")
							}
							onFocus={() => setActiveField("to")}
							onKeyDown={handleKeyDown}
							className="ml-2 min-h-4 flex-1 text-sm outline-none"
						/>
					</div>
					<KeyboardTooltip
						tooltips={[
							{
								keys: ["⌘", "shift", "C"],
								label: "Cc",
							},
							{
								keys: ["⌘", "shift", "B"],
								label: "Bcc",
							},
						]}
						delayDuration={150}
					>
						<button
							onClick={() => setShowCcBcc(!showCcBcc)}
							className="rounded-full p-1 text-slate-500 hover:text-slate-700"
							tabIndex={-1}
						>
							{showCcBcc ? (
								<ChevronUp className="h-4 w-4" />
							) : (
								<ChevronDown className="h-4 w-4" />
							)}
						</button>
					</KeyboardTooltip>
					<KeyboardTooltip
						tooltips={[
							{
								keys: ["⌘", "shift", "P"],
								label: "Popout",
							},
							{
								keys: ["⌘", "/"],
								label: "Popout and search",
							},
						]}
						delayDuration={150}
					>
						<button
							className="text-slate-500 hover:text-slate-700"
							tabIndex={-1}
						>
							<PictureInPicture2 className="h-3 w-3" />
						</button>
					</KeyboardTooltip>
				</div>

				{showCcBcc && (
					<>
						<div className="flex items-center">
							<div className="cc-container flex flex-1 flex-wrap items-center py-1">
								<span className="w-[50px] text-sm font-medium">
									Cc
								</span>
								{ccContacts.map((contact) => (
									<div className="flex items-center">
										<ContactChip
											key={contact.email}
											contact={contact}
											field="cc"
										/>
										<span className="px-1 text-sm font-medium text-slate-400">
											&#183;
										</span>
									</div>
								))}
								<input
									data-cc-field
									type="text"
									value={ccQuery}
									onChange={(e) =>
										handleQueryChange(e.target.value, "cc")
									}
									onFocus={() => setActiveField("cc")}
									onKeyDown={handleKeyDown}
									className="ml-2 flex-1 text-sm outline-none"
								/>
							</div>
						</div>

						<div className="flex items-center">
							<div className="bcc-container flex flex-1 flex-wrap items-center py-1">
								<span className="w-[50px] text-sm font-medium">
									Bcc
								</span>
								{bccContacts.map((contact) => (
									<div className="flex items-center">
										<ContactChip
											key={contact.email}
											contact={contact}
											field="bcc"
										/>
										<span className="px-1 text-sm font-medium text-slate-400">
											&#183;
										</span>
									</div>
								))}
								<input
									data-bcc-field
									type="text"
									value={bccQuery}
									onChange={(e) =>
										handleQueryChange(e.target.value, "bcc")
									}
									onFocus={() => setActiveField("bcc")}
									onKeyDown={handleKeyDown}
									className="fl ex-1 text-sm outline-none"
								/>
							</div>
						</div>
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

export default RecipientFields
