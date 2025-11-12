import {
	TaskFormModal,
	TaskFormModalSubmitPayload,
	TaskFormValues,
} from '@/components/modals/task-form';
import { useTasksActions } from '@/store';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export type TaskCreationModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

const getDefaultFormValues = (): TaskFormValues => {
	const now = new Date();
	return {
		title: '',
		description: '',
		deadline: now,
		deadlineTime: format(now, 'HH:mm'),
	};
};

export const TaskCreationModal = ({
	open,
	onOpenChange,
}: TaskCreationModalProps) => {
	const { createTask } = useTasksActions();
	const defaultValues = useMemo<TaskFormValues>(() => {
		if (open) {
			return getDefaultFormValues();
		}

		return getDefaultFormValues();
	}, [open]);

	const handleSubmit = (values: TaskFormModalSubmitPayload) => {
		createTask({
			id: crypto.randomUUID(),
			title: values.title,
			description: values.description,
			deadline: values.deadline,
			isCompleted: false,
			createdAt: new Date(),
			updatedAt: new Date(),
			completedAt: null,
		});

		toast.success('Task created', {
			description: `"${values.title}" due ${format(
				values.deadline,
				"d MMMM yyyy',' h:mm a"
			)}`,
		});

		onOpenChange(false);
	};

	return (
		<TaskFormModal
			open={open}
			onOpenChange={onOpenChange}
			dialogTitle='Create Task'
			dialogDescription='Create a new task to help you manage your time.'
			submitLabel='Create'
			defaultValues={defaultValues}
			fieldCopy={{
				title: 'What is the title of the task you want to create?',
				description: 'Provide additional details about the task (optional).',
				deadline: 'When is the deadline for the task?',
			}}
			onSubmit={handleSubmit}
		/>
	);
};
