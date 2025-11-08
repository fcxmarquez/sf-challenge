'use client';

import { ItemContainer } from '@/components/item-container';
import { TaskCreator } from '@/components/task-creator';

export default function Home() {
	return (
		<div className='flex flex-col items-center justify-center p-8 w-full gap-4 max-w-3xl mx-auto'>
			<div className='flex justify-between w-full'>
				<h2 className='font-bold text-center'>
					Tasks
				</h2>
			</div>
			<ItemContainer />
      <TaskCreator onCreate={() => {}} />
		</div>
	);
}
