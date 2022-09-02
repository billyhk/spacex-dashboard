import * as React from 'react'
import cn from 'classnames'

export const UserCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={props.width || '25'}
    viewBox='0 0 25 25'
    fill='none'
    {...props}
    className={cn(
      props.className,
      'dark:stroke-yellow stroke-yellow-secondary'
    )}>
    <path
      d='M5.90473 18.4167C7.93636 17.2684 10.2835 16.613 12.7837 16.613C15.2839 16.613 17.631 17.2684 19.6627 18.4167M15.7837 10.613C15.7837 12.2699 14.4405 13.613 12.7837 13.613C11.1268 13.613 9.78369 12.2699 9.78369 10.613C9.78369 8.95615 11.1268 7.61301 12.7837 7.61301C14.4405 7.61301 15.7837 8.95615 15.7837 10.613ZM21.7837 12.613C21.7837 17.5836 17.7543 21.613 12.7837 21.613C7.81313 21.613 3.78369 17.5836 3.78369 12.613C3.78369 7.64244 7.81313 3.61301 12.7837 3.61301C17.7543 3.61301 21.7837 7.64244 21.7837 12.613Z'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)
