import { Fragment } from "react"
import cn from 'classnames'

interface ButtonProps {
  children?: JSX.Element
  className?: string
  menuItems?: JSX.Element[]
  active: boolean
  handleClick: () => void
}

const MenuButton: React.FC<ButtonProps> = ({
  className,
  children,
  active,
  handleClick,
  menuItems,
}) => {
  return (
    <div className='relative'>
      <button
        title={`Click to ${active ? 'close' : 'open'}`}
        onClick={handleClick}
        className={cn(
          className,
          'border rounded-md duration-100 border-none',
          'h-40px',
          active
            ? 'bg-blue-secondary text-white'
            : 'bg-white hover:bg-grey-secondary dark:bg-black-3 dark:hover:bg-grey-7 dark:text-white shadow'
        )}>
        {children}
      </button>
      {active && (
        <div
          className={cn(
            'z-50 absolute top-12 whitespace-nowrap text-sm md:right-0 text-grey-5 dark:text-grey-6 rounded-md shadow-lg bg-white dark:bg-green-dark_secondary overflow-hidden',
            'animate-fadein_drop'
          )}>
          {menuItems?.map((el, i) => (
            <Fragment>
              <div className='p-4 hover:bg-grey dark:hover:bg-grey-7'>{el}</div>
              {i !== menuItems.length - 1 && (
                <div className='w-full h-1px bg-grey-secondary dark:bg-black-4'></div>
              )}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
export default MenuButton