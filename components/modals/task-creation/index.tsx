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
import { format } from 'date-fns';

export type TaskCreationModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
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
		description: z.string().min(1, 'Description is required'),
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

const getDefaultDeadlineValues = () => {
	const now = new Date();
	return {
		deadline: now,
		deadlineTime: format(now, 'HH:mm'),
	};
};

export const TaskCreationModal = ({
	open,
	onOpenChange,
}: TaskCreationModalProps) => {
	const { createTask } = useTasksActions();
	const defaultDeadline = getDefaultDeadlineValues();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			description: '',
			deadline: defaultDeadline.deadline,
			deadlineTime: defaultDeadline.deadlineTime,
		},
	});
	const [openCalendar, setOpenCalendar] = useState(false);

	useEffect(() => {
		if (!open) {
			const nextDefaults = getDefaultDeadlineValues();
			form.reset({
				title: '',
				description: '',
				deadline: nextDefaults.deadline,
				deadlineTime: nextDefaults.deadlineTime,
			});
		}
	}, [open, form]);

	const handleSubmit = (data: z.infer<typeof formSchema>) => {
		const deadlineWithTime = combineDateAndTime(
			data.deadline,
			data.deadlineTime
		);

		createTask({
			id: crypto.randomUUID(),
			title: data.title,
			description: data.description,
			deadline: deadlineWithTime,
			isCompleted: false,
			createdAt: new Date(),
			updatedAt: new Date(),
			completedAt: null,
		});

		toast.success('Task created', {
			description: `"${data.title}" due ${format(
				deadlineWithTime,
				"d MMMM yyyy',' h:mm a"
			)}`,
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
								render={({ field, fieldState }) => {
									const deadlineTimeError = form.formState.errors.deadlineTime;

									return (
										<Field
											data-invalid={
												fieldState.invalid || Boolean(deadlineTimeError)
											}
										>
											<FieldContent>
												<FieldLabel htmlFor='deadline'>Deadline</FieldLabel>
												<FieldDescription>
													When is the deadline for the task?
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
															id='deadline'
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
															id='deadline-time'
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
						<Button type='submit' form='task-creation-form'>
							Create
						</Button>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
};
