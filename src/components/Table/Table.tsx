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
  Row,
  SortingState,
  useReactTable,
  ColumnSort,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  ColumnFilter,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useVirtual } from 'react-virtual'
import {
  DetailedLaunch,
  DetailedLaunchApiResponse,
  DetailedLaunchRow,
  Mission,
  MissionApiResponse,
} from '../../interfaces'
import cn from 'classnames'
import Filter from './Filter'

// This will act as our database
import detailedLaunches from '../../datasets/detailedLaunches.json'
import missions from '../../datasets/missions.json'

interface TableProps {
  className?: string
  dynamicHeight?: string
  fetchSize?: number
  searchKey?: string
  setColumnFilters?: Dispatch<SetStateAction<ColumnFiltersState>>
  columnFilters: ColumnFilter[]
  hiddenFilters?: string[]
  launchSiteFilter?: string
  setLaunchSiteOptions?: Dispatch<SetStateAction<string[]>>
  onFetchedNewData?: (data: any) => void
  setPaginatedMissions: Dispatch<SetStateAction<Mission[]>>
  setPaginatedLaunches: Dispatch<SetStateAction<DetailedLaunchRow[]>>
}

const TableComponent: FC<TableProps> = ({
  className,
  dynamicHeight,
  fetchSize = 10,
  searchKey,
  setColumnFilters,
  columnFilters,
  hiddenFilters,
  launchSiteFilter,
  setLaunchSiteOptions,
  onFetchedNewData,
  setPaginatedMissions,
  setPaginatedLaunches,
}) => {
  //we need a reference to the scrolling element for logic down below
  const tableContainerRef = useRef<HTMLDivElement>(null)

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

  //simulates a backend api
  const fetchLaunches = (start: number, size: number, sorting: SortingState) => {
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

  //react-query has an useInfiniteQuery hook just for this situation!
  const { data, fetchNextPage, isFetching, isLoading } =
    useInfiniteQuery<DetailedLaunchApiResponse>(
      ['table-data'], //adding sorting state as key causes table to reset and fetch from new beginning upon sort
      async ({ pageParam = 0 }) => {
        const start = pageParam * fetchSize
        const fetchedData = fetchLaunches(start, fetchSize, sorting) //pretend api call
        return fetchedData
      },
      {
        getNextPageParam: (_lastGroup, groups) => groups.length,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
      }
    )

  //we must flatten the array of arrays from the useInfiniteQuery hook
  const flatData: DetailedLaunchRow[] = useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data]
  )
  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0
  const totalFetched = flatData.length

  //react-query has an useInfiniteQuery hook just for this situation!
  const getMissions = useInfiniteQuery<any>(
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

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement
        //once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage()
          getMissions.fetchNextPage()
        }
      }
    },
    [fetchNextPage, getMissions.fetchNextPage, totalFetched, totalDBRowCount]
  )

  //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current)
  }, [fetchMoreOnBottomReached])

  const table = useReactTable({
    data: flatData,
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

  //Virtualizing is optional, but might be necessary if we are going to potentially have hundreds or thousands of rows
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 60,
  })
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0

  useEffect(() => {
    setPaginatedLaunches(flatData)
    setPaginatedMissions(
      getMissions.data?.pages?.flatMap((page) => page.data) ?? []
    )
  }, [virtualRows])

  if (isLoading) {
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
            {...(id === 'site' && {
              setLaunchSiteOptions: setLaunchSiteOptions,
            })}
          />
        ))}
      showing {rows.length} of {flatData.length}
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
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<DetailedLaunchRow>
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
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }}></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* <div>
        Fetched {flatData.length} of {totalDBRowCount} Rows.
      </div> */}
    </Fragment>
  )
}

export default TableComponent
