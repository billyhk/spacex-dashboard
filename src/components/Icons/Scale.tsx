import * as React from 'react'
import cn from 'classnames'

export const Scale = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={props.width || '25'}
    viewBox='0 0 25 25'
    fill='none'
    {...props}
    className={cn('dark:stroke-purple-3 stroke-purple-4', props.className)}>
    <path
      d='M3.87605 6.75L6.87605 7.75M6.87605 7.75L3.87605 16.75C5.64858 18.0834 8.10472 18.0834 9.87724 16.75M6.87605 7.75L9.87611 16.75M6.87605 7.75L12.8761 5.75M18.8761 7.75L21.8761 6.75M18.8761 7.75L15.8761 16.75C17.6486 18.0834 20.1047 18.0834 21.8772 16.75M18.8761 7.75L21.8761 16.75M18.8761 7.75L12.8761 5.75M12.8761 3.75V5.75M12.8761 21.75V5.75M12.8761 21.75H9.87605M12.8761 21.75H15.8761'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)
