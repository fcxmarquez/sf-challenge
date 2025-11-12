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
	FieldError,
} from '@/components/ui/field';
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useTasksActions } from '@/store';
import { ChevronDownIcon } from 'lucide-react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';

export type TaskCreationModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

const formSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	deadline: z.date(),
});

export const TaskCreationModal = ({
	open,
	onOpenChange,
}: TaskCreationModalProps) => {
	const { createTask } = useTasksActions();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			description: '',
			deadline: new Date(),
		},
	});
	const [openCalendar, setOpenCalendar] = useState(false);

	useEffect(() => {
		if (!open) {
			form.reset();
		}
	}, [open]);

	const handleSubmit = (data: z.infer<typeof formSchema>) => {
		createTask({
			id: crypto.randomUUID(),
			title: data.title,
			description: data.description,
			deadline: data.deadline,
			isCompleted: false,
			createdAt: new Date(),
			updatedAt: new Date(),
			completedAt: null,
		});

		toast.error('Task created', {
			description: `"${data.title}" due ${data.deadline.toLocaleDateString()}`,
		});

		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<form id='task-creation-form' onSubmit={form.handleSubmit(handleSubmit)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create Task</DialogTitle>
						<DialogDescription>
							Create a new task to help you manage your time.
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
											<FieldLabel htmlFor='title'>Title</FieldLabel>
											<FieldDescription>
												What is the title of the task you want to create?
											</FieldDescription>
										</FieldContent>
										<Input
											{...field}
											id='title'
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
											<FieldLabel htmlFor='description'>Description</FieldLabel>
											<FieldDescription>
												What is the task you want to create?
											</FieldDescription>
										</FieldContent>
										<Input
											{...field}
											id='description'
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
											<FieldLabel htmlFor='deadline'>Deadline</FieldLabel>
											<FieldDescription>
												When is the deadline for the task?
											</FieldDescription>
										</FieldContent>
										<Popover open={openCalendar} onOpenChange={setOpenCalendar}>
											<PopoverTrigger asChild>
												<Button
													variant='outline'
													id='deadline'
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
						<Button type='submit' form='task-creation-form'>
							Create
						</Button>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
};
