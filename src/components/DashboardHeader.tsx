export interface DashboardHeaderProps {
  header: string
  toggleDarkMode: () => void
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  header,
  toggleDarkMode,
}: DashboardHeaderProps) => {
  return (
    <header className='flex justify-between py-11'>
      <h1 className='font-bold text-2xl dark:text-white'>{header}</h1>
      <div onClick={toggleDarkMode} className='cursor-pointer'>
        <span className='dark:hidden'>USE DARK MODE</span>
        <span className='hidden text-white dark:block'>USE LIGHT MODE</span>
      </div>
    </header>
  )
}

export default DashboardHeader
