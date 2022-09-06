import { FC } from 'react'
import cn from 'classnames'

interface SwitchInputProps {
  className?: string
  handleClick?: () => void
  active: boolean
  text: string
}

const classes = {
  switchStyle: (isActive: boolean) =>
    isActive ? 'translate-x-5 bg-blue' : '-translate-x-1 bg-grey',
}

const Switch: FC<SwitchInputProps> = ({
  className,
  handleClick,
  active,
  text,
}) => {
  return (
    <div
      className={cn([className, 'flex'])}
      {...(!!handleClick && {
        onClick: handleClick,
      })}>
      <div className='bg-grey-8 relative inline-flex items-center flex-shrink-0 h-5 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200'>
        <span
          className={cn([
            classes.switchStyle(active),
            'pointer-events-none inline-block h-6 w-6 rounded-full shadow transform ring-9 transition-transform',
          ])}></span>
      </div>
      <div className='ml-2 cursor-default grid place-items-center'>
        <span>{text}</span>
      </div>
    </div>
  )
}
export default Switch
