import { ItemContainer } from '@/components/item-container';
import { TaskCreator } from '@/components/task-creator';

export default function Home() {
	return (
		<div className='flex flex-col items-center justify-center p-8 w-full gap-4 max-w-3xl mx-auto'>
			<ItemContainer />
      <TaskCreator onCreate={() => {}} />
		</div>
	);
}
