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
import { StatisticCard } from './components/Cards'

interface AppProps {}

const App: FC<AppProps> = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const toggleDarkMode: () => void = () => setDarkMode(!darkMode)

  return (
    <PageContainer darkMode={darkMode}>
      <main className='px-10 min-h-screen max-h-screen dark:bg-black-4 bg-white-lightMode_gradient w-full h-full overflow-y-auto'>
        <DashboardHeader
          header='SpaceX Mission Dashboard'
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
        />

        {/* Pie Chart {Title Card) */}
        
        {/* Stat Cards */}
        <div className='flex flex-col justify-between gap-y-1 w-1/2'>
          {[
            {
              label: 'Total Payloads',
              value: '310',
              Icon: () => <Archive />,
              linkTo: '/',
            },
            {
              label: 'Avg. Payload Mass',
              value: '2120',
              Icon: () => <Scale />,
              linkTo: '/',
            },
            {
              label: 'Total Payload Customers',
              value: '43',
              Icon: () => <UserCircle />,
              linkTo: '/',
            },
          ].map((data) => {
            return <StatisticCard {...data} />
          })}
        </div>

        {/* Table (Title Card) */}

        {/* Remove Me */}
        <div className='grid grid-cols-2 gap-y-8 w-1/2 place-items-center border dark:border-blue-dark p-4 rounded-lg shadow-lg border-none'>
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
