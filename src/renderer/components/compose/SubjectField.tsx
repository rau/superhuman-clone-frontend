import { UseFormReturn } from "react-hook-form"

interface SubjectFieldProps {
	form: UseFormReturn<ComposeFormData>
}

const SubjectField = ({ form }: SubjectFieldProps) => {
	const { setValue, watch } = form
	const subject = watch("subject")

	return (
		<input
			type="text"
			value={subject}
			onChange={(e) => setValue("subject", e.target.value)}
			className="text-sm font-medium outline-none"
			placeholder="Subject"
		/>
	)
}

export { SubjectField }
