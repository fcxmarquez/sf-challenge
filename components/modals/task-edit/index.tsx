import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogClose,
} from '@/components/ui/dialog';
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from '@/components/ui/field';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useTasksActions } from '@/store';
import { Task } from '@/store/types';
import { ChevronDownIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import * as z from 'zod';

export type TaskEditModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	task?: Task | null;
};

const formSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	deadline: z.date(),
});

export const TaskEditModal = ({
	open,
	onOpenChange,
	task,
}: TaskEditModalProps) => {
	const { updateTask } = useTasksActions();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: task?.title ?? '',
			description: task?.description ?? '',
			deadline: task?.deadline ?? new Date(),
		},
	});
	const [openCalendar, setOpenCalendar] = useState(false);

	useEffect(() => {
		if (open && task) {
			form.reset({
				title: task.title,
				description: task.description,
				deadline: task.deadline,
			});
		}
	}, [task]);

	const handleSubmit = (data: z.infer<typeof formSchema>) => {
		if (!task) return;

		updateTask(task.id, {
			title: data.title,
			description: data.description,
			deadline: data.deadline,
		});

		toast.success('Task updated', {
			description: `"${data.title}" due ${data.deadline.toLocaleDateString()}`,
		});

		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<form id='task-edit-form' onSubmit={form.handleSubmit(handleSubmit)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Task</DialogTitle>
						<DialogDescription>
							Update the details of your task to keep everything on track.
						</DialogDescription>
					</DialogHeader>
					<FieldSet>
						<FieldGroup>
							<Controller
								control={form.control}
								name='title'
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldContent>
											<FieldLabel htmlFor='edit-title'>Title</FieldLabel>
											<FieldDescription>
												Update the title of your task.
											</FieldDescription>
										</FieldContent>
										<Input
											{...field}
											id='edit-title'
											type='text'
											placeholder='Task title'
										/>
										{fieldState.invalid ? (
											<FieldError errors={[fieldState.error]} />
										) : null}
									</Field>
								)}
							/>

							<Controller
								control={form.control}
								name='description'
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldContent>
											<FieldLabel htmlFor='edit-description'>
												Description
											</FieldLabel>
											<FieldDescription>
												Modify the description of your task.
											</FieldDescription>
										</FieldContent>
										<Input
											{...field}
											id='edit-description'
											type='text'
											placeholder='Task description'
										/>
										{fieldState.invalid ? (
											<FieldError errors={[fieldState.error]} />
										) : null}
									</Field>
								)}
							/>

							<Controller
								control={form.control}
								name='deadline'
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldContent>
											<FieldLabel htmlFor='edit-deadline'>Deadline</FieldLabel>
											<FieldDescription>
												Adjust the deadline for the task.
											</FieldDescription>
										</FieldContent>
										<Popover open={openCalendar} onOpenChange={setOpenCalendar}>
											<PopoverTrigger asChild>
												<Button
													variant='outline'
													id='edit-deadline'
													className='w-48 justify-between font-normal'
												>
													{field.value
														? field.value.toLocaleDateString()
														: 'Select date'}
													<ChevronDownIcon />
												</Button>
											</PopoverTrigger>
											<PopoverContent
												className='w-auto overflow-hidden p-0'
												align='start'
											>
												<Calendar
													mode='single'
													selected={field.value}
													captionLayout='dropdown'
													disabled={{ before: new Date() }}
													onSelect={(date) => {
														field.onChange(date ?? new Date());
													}}
												/>
											</PopoverContent>
										</Popover>
										{fieldState.invalid ? (
											<FieldError errors={[fieldState.error]} />
										) : null}
									</Field>
								)}
							/>
						</FieldGroup>
					</FieldSet>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant='outline' type='button'>
								Cancel
							</Button>
						</DialogClose>
						<Button type='submit' form='task-edit-form'>
							Save changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
};
