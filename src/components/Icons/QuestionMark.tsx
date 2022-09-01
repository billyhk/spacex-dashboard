import * as React from 'react'
import cn from 'classnames'

export const QuestionMark = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={props.width || '17'}
    viewBox='0 0 17 16'
    fill='none'
    {...props}
    className={cn('dark:stroke-white stroke-blue-dark', props.className)}>
    <path
      d='M6.40259 6.125C6.76866 5.3482 7.75643 4.79167 8.91752 4.79167C10.3903 4.79167 11.5842 5.6871 11.5842 6.79167C11.5842 7.72463 10.7324 8.50838 9.58033 8.7294C9.21873 8.79877 8.91752 9.09014 8.91752 9.45833M8.91748 11.4583H8.92415M14.9175 8.125C14.9175 11.4387 12.2312 14.125 8.91748 14.125C5.60377 14.125 2.91748 11.4387 2.91748 8.125C2.91748 4.81129 5.60377 2.125 8.91748 2.125C12.2312 2.125 14.9175 4.81129 14.9175 8.125Z'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)
