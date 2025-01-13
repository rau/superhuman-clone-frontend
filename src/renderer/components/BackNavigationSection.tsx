import { KeyboardTooltip } from "@/components/KeyboardTooltip"
import { Button } from "@/components/ui/Button"
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react"

const BackNavigationSection = ({
	onClose,
	onPrevious,
	onNext,
}: {
	onClose: () => void
	onPrevious?: () => void
	onNext?: () => void
}) => {
	return (
		<div className="flex w-1/5 flex-col bg-background p-4">
			<div className="flex flex-row gap-2">
				<KeyboardTooltip
					tooltips={[
						{
							keys: ["Esc"],
							label: "Close",
						},
					]}
					delayDuration={150}
				>
					<Button
						onClick={onClose}
						variant="ghost"
						className="rounded-full bg-foreground shadow-md"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
				</KeyboardTooltip>

				<div className="flex flex-row gap-2 rounded-full bg-foreground shadow-md">
					<KeyboardTooltip
						tooltips={[
							{
								keys: ["K"],
								label: "Previous conversation",
							},
						]}
						delayDuration={150}
					>
						<Button variant="ghost" onClick={onPrevious}>
							<ChevronUp className="h-4 w-4" />
						</Button>
					</KeyboardTooltip>
					<KeyboardTooltip
						tooltips={[
							{
								keys: ["J"],
								label: "Next conversation",
							},
						]}
						delayDuration={150}
					>
						<Button variant="ghost" onClick={onNext}>
							<ChevronDown className="h-4 w-4" />
						</Button>
					</KeyboardTooltip>
				</div>
			</div>
		</div>
	)
}

export { BackNavigationSection }
