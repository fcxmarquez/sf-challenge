'use client';

import { Button } from '@/components/ui/button';

type TaskCreatorProps = {
	onCreate: () => void;
};

export const TaskCreator = ({ onCreate }: TaskCreatorProps) => {
	return (
		<Button className='w-full' variant='outline' onClick={onCreate}>
			Create New Task +
		</Button>
	);
};
