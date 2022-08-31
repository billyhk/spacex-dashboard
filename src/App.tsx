import { FC, useState } from 'react'
import { PageContainer, DashboardHeader } from './components/Layout'
import launches from './datasets/launches.json'
import detailedLaunches from './datasets/detailedLaunches.json'
import missions from './datasets/missions.json'
import payloadCustomers from './datasets/payloadCustomers.json'

interface AppProps {}

const App: FC<AppProps> = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const toggleDarkMode: () => void = () => setDarkMode(!darkMode)

  return (
    <PageContainer darkMode={darkMode}>
      <main className='px-10 min-h-screen max-h-screen dark:bg-black-darkMode_background bg-white-lightMode_gradient w-full h-full overflow-y-auto'>
        <DashboardHeader
          header='SpaceX Mission Dashboard'
          toggleDarkMode={toggleDarkMode}
        />
      </main>
    </PageContainer>
  )
}

export default App
