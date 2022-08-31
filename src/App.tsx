import { FC, useState } from 'react'
import { PageContainer, DashboardHeader } from './components/Layout'

interface AppProps {}

const App: FC<AppProps> = () => {
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
