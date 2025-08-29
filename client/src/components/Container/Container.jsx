import React from 'react'

const Container = ({children}) => {
  return (
    <div className='lg:ml-[min(25vw,300px)] 2xl:ml-[min(25vw,340px)] px-2 sm:px-4 pt-2 pb-15 lg:pb-2'>{children}</div>
  )
}

export default Container