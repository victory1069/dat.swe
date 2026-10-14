import { createContext, useContext } from 'react'

// True once the preloader has finished. Anything that animates "on load"
// waits for this, so it plays where people can see it rather than behind
// the preloader.
export const IntroContext = createContext(true)
export const useIntroDone = () => useContext(IntroContext)
