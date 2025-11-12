export interface Task {
	id: string;
	title: string;
	description: string;
	deadline: Date;
	isCompleted: boolean;
	createdAt: Date;
	updatedAt: Date;
	completedAt: Date | null;
}

export interface TaskSlice {
	tasks: Task[];
	taskFilter: 'all' | 'completed' | 'pending';

	setTaskFilter: (filter: 'all' | 'completed' | 'pending') => void;
	createTask: (task: Task) => void;
	deleteTask: (id: string) => void;
	updateTask: (
		id: string,
		task: Pick<Task, 'title' | 'description' | 'deadline'>
	) => void;
	completeTask: (id: string) => void;
	undoCompleteTask: (id: string) => void;
}

export type StoreState = TaskSlice;
