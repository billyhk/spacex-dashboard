import * as React from 'react'
import cn from 'classnames'

export const Archive = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={props.width || '25'}
    viewBox='0 0 25 25'
    fill='none'
    {...props}
    className={cn(props.className, 'dark:stroke-teal-4 stroke-teal-3')}>
    <path
      d='M5.23218 8.07877H19.2322M5.23218 8.07877C4.12761 8.07877 3.23218 7.18334 3.23218 6.07877C3.23218 4.9742 4.12761 4.07877 5.23218 4.07877H19.2322C20.3367 4.07877 21.2322 4.9742 21.2322 6.07877C21.2322 7.18334 20.3367 8.07877 19.2322 8.07877M5.23218 8.07877L5.23218 18.0788C5.23218 19.1833 6.12761 20.0788 7.23218 20.0788H17.2322C18.3367 20.0788 19.2322 19.1833 19.2322 18.0788V8.07877M10.2322 12.0788H14.2322'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)
