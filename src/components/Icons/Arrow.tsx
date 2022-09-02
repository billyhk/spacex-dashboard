import * as React from 'react'
import cn from 'classnames'

export const Arrow = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={props.width || '20'}
    viewBox='0 0 400 400'
    fill='none'
    {...props}
    className={cn(props.className, 'dark:fill-white fill-grey-5 transform')}>
    <g
      transform='translate(0.000000,400.000000) scale(0.100000,-0.100000)'
      stroke='none'>
      <path d='M2329 2735 c-14 -8 -32 -28 -39 -45 -27 -64 -16 -79 248 -342 l247 -248 -922 0 -921 0 -31 -26 c-26 -22 -31 -33 -31 -71 0 -36 6 -50 29 -74 l29 -29 916 0 c504 0 916 -3 916 -7 0 -4 -110 -118 -245 -253 -216 -217 -245 -250 -245 -277 0 -88 75 -137 149 -99 15 8 176 167 359 354 328 336 332 341 332 382 0 41 -4 45 -337 385 -185 189 -347 348 -360 354 -32 15 -62 13 -94 -4z' />
    </g>
  </svg>
)
