import { FC } from 'react'

interface StatCardProps {
  label: string
  value: number | string
  Icon: () => JSX.Element
  linkTo: string
}

const StatisticCard: FC<StatCardProps> = ({ label, value, Icon, linkTo }) => {
  return (
    <div className='border-none rounded-lg p-20px bg-grey-secondary dark:bg-black-5 flex items-center gap-x-4 transition-colors'>
      <Icon />
      <div className='flex flex-col gap-y-1'>
        <h2 className='text-xl font-bold text-green-dark dark:text-white'>
          {value}
        </h2>

        <p className='text-sm font-light font-sm text-green-dark_opaque dark:text-grey-6'>
          {label}
        </p>
      </div>
    </div>
  )
}
export default StatisticCard
