import {
	TaskFormModal,
	TaskFormModalSubmitPayload,
	TaskFormValues,
} from '@/components/modals/task-form';
import { useTasksActions } from '@/store';
import { Task } from '@/store/types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useMemo } from 'react';

export type TaskEditModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	task?: Task | null;
};

const getDefaultValues = (task?: Task | null): TaskFormValues => {
	const referenceDeadline = task?.deadline ?? new Date();

	return {
		title: task?.title ?? '',
		description: task?.description ?? '',
		deadline: referenceDeadline,
		deadlineTime: format(referenceDeadline, 'HH:mm'),
	};
};

export const TaskEditModal = ({
	open,
	onOpenChange,
	task,
}: TaskEditModalProps) => {
	const { updateTask } = useTasksActions();
	const defaultValues = useMemo(() => getDefaultValues(task), [task]);

	const handleSubmit = (values: TaskFormModalSubmitPayload) => {
		if (!task) return;

		updateTask(task.id, {
			title: values.title,
			description: values.description,
			deadline: values.deadline,
		});

		toast.success('Task updated', {
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
			dialogTitle='Edit Task'
			dialogDescription='Update the details of your task to keep everything on track.'
			submitLabel='Save changes'
			defaultValues={defaultValues}
			fieldCopy={{
				title: 'Update the title of your task.',
				description: 'Modify the description of your task (optional).',
				deadline: 'Adjust the deadline for the task.',
			}}
			onSubmit={handleSubmit}
		/>
	);
};
