import { FC } from 'react'
import { Cell, Pie, PieChart as RechartsPie, Tooltip } from 'recharts'
import { MappedPayload } from '../../utils'
import { CustomTooltip } from './CustomTooltip'

interface PieChartProps<T> {
  data: T[]
  dataKey: string
  colors: string[]
  className?: string
  activeIndex?: number
  setActiveIndex?: (index: number) => void
}

const PieChart: FC<PieChartProps<MappedPayload>> = ({
  data,
  colors,
  dataKey,
  className,
  activeIndex,
  setActiveIndex,
}) => {
  return (
    <RechartsPie width={170} height={170} className={className}>
      <Pie
        data={data}
        cx={80}
        cy={80}
        innerRadius={70}
        outerRadius={80}
        paddingAngle={4}
        cornerRadius={100}
        dataKey={dataKey}
        >
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
      <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: 0 }} />
    </RechartsPie>
  )
}
export default PieChart
