import { useMemo, useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Table, Column } from '@tanstack/react-table'

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number

} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

interface TableFilterElement {
  column: Column<any, unknown>
  table: Table<any>
  className?: string
  setLaunchSiteOptions?: Dispatch<SetStateAction<string[]>>
}
const Filter = ({ column, table, className, setLaunchSiteOptions }: TableFilterElement) => {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

    useEffect(()=>{
    
    if(!!setLaunchSiteOptions) {
      // bubble up setLaunchSiteOptions
      setLaunchSiteOptions(sortedUniqueValues)
    }

  },[sortedUniqueValues])

  return (
    <div className={className}>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value: string) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type='text'
        value={(columnFilterValue ?? '') as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className='w-36 border shadow rounded'
        list={column.id + 'list'}
      />
    </div>
  )
}

export default Filter
