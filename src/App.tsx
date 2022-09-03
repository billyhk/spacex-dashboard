import { FC, useMemo, useState, useId, Fragment } from 'react'
import {
  PageContainer,
  DashboardHeader,
  PieChartWithTable,
} from './components/Layout'
import { StatisticCard, TitleCard } from './components/Cards'
import { StatCardProps } from './components/Cards/StatisticCard'
import {
  UserCircle,
  Archive,
  QuestionMark,
  Scale,

  // Table
  ArrowsExpand,
  Search,
  Arrow,
} from './components/Icons'
import {
  countPayloads,
  getAvgPayloadMass,
  getPayloadsByNationality,
  MappedPayload,
  sortByCount,
} from './utils'

import { Launch, Mission, Payload, PayloadCustomer } from './interfaces'
import missions from './datasets/missions.json'
import payloadCustomers from './datasets/payloadCustomers.json'
import launches from './datasets/launches.json'
import detailedLaunches from './datasets/detailedLaunches.json'

interface AppProps {}

const App: FC<AppProps> = () => {
  const statCardId = useId()
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const toggleDarkMode: () => void = () => setDarkMode(!darkMode)
  const [filteredPayloadCustomers, setFilteredPayloadCustomers] = useState<
    PayloadCustomer[]
  >(payloadCustomers.data.payloads)
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>(
    missions.data.missions
  )

  interface MemoizedData {
    avgPayloadMass: number
    totalCountMissionPayloads: number
    payloadsByNationality: MappedPayload[]
  }

  const memoized: MemoizedData = {
    avgPayloadMass: useMemo(
      () => getAvgPayloadMass(filteredMissions),
      [filteredMissions]
    ),
    totalCountMissionPayloads: useMemo(
      () => countPayloads(filteredMissions),
      [filteredMissions]
    ),
    payloadsByNationality: useMemo(
      () =>
        getPayloadsByNationality(filteredMissions)
          .sort(sortByCount)
          .slice(0, 5),
      [filteredMissions]
    ),
  }

  // -- NOT USED YET --
  // const [filteredLaunches, setFilteredLaunches] = useState<Launch[]>(
  //   launches.data.launches
  // )
  // const [filteredDetailedLaunches, setFilteredDetailedLaunches] = useState<
  //   Launch[]
  // >(detailedLaunches.data.launches)

  return (
    <PageContainer darkMode={darkMode}>
      <main className='px-10 min-h-screen max-h-screen dark:bg-black-4 bg-white-lightMode_gradient w-full h-full overflow-y-auto transition-colors'>
        <DashboardHeader
          header='SpaceX Mission Dashboard'
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
        />

        <div className='flex flex-col lg:flex-row gap-4'>
          {/* Pie Chart {Title Card) */}
          <TitleCard
            className='w-full lg:w-1/2'
            title={
              <Fragment>
                Payload Count By Nationality
                <span className='ml-2 cursor-pointer' title='Help'>
                  <QuestionMark />
                </span>
              </Fragment>
            }>
            <PieChartWithTable data={memoized.payloadsByNationality} />
          </TitleCard>

          {/* Stat Cards */}
          <div className='flex flex-col justify-between gap-y-1 w-full lg:w-1/2'>
            {[
              {
                label: 'Total Payloads',
                value: memoized.totalCountMissionPayloads,
                Icon: () => <Archive />,
                linkTo: '/',
              },
              {
                label: 'Avg. Payload Mass',
                value: `${memoized.avgPayloadMass.toFixed(0)} kg`,
                Icon: () => <Scale />,
                linkTo: '/',
              },
              {
                label: 'Total Payload Customers',
                value: filteredPayloadCustomers.length,
                Icon: () => <UserCircle />,
                linkTo: '/',
              },
            ].map((data: StatCardProps, i) => {
              return <StatisticCard {...data} key={`${statCardId}-${i}`} />
            })}
          </div>
        </div>

        {/* Table (Title Card) */}
      </main>
    </PageContainer>
  )
}

export default App
