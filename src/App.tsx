import { FC, useState } from 'react'
import DashboardHeader from './components/DashboardHeader'
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

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const toggleDarkMode: () => void = () => setDarkMode(!darkMode)

  return (
    <PageContainer darkMode={darkMode}>
      <div className='px-10 h-screen max-h-screen dark:bg-black-darkMode_background bg-white-lightMode_gradient w-full h-full overflow-y-auto'>
        <DashboardHeader
          header='SpaceX Mission Dashboard'
          toggleDarkMode={toggleDarkMode}
        />
      </div>
    </PageContainer>
  )
}

export default App
