'use client';

import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemTitle,
} from '@/components/ui/item';
import { Button } from '../ui/button';

type TaskItemProps = {
	id: string;
	title: string;
	description: string;
	deadline: Date;
	onComplete: () => void;
	onDelete: () => void;
};

export const TaskItem = ({
	id,
	title,
	description,
	deadline,
	onComplete,
	onDelete,
}: TaskItemProps) => {
	return (
		<Item variant='outline' key={id}>
			<ItemContent>
				<ItemTitle>{title}</ItemTitle>
				<ItemDescription>{description}</ItemDescription>
			</ItemContent>
			<ItemActions>
				<Button variant='outline' onClick={onComplete}>
					Complete
				</Button>
				<Button variant='outline' onClick={onDelete}>
					Delete
				</Button>
			</ItemActions>
			<ItemFooter>Deadline: {deadline.toLocaleDateString()}</ItemFooter>
		</Item>
	);
};
