'use client';

import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemTitle,
} from '@/components/ui/item';
import { Button } from '@/components/ui/button';

type TaskItemProps = {
	id: string;
	title: string;
	description: string;
	deadline: Date;
	isCompleted: boolean;
	onComplete: (id: string) => void;
	onDelete: (id: string) => void;
	onUndoComplete: (id: string) => void;
};

export const TaskItem = ({
	id,
	title,
	description,
	deadline,
	isCompleted,
	onComplete,
	onDelete,
	onUndoComplete,
}: TaskItemProps) => {
	return (
		<Item variant={isCompleted ? 'muted' : 'outline'} key={id}>
			<ItemContent>
				<ItemTitle>{title}</ItemTitle>
				<ItemDescription>{description}</ItemDescription>
			</ItemContent>
			<ItemActions>
				<Button variant='outline' onClick={() => isCompleted ? onUndoComplete(id) : onComplete(id)}>
					{isCompleted ? 'Undo' : 'Complete'}
				</Button>
				<Button variant='outline' onClick={() => onDelete(id)}>
					Delete
				</Button>
			</ItemActions>
			<ItemFooter>Deadline: {deadline.toLocaleDateString()}</ItemFooter>
		</Item>
	);
};
