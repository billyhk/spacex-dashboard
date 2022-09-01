import * as React from 'react'
import cn from 'classnames'

export const ChevronRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={props.width || '20'}
    viewBox='0 0 20 20'
    fill='none'
    {...props}
    className={cn('dark:fill-white fill-black-secondary', props.className)}>
    <path
      d='M7.74685 15.5359C7.35554 15.1453 7.35554 14.5122 7.74685 14.1216L11.0464 10.8288L7.74685 7.53586C7.35554 7.14533 7.35554 6.51217 7.74685 6.12164C8.13817 5.73112 8.77261 5.73112 9.16393 6.12164L13.172 10.1216C13.5633 10.5122 13.5633 11.1453 13.172 11.5359L9.16393 15.5359C8.77261 15.9264 8.13817 15.9264 7.74685 15.5359Z'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)
