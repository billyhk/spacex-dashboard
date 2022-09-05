import { FC, useMemo, useState, useId, Fragment, useEffect } from 'react'
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
  ArrowsExpand,
  Cog,
  OfficeBuilding,
  ChevronDown,
} from './components/Icons'
import {
  countPayloads,
  flattenStrArray,
  getAvgPayloadMass,
  getPayloadsByNationality,
  MappedPayload,
  sortByCount,
} from './utils'
import { DetailedLaunch, Mission, Payload } from './interfaces'
import { ColumnFiltersState } from '@tanstack/react-table'
import { Switch } from './components/Inputs'
import { MenuButton } from './components/Button'

// JSON DATA
import missions from './datasets/missions.json'


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
  const [paginatedLaunches, setPaginatedLaunches] = useState<DetailedLaunch[]>(
    []
  )
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>(
    missions.data.missions
  )

  // Update state based on paginated table data
  useEffect(() => {
    setFilteredMissions(memoized.paginatedMissions)
  }, [paginatedLaunches])

  interface MemoizedData {
    avgPayloadMass: number
    totalCountMissionPayloads: number
    payloadsByNationality: MappedPayload[]
    paginatedMissions: Mission[]
    totalPayloadCustomers: number
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
    paginatedMissions: useMemo(() => {
      return missions.data.missions.filter((mission) => {
        const paginatedLaunchMissionIds = paginatedLaunches?.map(
          (launch) => launch.mission_id
        )
        return !!paginatedLaunchMissionIds?.find(
          (launch: string | string[]) => launch === mission.id
        )
      })
    }, [paginatedLaunches]),
    totalPayloadCustomers: useMemo(() => {
      const payloadsPerMission = filteredMissions.map((mission: Mission) => {
        return mission.payloads.filter((payload: Payload) => !!payload)
      })
      const helperFlatten = (arr: any[]): Payload[] => {
        return arr.reduce(
          (acc, val) =>
            acc.concat(Array.isArray(val) ? helperFlatten(val) : val),
          []
        ) as Payload[]
      }

      const flattenedPayloads = helperFlatten(payloadsPerMission)
      const customers = flattenedPayloads.map(
        (payload: Payload) => payload?.customers
      )

      const flattenedCustomers = flattenStrArray(customers)
      return flattenedCustomers.length
    }, [filteredMissions]),
  }


  // ----------------------------------- //
  // ---- LAAUNCH SITE FILTER STATE ---- //
  // ----------------------------------- //
  const [launchSiteFilter, setLaunchSiteFilter] = useState<string>('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [launchSiteOptions, setLaunchSiteOptions] = useState<string[]>([])

  const [menuOpen, setMenuOpen] = useState<'settings' | 'launch_site' | ''>('')

  const menuOptions = {
    settings: [
      <div className='flex flex-row justify-between gap-x-4'>
        <p>Light / Dark Theme</p>
        <Switch handleClick={toggleDarkMode} text='' active={darkMode} />
      </div>,
      <span className='cursor-pointer' onClick={() => {}}>
        Logout
      </span>,
    ],
  }

  // console.log({ paginatedLaunches, filteredMissions })
  return (
    <PageContainer darkMode={darkMode}>
      <main className='px-10 min-h-screen max-h-screen dark:bg-black-4 bg-white-lightMode_gradient w-full overflow-y-auto transition-colors'>
        <DashboardHeader header='SpaceX Mission Dashboard'>
          <div className='flex flex-row gap-x-4'>
            <MenuButton
              active={menuOpen === 'settings'}
              handleClick={() => {
                const active = menuOpen === 'settings'
                setMenuOpen(active ? '' : 'settings')
              }}
              className='w-40px grid place-items-center'
              menuItems={menuOptions.settings}>
              <Cog className={menuOpen === 'settings' ? 'stroke-white' : ''} />
            </MenuButton>

            <MenuButton
              active={menuOpen === 'launch_site'}
              handleClick={() => {
                const active = menuOpen === 'launch_site'
                setMenuOpen(active ? '' : 'launch_site')
              }}
              menuItems={[
                <span
                  className='cursor-pointer'
                  onClick={() => {
                    setLaunchSiteFilter('')
                    setFilteredMissions(memoized.paginatedMissions)
                    setMenuOpen('')
                  }}>
                  Clear Filter
                </span>,
                ...launchSiteOptions.map((opt) => (
                  <div
                    className='cursor-pointer'
                    onClick={() => {
                      // Filter Table
                      setLaunchSiteFilter(opt as string)
                      setFilteredMissions(memoized.paginatedMissions)
                      setMenuOpen('')
                    }}>
                    {opt}
                  </div>
                )),
              ]}>
              <div className='flex justify-between px-4 gap-x-10'>
                <span className='flex gap-x-2'>
                  <OfficeBuilding
                    className={menuOpen === 'launch_site' ? 'stroke-white' : ''}
                  />
                  {!!launchSiteFilter ? launchSiteFilter : 'Launch Site'}
                </span>
                <ChevronDown
                  className={cn(
                    'transition-transform',
                    menuOpen === 'launch_site' ? 'rotate-180 fill-white' : ''
                  )}
                />
              </div>
            </MenuButton>
          </div>
        </DashboardHeader>

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
                  value: memoized.totalPayloadCustomers,
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
              dynamicHeight={
                tableCardExpanded ? 'xsMaxH:h-40 h-table_height' : 'h-64'
              }
              searchKey='mission_name'
              setColumnFilters={setColumnFilters}
              columnFilters={columnFilters}
              hiddenFilters={['site']}
              launchSiteFilter={launchSiteFilter}
              setLaunchSiteOptions={setLaunchSiteOptions}
              onFetchedNewData={(paginatedData) => {
                setPaginatedLaunches(paginatedData)
              }}
            />
          </TitleCard>
        </div>
      </main>
    </PageContainer>
  )
}

export default App
