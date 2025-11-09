'use client';

import { useCallback, useMemo } from 'react';

import { TaskItem } from '@/components/task-item';
import { useTasks, useTasksActions } from '@/store';

export const TaskContainer = () => {
	const tasks = useTasks();
	const { completeTask, deleteTask, undoCompleteTask } = useTasksActions();

	const handleCompleteTask = useCallback(
		(id: string) => {
			completeTask(id);
		},
		[completeTask]
	);

	const handleDeleteTask = useCallback(
		(id: string) => {
			deleteTask(id);
		},
		[deleteTask]
	);

	const handleUndoCompleteTask = useCallback(
		(id: string) => {
			undoCompleteTask(id);
		},
		[undoCompleteTask]
	);

	const handleEditTask = useCallback((id: string) => {
		console.log('edit task', id);
	}, []);

	const orderedTasks = useMemo(
		() =>
			tasks
				.toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
				.toSorted((a, b) => {
					if (a.isCompleted && !b.isCompleted) return 1;
					if (!a.isCompleted && b.isCompleted) return -1;
					return 0;
				}),
		[tasks]
	);

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
