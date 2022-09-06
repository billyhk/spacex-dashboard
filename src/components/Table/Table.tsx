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
  RowData,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
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
import { format } from 'date-fns'
import { fetchLaunches, fetchMissions } from './fetchData'
import { Arrow } from '../Icons'
import Filter from './Filter'
import cn from 'classnames'
declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string
  }
}
interface TableProps {
  className?: string
  dynamicHeight?: string
  fetchSize?: number
  searchKey?: string
  hiddenFilters?: string[]
  launchSiteFilter?: string
  setPaginatedMissions: Dispatch<SetStateAction<Mission[]>>
  setPaginatedLaunches: Dispatch<SetStateAction<DetailedLaunchRow[]>>
  setIsApiLoading: Dispatch<SetStateAction<boolean>>
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
  setIsApiLoading,
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
        cell: (info) => {
          return format(new Date(info.getValue<Date>()), "yyyy-mm-dd , hh:mm a")
        },
      },
      {
        accessorKey: 'outcome',
        header: 'Outcome',
        meta: {
          className: '',
        },
        cell: (info: any) => {
          return (
            <span
              className={cn(
                'font-semibold transition-colors',
                info.getValue() === 'Success'
                  ? 'text-teal dark:text-teal-secondary'
                  : 'text-red-secondary dark:text-red-3'
              )}>
              {info.getValue()}
            </span>
          )
        },
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

  // Use react-query's useInfiniteQuery hook to handle pagination of response data (DetailedLaunch[])
  const getDetailedLaunches = useInfiniteQuery<DetailedLaunchApiResponse>(
    ['table-data'],
    async ({ pageParam = 0 }) => {
      const start = pageParam * fetchSize
      const fetchedData = fetchLaunches(start, fetchSize, sorting) // Simulate api call with /datasets/detailedLaunches.json
      return fetchedData
    },
    {
      getNextPageParam: (_lastGroup, groups) => groups.length,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  )

  // Flatten the array of arrays from the useInfiniteQuery hook
  const flatLaunchesData: DetailedLaunchRow[] = useMemo(
    () => getDetailedLaunches.data?.pages?.flatMap((page) => page.data) ?? [],
    [getDetailedLaunches.data]
  )
  const totalDBRowCount =
    getDetailedLaunches.data?.pages?.[0]?.meta?.totalRowCount ?? 0
  const totalFetched = flatLaunchesData.length

  // Use react-query's useInfiniteQuery hook to handle pagination of response data (Mission[])
  const getMissions = useInfiniteQuery<MissionApiResponse>(
    ['missions-data'],
    async ({ pageParam = 0 }) => {
      const start = pageParam * fetchSize
      const fetchedMissions = fetchMissions(start, fetchSize, sorting) // Simulate api call with /datasets/missions.json
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
        // Once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !getDetailedLaunches.isFetching &&
          totalFetched < totalDBRowCount
        ) {
          getDetailedLaunches.fetchNextPage() // launches data used for table
          getMissions.fetchNextPage() // missions data used for other dashboard components
        }
      }
    },
    [getDetailedLaunches.fetchNextPage, totalFetched, totalDBRowCount]
  )

  // Bubble up loading state
  useEffect(() => {
    setIsApiLoading(getDetailedLaunches.isLoading)
  }, [getDetailedLaunches.isLoading])

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
          'overflow-x-auto overflow-y-hidden transition-height duration-1000',
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
                          className={cn(
                            header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            'whitespace-nowrap font-semibold text-grey-5 dark:text-white transition-colors py-2 flex flex-row gap-x-2'
                          )}
                          {...{
                            onClick: header.column.getToggleSortingHandler(),
                          }}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {(header.column.getIsSorted() as string) && (
                            <Arrow
                              className={cn(
                                'transition',
                                header.column.getIsSorted() === 'asc'
                                  ? 'rotate-90'
                                  : '-rotate-90'
                              )}
                            />
                          )}
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
            {rows.map((row, i) => {
              return (
                <tr key={row.id} className='flex flex-row justify-between'>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        className={cn(
                          'w-40 md:w-full font-normal text-grey-5 dark:text-grey-6 py-2 pr-2',
                          'border-b-2 border-grey-secondary dark:border-black-4 transition-colors',                          
                          cell.column.columnDef.meta?.className
                        )}
                        key={cell.id}>
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
