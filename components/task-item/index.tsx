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
import { PencilIcon, TrashIcon } from 'lucide-react';
import { format } from 'date-fns';

type TaskItemProps = {
	id: string;
	title: string;
	description: string;
	deadline: Date;
	isCompleted: boolean;
	onComplete: (id: string) => void;
	onDelete: (id: string) => void;
	onUndoComplete: (id: string) => void;
	onEdit: (id: string) => void;
};

export const TaskItem = ({
	id,
	title,
	description,
	deadline,
	isCompleted,
	onComplete,
	onEdit,
	onDelete,
	onUndoComplete,
}: TaskItemProps) => {
	const formattedDeadline = format(deadline, "d MMMM 'of' yyyy, h:mm a");

	return (
		<Item variant={isCompleted ? 'muted' : 'outline'} key={id}>
			<ItemContent>
				<ItemTitle>{title}</ItemTitle>
				<ItemDescription>{description}</ItemDescription>
			</ItemContent>
			<ItemActions>
				<Button
					variant='outline'
					onClick={() => (isCompleted ? onUndoComplete(id) : onComplete(id))}
				>
					{isCompleted ? 'Undo' : 'Complete'}
				</Button>
				<Button variant='outline' size='icon' onClick={() => onEdit(id)}>
					<PencilIcon className='size-4' />
				</Button>
				<Button variant='destructive' size='icon' onClick={() => onDelete(id)}>
					<TrashIcon className='size-4' />
				</Button>
			</ItemActions>
			<ItemFooter>Deadline: {formattedDeadline}</ItemFooter>
		</Item>
	);
};
