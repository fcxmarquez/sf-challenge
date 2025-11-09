import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from '@/components/ui/dialog';
import {
	Field,
	FieldGroup,
	FieldLabel,
	FieldSet,
	FieldContent,
	FieldDescription,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useTasksActions } from '@/store';

export type TaskCreationModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export const TaskCreationModal = ({
	open,
	onOpenChange,
}: TaskCreationModalProps) => {
	const { createTask } = useTasksActions();
	const [formData, setFormData] = useState<{ title: string; description: string }>({
		title: '',
		description: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		createTask({
			id: crypto.randomUUID(),
			title: formData.title,
			description: formData.description,
			deadline: new Date(new Date().setDate(new Date().getDate() + 7)),
			isCompleted: false,
			createdAt: new Date(),
			updatedAt: new Date(),
			completedAt: null,
		});

		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<form id='task-creation-form' onSubmit={handleSubmit}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create Task</DialogTitle>
						<DialogDescription>
							Create a new task to help you manage your time.
						</DialogDescription>
					</DialogHeader>
					<FieldSet>
						<FieldGroup>
							<Field>
								<FieldContent>
									<FieldLabel htmlFor='title'>Title</FieldLabel>
									<FieldDescription>
										What is the title of the task you want to create?
									</FieldDescription>
								</FieldContent>
								<Input
									id='title'
									type='text'
									placeholder='Task title'
									name='title'
									value={formData.title}
									onChange={handleChange}
								/>
							</Field>
							<Field>
								<FieldContent>
									<FieldLabel htmlFor='description'>Description</FieldLabel>
									<FieldDescription>
										What is the task you want to create?
									</FieldDescription>
								</FieldContent>
								<Input
									id='description'
									type='text'
									placeholder='Task description'
									name='description'
									value={formData.description}
									onChange={handleChange}
								/>
							</Field>
						</FieldGroup>
					</FieldSet>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant='outline' type='button'>
								Cancel
							</Button>
						</DialogClose>
						<Button type='submit' form='task-creation-form'>
							Create
						</Button>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
};
