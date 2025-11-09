'use client';

import { Button } from './button';
import { cn } from '@/lib/utils';

const PillGroup = ({ className, ...props }: React.ComponentProps<'div'>) => {
	return (
		<div
			role='group'
			className={cn('flex gap-2 bg-muted p-1 rounded-full', className)}
			{...props}
		/>
	);
};

type PillButtonProps = React.ComponentProps<typeof Button>;

const PillButton = ({
	className,
	...props
}: PillButtonProps) => {
	return <Button className={cn('rounded-full', className)} {...props} />;
};

export { PillGroup, PillButton };
