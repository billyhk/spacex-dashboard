import { FC, useState } from 'react'
import { PageContainer, DashboardHeader } from './components/Layout'
import launches from './datasets/launches.json'
import detailedLaunches from './datasets/detailedLaunches.json'
import missions from './datasets/missions.json'
import payloadCustomers from './datasets/payloadCustomers.json'

// Remove Me
import {
  ArrowsExpand,
  UserCircle,
  Archive,
  ChevronDown,
  ChevronRight,
  Cog,
  OfficeBuilding,
  QuestionMark,
  Scale,
  Search,
  Arrow,
} from './components/Icons'

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

        {/* Remove Me */}
        <div className='grid grid-cols-2 gap-y-8 w-1/2 place-items-center border dark:border-blue-dark p-4 rounded-lg shadow-lg'>
          <Archive />
          <ArrowsExpand />
          <UserCircle />
          <ChevronDown />
          <ChevronRight />
          <Cog />
          <OfficeBuilding />
          <QuestionMark />
          <Scale />
          <Search />
          <Arrow className='rotate-90 dark:-rotate-90 transition' />
        </div>
      </main>
    </PageContainer>
  )
}

export default App
