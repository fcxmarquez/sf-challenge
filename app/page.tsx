'use client';

import { TaskContainer } from '@/components/task-container';
import { TaskCreator } from '@/components/task-creator';
import { useState } from 'react';
import { TaskCreationModal } from '@/components/modals/task-creation';

export default function Home() {
	const [openCreationDialog, setOpenCreationDialog] = useState(false);

	const handleCreateTask = () => {
		setOpenCreationDialog(true);
	};

	return (
		<>
			<TaskCreationModal
				open={openCreationDialog}
				onOpenChange={setOpenCreationDialog}
			/>
			<div className='flex flex-col items-center justify-center p-8 w-full gap-4 max-w-3xl mx-auto'>
				<div className='flex justify-between w-full'>
					<h2 className='font-bold text-center'>Tasks</h2>
				</div>
				<TaskCreator onCreate={handleCreateTask} />
				<TaskContainer />
			</div>
		</>
	);
}
