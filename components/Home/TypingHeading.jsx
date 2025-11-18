// "use client"
// import { motion } from "framer-motion"

// const sentence = {
//   hidden: { opacity: 1 },
//   visible: {
//     opacity: 1,
//     transition: {
//       delay: 0.2,
//       staggerChildren: 0.05, // typing speed
//     },
//   },
// }

// const letter = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0 },
// }

// export default function TypingHeading() {
//   const text = "Find the Right Consultant in Minutes"

//   return (
//     <motion.h2
//       className="mt-5 text-3xl font-crimson"
//       variants={sentence}
//       initial="hidden"
//       animate="visible"
//     >
//       {text.split("").map((char, index) => (
//         <motion.span key={index} variants={letter}>
//           {char}
//         </motion.span>
//       ))}
//     </motion.h2>
//   )
// }

"use client"
import { ReactTyped } from "react-typed";

const TypingHeading = () => {
  return (
    <p className="mt-5 text-3xl font-crimson">
      <ReactTyped
        strings={[
          "Find the Right Consultant in Minutes",
          "Book Experts in Just a Few Clicks",
          "Your Trusted Advisors Anytime"
        ]}
        typeSpeed={50}
        backSpeed={30}
        loop
      />
    </p>
  )
}

export default TypingHeading;
