import { useState } from 'react'
import { Cog } from '../Icons'
import cn from 'classnames'

interface ButtonProps {
  children: JSX.Element
  className: string
}

const Button: React.FC<ButtonProps> = ({ className, children }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const toggleMenuOpen = () => setMenuOpen(!menuOpen)

  return (
    <div className='relative'>
      <button
        onClick={toggleMenuOpen}
        className={cn(
          className,
          'border rounded-md shadow duration-100 border-none',
          menuOpen
            ? 'bg-blue-secondary'
            : 'bg-white hover:bg-grey-secondary dark:bg-black-3 dark:hover:bg-grey-7'
        )}>
        {children}
      </button>
      <div className='absolute -bottom-2'></div>
    </div>
  )
}

interface DashboardHeaderProps {
  header: string
  toggleDarkMode: () => void
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  header,
  toggleDarkMode,
}: DashboardHeaderProps) => {
  const [settingsMenuOpen, setSettingsMenuOpen] = useState<boolean>(false)
  const toggleSettingsMenuOpen = () => setSettingsMenuOpen(!settingsMenuOpen)

  const [launchSiteMenuOpen, setLaunchSiteMenuOpen] = useState<boolean>(false)
  const toggleLaunchSiteMenuOpen = () =>
    setLaunchSiteMenuOpen(!launchSiteMenuOpen)

  return (
    <header className='flex justify-between py-11'>
      <h1 className='font-bold text-2xl dark:text-white'>{header}</h1>

      <div className='relative'>
        <button
          onClick={toggleSettingsMenuOpen}
          className={cn(
            'border rounded-md shadow duration-100 border-none',
            settingsMenuOpen
              ? 'bg-blue-secondary'
              : 'bg-white hover:bg-grey-secondary dark:bg-black-3 dark:hover:bg-grey-7',
            'w-40px h-40px grid place-items-center'
          )}>
          <Cog className={cn(settingsMenuOpen && 'stroke-white')} />
        </button>
        {settingsMenuOpen && <div className='absolute -bottom-2'>test</div>}
      </div>

      {/* <div onClick={toggleDarkMode} className='cursor-pointer'>
        <span className='dark:hidden'>USE DARK MODE</span>
        <span className='hidden text-white dark:block'>USE LIGHT MODE</span>
      </div> */}
    </header>
  )
}

export default DashboardHeader
