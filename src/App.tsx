import { FC, useMemo, useState } from 'react'
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
import { Launch, Mission, Payload, PayloadCustomer } from './interfaces'
import {
  countPayloads,
  getAvgPayloadMass,
  getPayloadsByNationality,
} from './utils'

interface AppProps {}

const App: FC<AppProps> = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const toggleDarkMode: () => void = () => setDarkMode(!darkMode)
  const [filteredPayloadCustomers, setFilteredPayloadCustomers] = useState<
    PayloadCustomer[]
  >(payloadCustomers.data.payloads)
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>(
    missions.data.missions
  )

  // -- NOT USED YET --
  // const [filteredLaunches, setFilteredLaunches] = useState<Launch[]>(
  //   launches.data.launches
  // )
  // const [filteredDetailedLaunches, setFilteredDetailedLaunches] = useState<
  //   Launch[]
  // >(detailedLaunches.data.launches)

  const avgPayloadMass: number = useMemo(
    () => getAvgPayloadMass(filteredMissions),
    [filteredMissions]
  )

  const totalCountMissionPayloads: number = useMemo(
    () => countPayloads(filteredMissions),
    [filteredMissions]
  )
  const payloadsByNationality: { [key: string]: number } = useMemo(
    () => getPayloadsByNationality(filteredMissions),
    [filteredMissions]
  )

  console.log({ payloadsByNationality })

  return (
    <PageContainer darkMode={darkMode}>
      <main className='px-10 min-h-screen max-h-screen dark:bg-black-4 bg-white-lightMode_gradient w-full h-full overflow-y-auto transition-colors'>
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
              value: totalCountMissionPayloads,
              Icon: () => <Archive />,
              linkTo: '/',
            },
            {
              label: 'Avg. Payload Mass',
              value: `${avgPayloadMass.toFixed(0)} kg`,
              Icon: () => <Scale />,
              linkTo: '/',
            },
            {
              label: 'Total Payload Customers',
              value: filteredPayloadCustomers.length,
              Icon: () => <UserCircle />,
              linkTo: '/',
            },
          ].map((data) => {
            return <StatisticCard {...data} />
          })}
        </div>

        {/* Table (Title Card) */}

        {/* Remove Me */}
        {/* <div className='grid grid-cols-2 gap-y-8 w-1/2 place-items-center border dark:border-blue-dark p-4 rounded-lg shadow-lg border-none'>
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
        </div> */}
      </main>
    </PageContainer>
  )
}

export default App
