"use client"

import { ComposePane } from "@/compose/ComposePane"
import { useParams } from "next/navigation"

const ComposePage = () => {
	const { draftId } = useParams()

	return <ComposePane draftId={draftId as string} />
}

export default ComposePage
