import { FC, useMemo, useState, useId } from 'react'
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
  MappedPayload,
} from './utils'
import { StatCardProps } from './components/Cards/StatisticCard'
import {
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from 'recharts'

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
  const avgPayloadMass: number = useMemo(
    () => getAvgPayloadMass(filteredMissions),
    [filteredMissions]
  )
  const totalCountMissionPayloads: number = useMemo(
    () => countPayloads(filteredMissions),
    [filteredMissions]
  )

  const payloadsByNationality: MappedPayload[] = useMemo(
    () =>
      getPayloadsByNationality(filteredMissions)
        .sort((a, b) => {
          if (a.count > b.count) {
            return -1
          }
          if (a.count < b.count) {
            return 1
          }
          return 0
        })
        .slice(0, 5),
    [filteredMissions]
  )

  // -- NOT USED YET --
  // const [filteredLaunches, setFilteredLaunches] = useState<Launch[]>(
  //   launches.data.launches
  // )
  // const [filteredDetailedLaunches, setFilteredDetailedLaunches] = useState<
  //   Launch[]
  // >(detailedLaunches.data.launches)

  const COLORS = ['#f97316', '#b91c1c', '#14b8a6', '#3b82f6', '#6d28d9']
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-blue-dark h-40px px-4 flex items-center justify-between gap-x-2 text-xs rounded-md shadow-md relative border-none'>
          <div className='flex flex-row gap-x-1 items-center'>
            <span
              style={{
                background: payload[0].payload.fill,
              }}
              className='w-10px h-10px rounded-full'></span>
            <span className='text-grey-3 font-bold'>
              {payload[0].payload.country}
            </span>
          </div>
          <span className='text-white font-bold'>
            {payload[0].payload.count}
          </span>

          <div className='absolute w-full left-0 -bottom-1 flex justify-center'>
            <div className='rotate-45 bg-blue-dark w-2 h-2'></div>
          </div>
        </div>
      )
    }
    return null
  }

  const [activeIndex, setActiveIndex] = useState<number>(-1)
  return (
    <PageContainer darkMode={darkMode}>
      <main className='px-10 min-h-screen max-h-screen dark:bg-black-4 bg-white-lightMode_gradient w-full h-full overflow-y-auto transition-colors'>
        <DashboardHeader
          header='SpaceX Mission Dashboard'
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
        />

        <div className='flex flex-col lg:flex-row gap-2'>
          {/* Pie Chart {Title Card) */}
          <div className='flex w-full lg:w-1/2'>
            <div className='border rounded-lg shadow-lg overflow-hidden w-full'>
              <h2 className='p-4 w-full border-b text-lg text-green-dark font-bold flex items-center'>
                Payload Count By Nationality{' '}
                <span className='ml-2 cursor-pointer' title='Help'>
                  <QuestionMark />
                </span>
              </h2>
              <div className='p-4 flex-1 flex flex-col md:flex-row gap-y-8 items-center'>
                <div className='h-full w-52 grid place-items-center'>
                  <PieChart width={225} height={175}>
                    <Pie
                      data={payloadsByNationality}
                      cx={100}
                      cy={80}
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey='count'>
                      {payloadsByNationality.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke={COLORS[index % COLORS.length]}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          onMouseEnter={() => setActiveIndex(index)}
                          onMouseLeave={() => setActiveIndex(-1)}
                          style={{
                            ...(index === activeIndex && {
                              filter: `drop-shadow(0 0 4px ${
                                COLORS[index % COLORS.length]
                              }`,
                            }),
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </div>
                <div className='flex-1 flex flex-col w-full'>
                  <div className='grid grid-cols-2 gap-x-4 text-xs text-grey-3 font-bold mb-4'>
                    <span>NATIONALITY</span>
                    <span>PAYLOAD COUNT</span>
                  </div>
                  {payloadsByNationality.map(({ country, count }, i) => {
                    return (
                      <div
                        className='grid grid-cols-2 gap-x-4 text-sm font-medium border-b-2 py-2 y-2 hover:border-grey-4 hover:shadow-bottom transition'
                        onMouseEnter={() => setActiveIndex(i)}
                        onMouseLeave={() => setActiveIndex(-1)}>
                        <div className='flex flex-row gap-x-2 items-center'>
                          <span
                            style={{
                              background: COLORS[i % COLORS.length],
                            }}
                            className='w-6px h-6px rounded-full'></span>
                          <span className='text-green-dark'>{country}</span>
                        </div>
                        <span className='text-grey-3'>{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className='flex flex-col justify-between gap-y-1 w-full lg:w-1/2'>
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
            ].map((data: StatCardProps, i) => {
              return <StatisticCard {...data} key={`${statCardId}-${i}`} />
            })}
          </div>
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
