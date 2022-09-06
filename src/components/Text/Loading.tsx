import { FC } from 'react'
import cn from 'classnames'

interface LoadingProps {
  children?: JSX.Element
  className?: string
}

export const Loading: FC<LoadingProps> = ({ children, className }) => (
  <span
    className={cn(
      className,
      'text-sm text-green-dark dark:text-white animate-pulse font-semibold'
    )}>
    {children ?? 'Loading...'}
  </span>
)
