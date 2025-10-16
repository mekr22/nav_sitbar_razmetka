import { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  className?: string;
}

const ContentWrapper: FC<Props> = ({ children, className }) => {
  return (
    <div className={cn('container mx-auto px-4 py-6 max-[360px]:px-3 max-[360px]:py-5', className)}>
      {children}
    </div>
  );
};

export default ContentWrapper;
