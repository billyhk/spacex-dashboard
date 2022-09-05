import { FC, useState } from 'react'
import { MappedPayload } from '../../utils'
import { PieChart } from '../Chart'
import { CustomTooltip } from '../Chart/CustomTooltip'

const COLORS = ['#f97316', '#b91c1c', '#14b8a6', '#3b82f6', '#6d28d9']

interface PieChartWithTableProps {
  data: MappedPayload[]
}
const PieChartWithTable: FC<PieChartWithTableProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  
  return (
    <div className='flex flex-col md:flex-row gap-4 items-center'>
      <PieChart
        data={data}
        dataKey='count'
        colors={COLORS}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        CustomTooltip={CustomTooltip}
      />
      <div className='flex-1 flex flex-col w-full'>
        {!!data.length && <div className='grid grid-cols-2 gap-x-4 text-xs text-grey-3 dark:text-white font-bold mb-4'>
          <span>NATIONALITY</span>
          <span>PAYLOAD COUNT</span>
        </div>}

        {data.map(({ country, count }, i) => {
          return (
            <div
              key={i}
              className='grid grid-cols-2 gap-x-4 text-sm font-medium border-b-2 border-grey-secondary py-2 y-2 dark:border-black-4 hover:border-grey-4 hover:shadow-bottom dark:hover:shadow-bottom_darkMode transition-colors'
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(-1)}>
              <div className='flex flex-row gap-x-2 items-center'>
                <span
                  style={{
                    background: COLORS[i % COLORS.length],
                  }}
                  className='w-6px h-6px rounded-full'></span>
                <span className='text-green-dark dark:text-grey-6'>
                  {country}
                </span>
              </div>
              <span className='text-grey-3 dark:text-grey-6'>{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default PieChartWithTable
