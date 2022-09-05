import {
  Dispatch,
  FC,
  Fragment,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnSort,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { useInfiniteQuery } from '@tanstack/react-query'
import {
  DetailedLaunchApiResponse,
  DetailedLaunchRow,
  Mission,
  MissionApiResponse,
} from '../../interfaces'
import cn from 'classnames'
import Filter from './Filter'

// These will act as our databases
import detailedLaunches from '../../datasets/detailedLaunches.json'
import missions from '../../datasets/missions.json'

interface TableProps {
  className?: string
  dynamicHeight?: string
  fetchSize?: number
  searchKey?: string
  hiddenFilters?: string[]
  launchSiteFilter?: string
  setPaginatedMissions: Dispatch<SetStateAction<Mission[]>>
  setPaginatedLaunches: Dispatch<SetStateAction<DetailedLaunchRow[]>>
}

const TableComponent: FC<TableProps> = ({
  className,
  dynamicHeight,
  fetchSize = 10,
  searchKey,
  hiddenFilters,
  launchSiteFilter,
  setPaginatedMissions,
  setPaginatedLaunches,
}) => {
  
  // Provide a reference to the scrolling element for logic down below
  const tableContainerRef = useRef<HTMLDivElement>(null)
  
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const columns = useMemo<ColumnDef<DetailedLaunchRow, any>[]>(
    () => [
      {
        accessorKey: 'mission_name',
        header: 'Mission Name',
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: (info) => info.getValue<Date>().toLocaleString(),
      },
      {
        accessorKey: 'outcome',
        header: 'Outcome',
      },
      {
        accessorKey: 'rocket',
        header: 'Rocket',
      },
      {
        accessorKey: 'site',
        header: 'Site',
      },
      {
        accessorKey: 'mission_id',
        header: 'Mission ID',
      },
    ],
    []
  )

  // Listen for changes to launchSiteFilter from outside this component
  useEffect(() => {
    table.setColumnFilters((activeFilters) => {
      const newFilterValue = { id: 'site', value: launchSiteFilter }
      const siteQueryCleared = [
        ...activeFilters.filter((filter) => filter.id !== 'site'),
      ]

      // Handle Value Cleared
      if (!!launchSiteFilter) {
        return [...activeFilters, newFilterValue]
      } else return siteQueryCleared
    })
  }, [launchSiteFilter])

  // ------------------------------------------------------- //
  // FETCH DATA (2 Requests: DetailedLaunch[] and Mission[]) //
  // ------------------------------------------------------- //
  const fetchLaunches = (
    start: number,
    size: number,
    sorting: SortingState
  ) => {
    const mappedLaunches: DetailedLaunchRow[] =
      detailedLaunches.data.launches.map((launch) => {
        return {
          mission_name: launch.mission_name || '',
          date: launch.launch_date_utc || '',
          outcome: !!launch.launch_success ? 'Success' : 'Failure',
          rocket: launch.rocket.rocket_name || '',
          site: launch.launch_site.site_name || '',
          mission_id: launch.mission_id[0] || 'Not Available',
        }
      })

    const dbData = [...mappedLaunches]
    if (sorting.length) {
      const sort = sorting[0] as ColumnSort
      const { id, desc } = sort as {
        id: keyof DetailedLaunchRow
        desc: boolean
      }
      dbData.sort((a, b) => {
        if (desc) {
          return a[id] < b[id] ? 1 : -1
        }
        return a[id] > b[id] ? 1 : -1
      })
    }

    return {
      data: dbData.slice(start, start + size),
      meta: {
        totalRowCount: dbData.length,
      },
    }
  }
  const fetchMissions = (
    start: number,
    size: number,
    sorting: SortingState
  ) => {
    const dbData = [...missions.data.missions]
    if (sorting.length) {
      const sort = sorting[0] as ColumnSort
      const { id, desc } = sort as {
        id: keyof Mission
        desc: boolean
      }
      dbData.sort((a, b) => {
        if (desc) {
          return a[id] < b[id] ? 1 : -1
        }
        return a[id] > b[id] ? 1 : -1
      })
    }
    return {
      data: dbData.slice(start, start + size),
      meta: {
        totalRowCount: dbData.length,
      },
    }
  }

  // Use react-query's useInfiniteQuery hook to handle pagination of response data (DetailedLaunch[])
  const getDetailedLaunches = useInfiniteQuery<DetailedLaunchApiResponse>(
    ['table-data'],
    async ({ pageParam = 0 }) => {
      const start = pageParam * fetchSize
      const fetchedData = fetchLaunches(start, fetchSize, sorting) //simulate api call with /datasets/detailedLaunches.json
      return fetchedData
    },
    {
      getNextPageParam: (_lastGroup, groups) => groups.length,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  )

  //flatten the array of arrays from the useInfiniteQuery hook
  const flatLaunchesData: DetailedLaunchRow[] = useMemo(
    () => getDetailedLaunches.data?.pages?.flatMap((page) => page.data) ?? [],
    [getDetailedLaunches.data]
  )
  const totalDBRowCount =
    getDetailedLaunches.data?.pages?.[0]?.meta?.totalRowCount ?? 0
  const totalFetched = flatLaunchesData.length

  // Use react-query's useInfiniteQuery hook to handle pagination of response data (Mission[])
  const getMissions = useInfiniteQuery<MissionApiResponse>(
    ['missions-data'], //adding sorting state as key causes table to reset and fetch from new beginning upon sort
    async ({ pageParam = 0 }) => {
      const start = pageParam * fetchSize
      const fetchedMissions = fetchMissions(start, fetchSize, sorting) //pretend api call
      return fetchedMissions
    },
    {
      getNextPageParam: (_lastGroup, groups) => groups.length,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  )
  // Flatten the array of arrays from the useInfiniteQuery hook
  const flatMissionsData: Mission[] = useMemo(
    () => getMissions.data?.pages?.flatMap((page) => page.data) ?? [],
    [getMissions]
  )
  // Called on scroll and on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement
        //once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !getDetailedLaunches.isFetching &&
          totalFetched < totalDBRowCount
        ) {
          getDetailedLaunches.fetchNextPage() // launch data used for table
          getMissions.fetchNextPage() // missions data used for other dashboard components
        }
      }
    },
    [getDetailedLaunches.fetchNextPage, totalFetched, totalDBRowCount]
  )

  // Check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current)
  }, [fetchMoreOnBottomReached])

  // Bubble up request data for use in other dashboard components outside the table component
  useEffect(() => {
    setPaginatedLaunches(flatLaunchesData)
    setPaginatedMissions(flatMissionsData)
  }, [flatLaunchesData])

  // Use tanstack/react-table
  const table = useReactTable({
    data: flatLaunchesData,
    columns,
    state: {
      columnFilters,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    autoResetAll: false,
  })
  const { rows } = table.getRowModel()

  if (getDetailedLaunches.isLoading) {
    return <>Loading...</>
  }
  return (
    <Fragment>
      {hiddenFilters &&
        hiddenFilters.map((id: string) => (
          <Filter
            key={id}
            column={table.getColumn(id)}
            table={table}
            className='hidden'
          />
        ))}
      showing {rows.length} of {flatLaunchesData.length}
      {searchKey && (
        <Filter column={table.getColumn(searchKey)} table={table} />
      )}
      <div
        className={cn(
          'overflow-x-auto overflow-y-hidden transition-height duration-700',
          'text-left text-sm',
          className
        )}>
        <table className='w-full'>
          <thead className='block'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className='flex flex-row justify-evenly w-table_header_row_above_overflowing-tbody'>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className='w-full'>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody
            className={cn(
              'block overflow-y-scroll transition-height duration-700',
              dynamicHeight
            )}
            onScroll={(e) =>
              fetchMoreOnBottomReached(e.target as HTMLTableSectionElement)
            }
            ref={tableContainerRef as RefObject<HTMLTableSectionElement>}>
            {rows.map((row) => {
              return (
                <tr key={row.id} className='flex flex-row justify-between'>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td className='w-full' key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {/* 
          <div>
            Fetched {flatLaunchesData.length} of {totalDBRowCount} Rows.
          </div> 
      */}
    </Fragment>
  )
}

export default TableComponent
