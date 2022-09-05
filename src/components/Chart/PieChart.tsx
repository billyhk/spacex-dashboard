import { Cell, Pie, PieChart as RechartsPie, Tooltip } from 'recharts'
import { TooltipProps } from 'recharts'
import {
  ValueType,
  NameType,
} from 'recharts/src/component/DefaultTooltipContent'
interface PieChartProps<T> {
  data: T[]
  dataKey: string
  colors: string[]
  className?: string
  activeIndex?: number
  showTooltip?: boolean
  setActiveIndex?: (index: number) => void
  CustomTooltip: ({
    active,
    payload,
  }: TooltipProps<ValueType, NameType>) => JSX.Element | null
}

const PieChart = <T extends unknown>({
  data,
  colors,
  dataKey,
  className,
  activeIndex,
  showTooltip = true,
  setActiveIndex,
  CustomTooltip,
}: PieChartProps<T>) => {

  return (
    <RechartsPie width={170} height={170} className={className}>
      <Pie
        data={data}
        cx={80}
        cy={80}
        innerRadius={60}
        outerRadius={70}
        paddingAngle={3}
        cornerRadius={100}
        dataKey={dataKey}>
        {data.map((entry, index: number) => (
          <Cell
            key={`cell-${index}`}
            fill={colors[index % colors.length]}
            stroke={colors[index % colors.length]}
            {...(setActiveIndex && {
              onMouseEnter: () => setActiveIndex(index),
              onMouseLeave: () => setActiveIndex(-1),
              style: {
                ...(index === activeIndex && {
                  filter: `drop-shadow(0 0 3px ${
                    colors[index % colors.length]
                  }`,
                }),
              },
            })}
          />
        ))}
      </Pie>
      {showTooltip && (
        <Tooltip
          {...(!!CustomTooltip && { content: <CustomTooltip /> })}
          wrapperStyle={{ outline: 0 }}
          animationDuration={700}
        />
      )}
    </RechartsPie>
  )
}
export default PieChart
