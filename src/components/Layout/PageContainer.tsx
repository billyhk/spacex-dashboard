import { FC } from 'react'
import cn from 'classnames'

interface PageContainerProps {
  className?: string
  darkMode: boolean
  children: JSX.Element
}

const PageContainer: FC<PageContainerProps> = ({
  className,
  darkMode,
  children,
}) => {
  return (
    <div className={cn('flex overflow-hidden', className, darkMode && 'dark')}>
      {children}
    </div>
  )
}
export default PageContainer
