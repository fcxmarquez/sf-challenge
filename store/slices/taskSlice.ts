'use client';

import { StateCreator } from 'zustand';
import { StoreState, Task, TaskSlice } from '../types';
// eslint-disable-next-line sonarjs/unused-import, @typescript-eslint/no-unused-vars
import { devtools } from 'zustand/middleware';

export const createTaskSlice: StateCreator<
	StoreState,
	[['zustand/devtools', never]],
	[],
	TaskSlice
> = (set) => ({
	tasks: [] as Task[],

	createTask: (task: Task) =>
		set((state) => ({
			tasks: [...state.tasks, task],
		})),

	deleteTask: (id: string) =>
		set((state) => {
			const newTasks = state.tasks.filter((task) => task.id !== id);
			return {
				tasks: newTasks,
			};
		}),

	completeTask: (id: string) =>
		set((state) => {
			const newTasks = state.tasks.map((task) =>
				task.id === id ? { ...task, isCompleted: true } : task
			);
			return {
				tasks: newTasks,
			};
		}),

	undoCompleteTask: (id: string) =>
		set((state) => {
			const newTasks = state.tasks.map((task) =>
				task.id === id ? { ...task, isCompleted: false } : task
			);
			return {
				tasks: newTasks,
			};
		}),
});
