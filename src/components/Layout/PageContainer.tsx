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
    <div
      id='main_page_container'
      className={cn(
        'flex overflow-hidden h-screen',
        darkMode && 'dark',
        className
      )}>
      {children}
    </div>
  )
}
export default PageContainer
