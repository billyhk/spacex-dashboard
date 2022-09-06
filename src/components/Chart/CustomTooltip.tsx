import { TooltipProps } from 'recharts'
import {
  ValueType,
  NameType,
} from 'recharts/src/component/DefaultTooltipContent'

export const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
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
        <span className='text-white font-bold'>{payload[0].payload.count}</span>

        <div className='absolute w-full left-0 -bottom-1 flex justify-center'>
          <div className='rotate-45 bg-blue-dark w-2 h-2'></div>
        </div>
      </div>
    )
  }
  return null
}
