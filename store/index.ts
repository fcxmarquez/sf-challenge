'use client';

import { create } from 'zustand';
import { StoreState } from './types';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { createTaskSlice } from './slices/taskSlice';

const DATE_KEYS = new Set([
	'deadline',
	'createdAt',
	'updatedAt',
	'completedAt',
]);

// Revive data keys is to avoid the date object being serialized as a string when we require a Date type
const reviveDateKeys = (key: string, value: unknown) => {
	if (DATE_KEYS.has(key) && typeof value === 'string') {
		return new Date(value);
	}
	return value;
};

export const useStore = create<StoreState>()(
	persist(
		devtools((...args) => ({
			...createTaskSlice(...args),
		})),
		{
			name: 'task-storage',
			storage: createJSONStorage<StoreState>(() => localStorage, {
				reviver: reviveDateKeys,
			}),
		}
	)
);

// selector hooks
export const useTasks = () => useStore((state) => state.tasks);
export const useTaskFilter = () => useStore((state) => state.taskFilter);
export const getTaskById = (id: string) =>
	useStore.getState().tasks.find((task) => task.id === id);

export const useTasksActions = () => {
	const createTask = useStore((state) => state.createTask);
	const deleteTask = useStore((state) => state.deleteTask);
	const updateTask = useStore((state) => state.updateTask);
	const completeTask = useStore((state) => state.completeTask);
	const undoCompleteTask = useStore((state) => state.undoCompleteTask);
	const setTaskFilter = useStore((state) => state.setTaskFilter);

	return {
		createTask,
		deleteTask,
		updateTask,
		completeTask,
		undoCompleteTask,
		setTaskFilter,
	};
};
