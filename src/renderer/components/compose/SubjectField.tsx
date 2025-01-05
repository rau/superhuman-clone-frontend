import { useComposeStore } from "@/hooks/useComposeStore"

const SubjectField = () => {
	const { subject, setSubject } = useComposeStore()

	return (
		<input
			type="text"
			value={subject}
			onChange={(e) => setSubject(e.target.value)}
			className="text-sm font-medium outline-none"
			placeholder="Subject"
		/>
	)
}

export { SubjectField }
