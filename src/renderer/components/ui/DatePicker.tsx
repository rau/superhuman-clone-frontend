"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/Button"
import { Calendar } from "@/components/ui/Calendar"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/Popover"
import { cn } from "@/libs/utils"

interface DatePickerProps {
	date: Date
	setDate: (date: Date) => void
}

const DatePicker: React.FC<DatePickerProps> = ({ date, setDate }) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[280px] justify-start text-left font-normal",
						!date && "text-muted-foreground"
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={date}
					// @ts-ignore
					onSelect={setDate}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	)
}

export default DatePicker
