import { FC } from 'react'
import cn from 'classnames'

interface FallbackProps {
  children?: JSX.Element | string
  className?: string
  dataTerm?: string
}

export const Fallback: FC<FallbackProps> = ({ children, className, dataTerm }) => (
  <span className={cn(className, 'text-red-3 font-semibold')}>
    There is no {dataTerm || null} data to display for your current filters.
    {children}
  </span>
)
