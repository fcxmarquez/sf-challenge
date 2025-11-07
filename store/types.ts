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

	createTask: (task: Task) => void;
	deleteTask: (id: string) => void;
	completeTask: (id: string) => void;
}

export type StoreState = TaskSlice;
