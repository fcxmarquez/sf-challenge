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

	const orderedTasks = tasks.toSorted(
		(a, b) => a.createdAt.getTime() - b.createdAt.getTime()
	);

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
					onDelete={handleDeleteTask}
					onUndoComplete={handleUndoCompleteTask}
				/>
			))}
		</div>
	);
};
