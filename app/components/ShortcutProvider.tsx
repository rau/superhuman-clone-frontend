"use client"

import { useAppShortcuts } from "@/hooks/useAppShortcuts"
import { useComposeShortcuts } from "@/hooks/useComposeShortcuts"
import { useForm } from "react-hook-form"

const ShortcutProvider = ({ children }: { children: React.ReactNode }) => {
	const form = useForm<ComposeFormData>({
		defaultValues: {
			to: [],
			cc: [],
			bcc: [],
			subject: "",
			message: "",
			attachments: { current: [], toDelete: [] },
		},
	})

	useComposeShortcuts(form)
	useAppShortcuts()

	return <>{children}</>
}

export { ShortcutProvider }
