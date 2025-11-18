'use client'
 
import { useLinkStatus } from 'next/link'
 
export default function LoadingIndicator() {
  const { pending } = useLinkStatus()
  return pending ? (
    <span aria-label="Loading" className="ml-2 animate-spin">⏳</span>
  ) : null
}

// "use client" debounce
// import { useEffect, useState } from "react"
// import { useLinkStatus } from "next/link"

// export default function LoadingIndicator() {
//   const { pending } = useLinkStatus()
//   const [show, setShow] = useState(false)

//   useEffect(() => {
//     let timer: NodeJS.Timeout
//     if (pending) {
//       timer = setTimeout(() => setShow(true), 200) // show after 200ms
//     } else {
//       setShow(false)
//     }
//     return () => clearTimeout(timer)
//   }, [pending])

//   return show ? <span className="ml-2 animate-spin">⏳</span> : null
//}
