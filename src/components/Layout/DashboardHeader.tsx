import { Dispatch, SetStateAction, useState } from 'react'
import { ChevronDown, Cog, OfficeBuilding } from '../Icons'
import { MenuButton } from '../Button'
import { Switch } from '../Inputs'
import cn from 'classnames'

interface DashboardHeaderProps {
  header: string
  toggleDarkMode: () => void
  darkMode: boolean
  launchSiteOptions: string[]
  launchSiteFilter: string
  setLaunchSiteFilter: Dispatch<SetStateAction<string>>
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  header,
  toggleDarkMode,
  darkMode,
  launchSiteOptions,
  launchSiteFilter,
  setLaunchSiteFilter,
}: DashboardHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState<'settings' | 'launch_site' | ''>('')

  const menuOptions = {
    settings: [
      <div className='flex flex-row justify-between gap-x-4'>
        <p>Light / Dark Theme</p>
        <Switch handleClick={toggleDarkMode} text='' active={darkMode} />
      </div>,
      <span className='cursor-pointer' onClick={() => {}}>
        Logout
      </span>,
    ],
    launchSite: launchSiteOptions.map((opt) => (
      <div
        onClick={() => {
          setLaunchSiteFilter(opt as string)
        }}>
        {opt}
      </div>
    )),
  }

  return (
    <header className='flex justify-between py-11 flex-col md:flex-row gap-y-4'>
      <h1 className='font-bold text-2xl dark:text-white transition-colors'>
        {header}
      </h1>

      <div className='flex flex-row gap-x-4'>
        <MenuButton
          active={menuOpen === 'settings'}
          handleClick={() => {
            const active = menuOpen === 'settings'
            setMenuOpen(active ? '' : 'settings')
          }}
          className='w-40px grid place-items-center'
          menuItems={menuOptions.settings}>
          <Cog className={menuOpen === 'settings' ? 'stroke-white' : ''} />
        </MenuButton>

        <MenuButton
          active={menuOpen === 'launch_site'}
          handleClick={() => {
            const active = menuOpen === 'launch_site'
            setMenuOpen(active ? '' : 'launch_site')
          }}
          menuItems={[
            <span
              className='cursor-pointer'
              onClick={() => {
                setLaunchSiteFilter('')
                setMenuOpen('')
              }}>
              Clear Filter
            </span>,
            ...launchSiteOptions.map((opt) => (
              <div
                className='cursor-pointer'
                onClick={() => {
                  setLaunchSiteFilter(opt as string)
                  setMenuOpen('')
                }}>
                {opt}
              </div>
            )),
          ]}>
          <div className='flex justify-between px-4 gap-x-10'>
            <span className='flex gap-x-2'>
              <OfficeBuilding
                className={menuOpen === 'launch_site' ? 'stroke-white' : ''}
              />
              {!!launchSiteFilter ? launchSiteFilter : 'Launch Site'}
            </span>
            <ChevronDown
              className={cn(
                'transition-transform',
                menuOpen === 'launch_site' ? 'rotate-180 fill-white' : ''
              )}
            />
          </div>
        </MenuButton>
      </div>
    </header>
  )
}

export default DashboardHeader
