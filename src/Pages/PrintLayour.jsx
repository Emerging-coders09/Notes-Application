import React, { useEffect, useState } from 'react'
import '../Css/Printpaper.css'
import { useParams } from 'react-router-dom'

const PrintLayour = () => {
    const [data , setData] = useState([])
    const {id} = useParams()
    console.log(id)
    useEffect(()=>{
        window.api.getPrintData().then(setData)

        // setTimeout(()=>{
        //     window.print()
        // },500)
    },[]) 
  return (
    <>
    {
        id === 'A4' && (

    <div className='print-container'>
        <div className="print-top">
            <h2>{data.user?.name.charAt(0).toUpperCase() + data.user?.name.slice(1).toLowerCase()}'s Notes</h2>
            <p>{new Date().toLocaleString()}</p>
        </div>
        <div className="print-data">
            {data.notes?.map((note , index)=> (
                <div className="" key={note.id}>

                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                </div>
            ))
            }
        </div>
    </div>
        )
     }
     { id === '3-inch' && (
        <div className="inch3-print-container">
            <div className="print3-top">

            <h2>{data.user?.name.charAt(0).toUpperCase() + data.user?.name.slice(1).toLowerCase()}'s Notes</h2>
            <p>{new Date().toLocaleString()}</p>
            </div>
              <div className="inch3-print-data">
            {data.notes?.map((note , index)=> (
                <div className="" key={note.id}>

                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                </div>
            ))
            }
            </div>
        </div>
        
     )} 
     { id === '2-inch' && (
        <div className="2inch-print-container">
            <div className="print-top">

            <h2>{data.user?.name.charAt(0).toUpperCase() + data.user?.name.slice(1).toLowerCase()}'s Notes</h2>
            <p>{new Date().toLocaleString()}</p>
            </div>
              <div className="2inch-print-data">
            {data.notes?.map((note , index)=> (
                <div className="" key={note.id}>

                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                </div>
            ))
            }
            </div>
        </div>
     )}
    
    </>
  )
}

export default PrintLayour