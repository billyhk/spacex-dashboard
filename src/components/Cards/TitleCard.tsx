import { FC } from 'react'

interface TitleCardProps {
  title: JSX.Element | string
  children: JSX.Element
  className?: string
}

const TitleCard: FC<TitleCardProps> = ({ title, children, className }) => {
  return (
    <div className={className}>
      <div className='border rounded-lg shadow-title_card dark:shadow-title_card_darkMode overflow-hidden w-full dark:bg-black-3 border-0'>
        <h2 className='p-4 w-full border-b-4 border-grey-secondary dark:border-black-4 text-lg text-green-dark dark:text-white font-bold flex items-center transition-colors duration-25'>
          {title}
        </h2>
        <div className='p-4 flex-1'>{children}</div>
      </div>
    </div>
  )
}
export default TitleCard