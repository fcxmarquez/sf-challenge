export type TaskFormFieldCopy = {
	title?: string;
	description?: string;
	deadline?: string;
};

export type TaskFormValues = {
	title: string;
	description: string;
	deadline: Date;
	deadlineTime: string;
};

export type TaskFormModalSubmitPayload = Pick<
	TaskFormValues,
	'title' | 'description'
> & {
	deadline: Date;
};

export type TaskFormModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	dialogTitle: string;
	dialogDescription: string;
	submitLabel: string;
	fieldCopy?: TaskFormFieldCopy;
	defaultValues: TaskFormValues;
	onSubmit: (values: TaskFormModalSubmitPayload) => void;
};
