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
import { format } from 'date-fns';

export type TaskEditModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	task?: Task | null;
};

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const combineDateAndTime = (date: Date, time: string) => {
	const [hours = '0', minutes = '0'] = time.split(':');
	const result = new Date(date);
	result.setHours(Number(hours), Number(minutes), 0, 0);
	return result;
};

const formSchema = z
	.object({
		title: z.string().min(1, 'Title is required'),
		description: z.string().transform((value) => value.trim()),
		deadline: z.date(),
		deadlineTime: z
			.string()
			.min(1, 'Time is required')
			.regex(timeRegex, 'Invalid time'),
	})
	.superRefine((data, ctx) => {
		const deadlineWithTime = combineDateAndTime(
			data.deadline,
			data.deadlineTime
		);

		if (deadlineWithTime.getTime() < Date.now()) {
			ctx.addIssue({
				code: 'custom',
				message: 'Deadline cannot be in the past',
				path: ['deadlineTime'],
			});
		}
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
			deadlineTime: format(task?.deadline ?? new Date(), 'HH:mm'),
		},
	});
	const [openCalendar, setOpenCalendar] = useState(false);

	useEffect(() => {
		if (open && task) {
			form.reset({
				title: task.title,
				description: task.description,
				deadline: task.deadline,
				deadlineTime: format(task.deadline, 'HH:mm'),
			});
		}
	}, [open, task, form]);

	const handleSubmit = (data: z.infer<typeof formSchema>) => {
		if (!task) return;

		const deadlineWithTime = combineDateAndTime(
			data.deadline,
			data.deadlineTime
		);

		updateTask(task.id, {
			title: data.title,
			description: data.description,
			deadline: deadlineWithTime,
		});

		toast.success('Task updated', {
			description: `"${data.title}" due ${format(
				deadlineWithTime,
				"d MMMM yyyy',' h:mm a"
			)}`,
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
								render={({ field, fieldState }) => {
									const deadlineTimeError = form.formState.errors.deadlineTime;

									return (
										<Field
											data-invalid={
												fieldState.invalid || Boolean(deadlineTimeError)
											}
										>
											<FieldContent>
												<FieldLabel htmlFor='edit-deadline'>
													Deadline
												</FieldLabel>
												<FieldDescription>
													Adjust the deadline for the task.
												</FieldDescription>
											</FieldContent>
											<div className='flex items-center gap-2'>
												<Popover
													open={openCalendar}
													onOpenChange={setOpenCalendar}
												>
													<PopoverTrigger asChild>
														<Button
															variant='outline'
															id='edit-deadline'
															className='w-48 justify-between font-normal'
														>
															{field.value
																? format(field.value, "d MMMM 'of' yyyy")
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
																if (!date) return;
																const nextDate = combineDateAndTime(
																	date,
																	form.getValues('deadlineTime')
																);
																field.onChange(nextDate);
															}}
														/>
													</PopoverContent>
												</Popover>
												<Controller
													control={form.control}
													name='deadlineTime'
													render={({
														field: timeField,
														fieldState: timeState,
													}) => (
														<Input
															{...timeField}
															id='edit-deadline-time'
															type='time'
															required
															className='w-32'
															data-invalid={timeState.invalid}
															onChange={(event) => {
																const value = event.target.value;
																timeField.onChange(value);
																const currentDate = field.value ?? new Date();
																const nextDate = combineDateAndTime(
																	currentDate,
																	value
																);
																field.onChange(nextDate);
															}}
														/>
													)}
												/>
											</div>
											{fieldState.invalid ? (
												<FieldError errors={[fieldState.error]} />
											) : null}
											{deadlineTimeError ? (
												<FieldError errors={[deadlineTimeError]} />
											) : null}
										</Field>
									);
								}}
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
