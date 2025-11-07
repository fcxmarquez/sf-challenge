'use client';

import { create } from 'zustand';
import { StoreState } from './types';
import { devtools } from 'zustand/middleware';
import { createTaskSlice } from './slices/taskSlice';

export const useStore = create<StoreState>()(
	devtools((...args) => ({
		...createTaskSlice(...args),
	}))
);

// selector hooks
export const useTasks = () => useStore((state) => state.tasks);

export const useTasksActions = () => {
  const createTask = useStore((state) => state.createTask);
  const deleteTask = useStore((state) => state.deleteTask);
  const completeTask = useStore((state) => state.completeTask);

  return {
    createTask,
		deleteTask,
		completeTask,
	};
};
