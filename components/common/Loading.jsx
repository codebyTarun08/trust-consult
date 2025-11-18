import React from 'react'
import styles from "./loading.module.css"
const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className={styles.customLoader}></div>
    </div>
  )
}

export default Loading