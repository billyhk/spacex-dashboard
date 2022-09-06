import { useEffect } from 'react'

export const useCallbackOnKeypress = (
  eventKey: string = 'Escape',
  callback: () => any
) => {
  useEffect(() => {
    // Close menu on Keypress
    const keypressFunction = (e_key: string) => {
      if (e_key === eventKey) {
        callback()
      }
    }

    document.addEventListener('keydown', (e) => keypressFunction(e.key), false)

    return () => {
      document.removeEventListener(
        'keydown',
        (e) => keypressFunction(e.key),
        false
      )
    }
  }, [eventKey, callback])
}
