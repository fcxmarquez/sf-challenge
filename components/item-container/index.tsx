'use client';

import { TaskItem } from '@/components/task-item';
import { useTasks, useTasksActions } from '@/store';

export const ItemContainer = () => {
	const tasks = useTasks();
	const { completeTask, deleteTask, undoCompleteTask } = useTasksActions();

	const handleCompleteTask = (id: string) => {
		completeTask(id);
	};

	const handleDeleteTask = (id: string) => {
		deleteTask(id);
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

	if (orderedTasks.length === 0) {
		return (
			<div className='flex flex-col gap-4 w-full'>
				<p className='text-center text-bold'>No tasks yet! Keep going!</p>
			</div>
		);
	}

	return (
		<div className='flex flex-col gap-4 w-full'>
			{orderedTasks.map((task) => (
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
	);
};
