import { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  className?: string;
}

const ContentWrapper: FC<Props> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-[1400px] flex-col px-4 py-6 sm:px-6 lg:px-8 max-[360px]:px-3 max-[360px]:py-5 overflow-x-hidden',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default ContentWrapper;
