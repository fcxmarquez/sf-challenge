'use client';

import { PillGroup, PillButton } from '@/components/ui/pill-group';
import { useTasksActions, useTaskFilter } from '@/store';

export const Header = () => {
	const taskFilter = useTaskFilter();
	const { setTaskFilter } = useTasksActions();

	return (
		<header className='sticky top-0 z-50 p-4 w-full border-b border-border/60 shadow-sm bg-background/80 backdrop-blur-md'>
			<div className='flex items-center justify-between max-w-2xl mx-auto w-full'>
				<h1 className='text-2xl font-bold text-center'>Tasks List</h1>
				<PillGroup>
					<PillButton
						variant={taskFilter === 'all' ? 'default' : 'ghost'}
						onClick={() => setTaskFilter('all')}
					>
						All
					</PillButton>
					<PillButton
						variant={taskFilter === 'completed' ? 'default' : 'ghost'}
						onClick={() => setTaskFilter('completed')}
					>
						Completed
					</PillButton>
					<PillButton
						variant={taskFilter === 'pending' ? 'default' : 'ghost'}
						onClick={() => setTaskFilter('pending')}
					>
						Pending
					</PillButton>
				</PillGroup>
			</div>
		</header>
	);
};
