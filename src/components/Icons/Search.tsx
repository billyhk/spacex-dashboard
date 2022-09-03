import * as React from 'react'
import cn from 'classnames'

export const Search = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={props.width || '16'}
    viewBox='0 0 16 16'
    fill='none'
    {...props}
    className={cn(props.className, 'stroke-grey-3')}>
    <path
      d='M14 14.0001L10 10.0001M11.3333 6.66676C11.3333 9.24409 9.244 11.3334 6.66667 11.3334C4.08934 11.3334 2 9.24409 2 6.66676C2 4.08943 4.08934 2.00009 6.66667 2.00009C9.244 2.00009 11.3333 4.08943 11.3333 6.66676Z'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)
