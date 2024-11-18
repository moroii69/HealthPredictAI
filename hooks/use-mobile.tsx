import * as React from "react"

const MOBILE_BREAKPOINT = 768  // define mobile screen width threshold

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)  // state to track if mobile view

  React.useEffect(() => {
    // create media query listener for mobile screen size
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      // update state based on window width
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    mql.addEventListener("change", onChange)  // add event listener for screen size changes
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)  // set initial state
    return () => mql.removeEventListener("change", onChange)  // cleanup on component unmount
  }, [])

  return !!isMobile  // return boolean indicating if mobile view
}
