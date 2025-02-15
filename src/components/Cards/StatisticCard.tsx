import { FC } from 'react'
import { ChevronRight } from '../Icons'
import { Loading } from '../Text'

export interface StatCardProps {
  label: string
  value: number | string
  Icon: () => JSX.Element
  linkTo: string
  isApiLoading?: boolean
}

const StatisticCard: FC<StatCardProps> = ({
  label,
  value,
  Icon,
  linkTo,
  isApiLoading,
}) => {
  return (
    <div className='border-none rounded-lg p-20px bg-grey-secondary dark:bg-black-5 transition-colors flex items-center justify-between'>
      <div className='flex items-center gap-x-4'>
        <Icon />
        <div className='flex flex-col gap-y-1'>
          {!isApiLoading ? (
            <h2 className='text-xl font-bold text-green-dark dark:text-white'>
              {value}
            </h2>
          ) : (
            <Loading />
          )}
          <p className='text-sm font-light font-sm text-green-dark_opaque dark:text-grey-6'>
            {label}
          </p>
        </div>
      </div>
      <ChevronRight
        className='cursor-pointer'
        onClick={() => {
          // navigate(linkTo)
        }}
      />
    </div>
  )
}
export default StatisticCard
