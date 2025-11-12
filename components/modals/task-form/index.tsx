import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
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
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

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

export type TaskFormValues = z.infer<typeof formSchema>;

export type TaskFormModalSubmitPayload = Pick<
	TaskFormValues,
	'title' | 'description'
> & {
	deadline: Date;
};

export type TaskFormModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	dialogTitle: string;
	dialogDescription: string;
	submitLabel: string;
	fieldCopy?: {
		title?: string;
		description?: string;
		deadline?: string;
	};
	defaultValues: TaskFormValues;
	onSubmit: (values: TaskFormModalSubmitPayload) => void;
};

const defaultFieldCopy = {
	title: 'Update the title of your task.',
	description: 'Modify the description of your task (optional).',
	deadline: 'Adjust the deadline for the task.',
};

export const TaskFormModal = ({
	open,
	onOpenChange,
	dialogTitle,
	dialogDescription,
	submitLabel,
	fieldCopy,
	defaultValues,
	onSubmit,
}: TaskFormModalProps) => {
	const fieldText = {
		title: fieldCopy?.title ?? defaultFieldCopy.title,
		description: fieldCopy?.description ?? defaultFieldCopy.description,
		deadline: fieldCopy?.deadline ?? defaultFieldCopy.deadline,
	};
	const form = useForm<TaskFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});
	const [openCalendar, setOpenCalendar] = useState(false);

	useEffect(() => {
		if (open) {
			form.reset(defaultValues);
		}
	}, [open, defaultValues, form]);

	const handleSubmit = (data: z.infer<typeof formSchema>) => {
		const deadlineWithTime = combineDateAndTime(
			data.deadline,
			data.deadlineTime
		);

		onSubmit({
			title: data.title,
			description: data.description,
			deadline: deadlineWithTime,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<form id='task-form-modal' onSubmit={form.handleSubmit(handleSubmit)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{dialogTitle}</DialogTitle>
						<DialogDescription>{dialogDescription}</DialogDescription>
					</DialogHeader>
					<FieldSet>
						<FieldGroup>
							<Controller
								control={form.control}
								name='title'
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldContent>
											<FieldLabel htmlFor='task-form-title'>Title</FieldLabel>
											<FieldDescription>{fieldText.title}</FieldDescription>
										</FieldContent>
										<Input
											{...field}
											id='task-form-title'
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
											<FieldLabel htmlFor='task-form-description'>
												Description
											</FieldLabel>
											<FieldDescription>
												{fieldText.description}
											</FieldDescription>
										</FieldContent>
										<Input
											{...field}
											id='task-form-description'
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
												<FieldLabel htmlFor='task-form-deadline'>
													Deadline
												</FieldLabel>
												<FieldDescription>
													{fieldText.deadline}
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
															id='task-form-deadline'
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
															id='task-form-deadline-time'
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
						<Button type='submit' form='task-form-modal'>
							{submitLabel}
						</Button>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
};

export { combineDateAndTime, timeRegex };
