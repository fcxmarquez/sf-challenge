'use client';

import { TaskItem } from '../task-item';
import { useTasks } from '@/store';

export const ItemContainer = () => {
	const tasks = useTasks();

	return (
		<div className='flex flex-col gap-4 w-full'>
			{tasks.map((task) => (
				<TaskItem
					key={task.id}
					id={task.id}
					title={task.title}
					description={task.description}
					deadline={task.deadline}
					onComplete={() => {}}
					onDelete={() => {}}
				/>
			))}
		</div>
	);
};
