"use client";

import React from "react";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "./ui/select";

type Option = { value: string; label: string };

type Props = {
	options: Option[];
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	className?: string;
};

const SelectComponent = ({
	options,
	value,
	defaultValue,
	onChange,
	placeholder = "Select",
	className,
}: Props) => {
	return (
		<Select value={value} defaultValue={defaultValue} onValueChange={onChange}>
			<SelectTrigger
				className={className ? `w-full md:w-48 ${className}` : "w-full md:w-48"}
			>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				{options.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default SelectComponent;
