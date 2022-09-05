import { FC, useMemo, useState, useId, Fragment, ChangeEvent } from 'react'
import cn from 'classnames'
import {
  PageContainer,
  DashboardHeader,
  PieChartWithTable,
} from './components/Layout'
import { StatisticCard, TitleCard } from './components/Cards'
import { StatCardProps } from './components/Cards/StatisticCard'
import { TableComponent } from './components/Table'
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
import {
  DetailedLaunch,
  DetailedLaunchRow,
  Launch,
  Mission,
  Payload,
  PayloadCustomer,
} from './interfaces'

// JSON DATA
import missions from './datasets/missions.json'
import payloadCustomers from './datasets/payloadCustomers.json'
import detailedLaunches from './datasets/detailedLaunches.json'

import { ColumnFiltersState } from '@tanstack/react-table'
import { DebouncedInput } from './components/Table/Filter'

export interface TableFilter {
  id: string
  value: string
}

interface AppProps {}

const App: FC<AppProps> = () => {
  const statCardId = useId()

  // ------------------------- //
  // ---- Display Toggles ---- //
  // ------------------------- //
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const toggleDarkMode: () => void = () => setDarkMode(!darkMode)
  const [tableCardExpanded, setTableCardExpanded] = useState<boolean>(false)
  const toggleTableCardExpanded: () => void = () =>
    setTableCardExpanded(!tableCardExpanded)

  // -------------- //
  // ---- DATA ---- //
  // -------------- //
  const [filteredPayloadCustomers, setFilteredPayloadCustomers] = useState<
    PayloadCustomer[]
  >(payloadCustomers.data.payloads)
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>(
    missions.data.missions
  )
  const [filteredDetailedLaunches, setFilteredDetailedLaunches] = useState<
    DetailedLaunch[]
  >(detailedLaunches.data.launches)

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

  // ----------------------------------- //
  // ---- LAAUNCH SITE FILTER STATE ---- //
  // ----------------------------------- //
  const [launchSiteFilter, setLaunchSiteFilter] = useState<string>('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [launchSiteOptions, setLaunchSiteOptions] = useState<string[]>([])

  return (
    <PageContainer darkMode={darkMode}>
      <main className='px-10 min-h-screen max-h-screen dark:bg-black-4 bg-white-lightMode_gradient w-full overflow-y-auto transition-colors'>
        <DashboardHeader
          header='SpaceX Mission Dashboard'
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
          launchSiteOptions={launchSiteOptions}
          launchSiteFilter={launchSiteFilter}
          setLaunchSiteFilter={setLaunchSiteFilter}
        />

        <div className='relative'>
          <div
            className={cn(
              'flex flex-col lg:flex-row gap-4 mb-4',
              'transition-opacity duration-700',
              tableCardExpanded && 'opacity-0'
            )}>
            {/* Pie Chart */}
            <TitleCard
              className='w-full lg:w-1/2 transition-opacity'
              title={
                <Fragment>
                  <span>Payload Count By Nationality</span>
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
          {/* Table */}
          <TitleCard
            className={cn(
              'w-full mt-4 left-0 absolute transition-top duration-700 overflow-auto',
              tableCardExpanded ? '-top-4' : 'top-full'
            )}
            title={
              <div className='w-full flex justify-between items-center'>
                <span>SpaceX Launch Data</span>
                <span
                  className='cursor-pointer'
                  title='Expand Table'
                  onClick={toggleTableCardExpanded}>
                  <ArrowsExpand />
                </span>
              </div>
            }>
            <TableComponent
              filteredData={filteredDetailedLaunches}
              dynamicHeight={
                tableCardExpanded ? 'xsMaxH:h-40 h-table_height' : 'h-64'
              }
              searchKey='mission_name'
              setColumnFilters={setColumnFilters}
              columnFilters={columnFilters}
              hiddenFilters={['site']}
              launchSiteFilter={launchSiteFilter}
              setLaunchSiteOptions={setLaunchSiteOptions}
            />
          </TitleCard>
        </div>
      </main>
    </PageContainer>
  )
}

export default App
