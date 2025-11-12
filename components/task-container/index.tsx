'use client';

import { TaskItem } from '@/components/task-item';
import { useTaskFilter, useTasks, useTasksActions, getTaskById } from '@/store';
import { useState } from 'react';
import { TaskDeleteAlert } from '@/components/modals/task-delete-alert';

export const TaskContainer = () => {
	const tasks = useTasks();
	const taskFilter = useTaskFilter();
	const { completeTask, deleteTask, undoCompleteTask } = useTasksActions();
	const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
	const [taskIdToDelete, setTaskIdToDelete] = useState<string>('');

	const handleCompleteTask = (id: string) => {
		completeTask(id);
	};

	const handleDeleteTask = (id: string) => {
		const task = getTaskById(id);
		if (!task) return;

		if (!task.isCompleted) {
			setTaskIdToDelete(id);
			setShowConfirmationDialog(true);
			return;
		}

		deleteTask(id);
	};

	const confirmDelete = () => {
		if (!taskIdToDelete) return;

		deleteTask(taskIdToDelete);
		setTaskIdToDelete('');
		setShowConfirmationDialog(false);
	};

	const handleUndoCompleteTask = (id: string) => {
		undoCompleteTask(id);
	};

	const handleEditTask = (id: string) => {
		console.log('edit task', id);
	};

	const orderedTasks = tasks
		.toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
		.toSorted((a, b) => {
			if (a.isCompleted && !b.isCompleted) return 1;
			if (!a.isCompleted && b.isCompleted) return -1;
			return 0;
		});

	const filteredTasks = orderedTasks.filter((task) => {
		if (taskFilter === 'all') return true;
		if (taskFilter === 'completed') return task.isCompleted;
		if (taskFilter === 'pending') return !task.isCompleted;
		return false;
	});

	if (filteredTasks.length === 0) {
		return (
			<div className='flex flex-col gap-4 w-full'>
				<p className='text-center text-bold'>No tasks yet! Keep going!</p>
			</div>
		);
	}

	return (
		<>
			<TaskDeleteAlert
				open={showConfirmationDialog}
				onOpenChange={setShowConfirmationDialog}
				onConfirm={confirmDelete}
			/>
			<div className='flex flex-col gap-4 w-full'>
				{filteredTasks.map((task) => (
					<TaskItem
						key={task.id}
						id={task.id}
						title={task.title}
						description={task.description}
						deadline={task.deadline}
						isCompleted={task.isCompleted}
						onComplete={handleCompleteTask}
						onEdit={handleEditTask}
						onDelete={handleDeleteTask}
						onUndoComplete={handleUndoCompleteTask}
					/>
				))}
			</div>
		</>
	);
};
