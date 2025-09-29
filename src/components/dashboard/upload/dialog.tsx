import React from "react";
import UploadForm from "./upload-form";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";

const UploadDialog = ({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
}) => {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-[1000px] sm:max-h-[900px]">
				<DialogTitle className="text-3xl text-photo-green-300 font-bold">
					Upload
				</DialogTitle>
				<DialogDescription>
					<UploadForm onDone={() => setOpen(false)} />
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
};

export default UploadDialog;
