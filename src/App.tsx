import { FC, useMemo, useState, Fragment } from 'react'
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
  Loading,
} from './components/Icons'
import {
  getAverage,
  getLaunchSiteOptions,
  getPayloadMasses,
  getPayloadsByNationality,
  getTotalPayloadCustomers,
  MappedPayload,
  sortByCount,
} from './utils'
import {
  DetailedLaunchRow,
  Mission,
  MissionPayloads,
  Payload,
} from './interfaces'
import { Switch } from './components/Inputs'
import { MenuButton } from './components/Button'

interface AppProps {}

const App: FC<AppProps> = () => {
  // ------------------------- //
  // ---- Display Toggles ---- //
  // ------------------------- //
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const toggleDarkMode: () => void = () => setDarkMode(!darkMode)

  const [tableCardExpanded, setTableCardExpanded] = useState<boolean>(false)
  const toggleTableCardExpanded: () => void = () =>
    setTableCardExpanded(!tableCardExpanded)

  const [menuOpen, setMenuOpen] = useState<'settings' | 'launch_site' | ''>('')
  const [isApiLoading, setIsApiLoading] = useState<boolean>(true)

  // ----------------------------------- //
  // ---- LAAUNCH SITE FILTER STATE ---- //
  // ----------------------------------- //
  const [launchSiteFilter, setLaunchSiteFilter] = useState<string>('')

  // --------------------------------------------- //
  // ---- Primary DATA (launches and missions)---- //
  // --------------------------------------------- //
  const [paginatedLaunches, setPaginatedLaunches] = useState<
    DetailedLaunchRow[]
  >([])
  const [paginatedMissions, setPaginatedMissions] = useState<Mission[]>([])

  const filteredLaunches: DetailedLaunchRow[] = useMemo(() => {
    const launchesBySite = paginatedLaunches.filter(
      (launch) => launch.site === launchSiteFilter
    )
    if (launchSiteFilter) {
      return launchesBySite
    } else {
      return paginatedLaunches
    }
  }, [launchSiteFilter, paginatedLaunches])

  const filteredMissionPayloads: MissionPayloads = useMemo(() => {
    const getFilteredMissions = () => {
      const result = paginatedMissions.filter((mission) => {
        const paginatedLaunchMissionIds = filteredLaunches.map(
          (launch) => launch.mission_id
        )
        // filter missions based on launch site
        return !!paginatedLaunchMissionIds.find((launch: string | string[]) => {
          return launch === mission.id
        })
      })
      return result
    }

    const mappedPayloads = getFilteredMissions()
      .map((mission) =>
        mission.payloads.map((payload: Payload) => payload ?? [])
      )
      .flat()
      .filter((payload) => !Array.isArray(payload)) // if payload is [] here, then it was null in the database above

    return mappedPayloads
  }, [filteredLaunches, paginatedMissions])

  // --------------------------------------------------------------------- //
  // ---- Secondary DATA (memoized, dependendent upon primary data) ------ //
  // --------------------------------------------------------------------- //
  interface MemoizedData {
    payloadMasses: number[]
    payloadsByNationality: MappedPayload[]
    totalPayloadCustomers: number
    launchSiteOptions: string[]
  }
  const memoized: MemoizedData = {
    payloadMasses: useMemo(
      () => getPayloadMasses(filteredMissionPayloads),
      [filteredMissionPayloads]
    ),
    payloadsByNationality: useMemo(
      () =>
        getPayloadsByNationality(filteredMissionPayloads)
          .sort(sortByCount)
          .slice(0, 5),
      [filteredMissionPayloads]
    ),
    totalPayloadCustomers: useMemo(
      () => getTotalPayloadCustomers(filteredMissionPayloads),
      [filteredMissionPayloads]
    ),
    launchSiteOptions: useMemo(
      () => getLaunchSiteOptions(paginatedLaunches).sort(),
      [paginatedLaunches]
    ),
  }

  return (
    <PageContainer darkMode={darkMode}>
      <main className='px-8 md:px-10 dark:bg-black-4 bg-white-lightMode_gradient w-full overflow-y-auto transition-colors'>
        <DashboardHeader header='SpaceX Mission Dashboard'>
          {/* Settings Menu */}
          <div className='flex flex-row gap-x-4'>
            <MenuButton
              active={menuOpen === 'settings'}
              handleClick={() => {
                const active = menuOpen === 'settings'
                setMenuOpen(active ? '' : 'settings')
              }}
              className='w-40px grid place-items-center'
              menuItems={[
                <div className='flex flex-row justify-between gap-x-4'>
                  <p>Light / Dark Theme</p>
                  <Switch
                    handleClick={toggleDarkMode}
                    text=''
                    active={darkMode}
                  />
                </div>,
                <span className='cursor-pointer' onClick={() => {}}>
                  Logout
                </span>,
              ]}>
              <Cog className={menuOpen === 'settings' ? '!stroke-white' : ''} />
            </MenuButton>

            {/* Launch Site Filters */}
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
                    // Filter Table & Close Menu
                    setLaunchSiteFilter('')
                    setMenuOpen('')
                  }}>
                  Clear Filter
                </span>,
                ...memoized.launchSiteOptions.map((opt) => (
                  <div
                    className='cursor-pointer'
                    onClick={() => {
                      setLaunchSiteFilter(opt as string)
                      setMenuOpen('')
                    }}>
                    {opt}
                  </div>
                )),
              ]}>
              <div className='flex justify-between px-4 gap-x-10'>
                <span className='flex gap-x-2'>
                  <OfficeBuilding
                    className={
                      menuOpen === 'launch_site' ? '!stroke-white' : ''
                    }
                  />
                  {!!launchSiteFilter ? launchSiteFilter : 'Launch Site'}
                </span>
                <ChevronDown
                  className={cn(
                    'transition-transform',
                    menuOpen === 'launch_site' ? 'rotate-180 !fill-white' : ''
                  )}
                />
              </div>
            </MenuButton>
          </div>
        </DashboardHeader>

        <section className='relative'>
          <div
            className={cn(
              'flex flex-col lg:flex-row gap-4',
              'transition-opacity duration-700',
              tableCardExpanded && 'opacity-0'
            )}>
            {/* Pie Chart */}
            <TitleCard
              className='w-full lg:w-1/2'
              title={
                <Fragment>
                  <span>Payload Count By Nationality</span>
                  <span className='ml-2 cursor-pointer' title='Help'>
                    <QuestionMark />
                  </span>
                </Fragment>
              }>
              {isApiLoading ? (
                <Loading />
              ) : (
                <PieChartWithTable data={memoized.payloadsByNationality} />
              )}
            </TitleCard>
            {/* Stat Cards */}
            <div className='flex flex-col justify-between gap-y-1 w-full lg:w-1/2'>
              {[
                {
                  label: 'Total Payloads',
                  value: memoized.payloadMasses.length,
                  Icon: () => <Archive />,
                  linkTo: '/',
                },
                {
                  label: 'Avg. Payload Mass',
                  value: `${
                    !!memoized.payloadMasses.length
                      ? getAverage(memoized.payloadMasses).toFixed(0)
                      : 0
                  } kg`,
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
                return (
                  <StatisticCard
                    {...data}
                    key={`statCard-${i}`}
                    isApiLoading={isApiLoading}
                  />
                )
              })}
            </div>
          </div>
          {/* Table */}
          <div
            className={cn(
              'w-full mt-4 left-0 absolute transition-top duration-700 ease-out',
              tableCardExpanded ? '-top-4 smMaxH:h-800px h-800px md:min-h-screen' : 'top-full h-550px'
            )}>
            <TitleCard
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
                  tableCardExpanded
                    ? 'smMaxH:h-500px h-500px md:h-table_height'
                    : 'h-52'
                }
                searchKey='mission_name'
                searchInputPlaceholder='Search by Mission Name'
                hiddenFilters={['site']}
                launchSiteFilter={launchSiteFilter}
                setPaginatedLaunches={setPaginatedLaunches}
                setPaginatedMissions={setPaginatedMissions}
                setIsApiLoading={setIsApiLoading}
              />
            </TitleCard>
          </div>
        </section>
      </main>
    </PageContainer>
  )
}

export default App
