interface DashboardHeaderProps {
  header: string
  children?: JSX.Element
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  header,
  children,
}: DashboardHeaderProps) => {
  return (
    <header className='flex justify-between py-11 flex-col md:flex-row gap-y-4'>
      <h1 className='font-bold text-2xl dark:text-white transition-colors'>
        {header}
      </h1>
      {children}
    </header>
  )
}

export default DashboardHeader
