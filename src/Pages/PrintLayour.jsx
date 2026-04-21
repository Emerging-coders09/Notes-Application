import React, { useEffect, useState } from "react";
import "../Css/Printpaper.css";
import { useParams } from "react-router-dom";


const PrintLayour = () => {
    const [data, setData] = useState([]);
    const { id } = useParams();
    console.log(id);
  useEffect(() => {
    window.api.getPrintData().then(setData);
  }, []);

  useEffect(()=>{
    document.body.classList.remove('print-3inch','print-2inch','print-A4')

    if( id === 'A4'){
      document.body.classList.add('print-A4')
    } else if( id === '3-inch'){
      document.body.classList.add('print-3inch')
    } else if(id === '2-inch'){
      document.body.classList.add('print-2inch')
    }
  },[id])



  return (
    <>
        <div className={id === 'A4' ? "print-container" : id === '2-inch' ? "inch2-print-container" : "inch3-print-container"}>
          <div className={id === 'A4' ? "print-top" : id === '2-inch' ? "print2-top" : "print3-top"}>
            <h2>
              {data.user?.name.charAt(0).toUpperCase() +
                data.user?.name.slice(1).toLowerCase()}
              's Notes
            </h2>
            <p>{new Date().toLocaleString()}</p>
          </div>
          <div className={id === 'A4' ? "print-data" : id === '2-inch' ? "inch2-print-data" : "inch3-print-data"}>
            {data.notes?.map((note, index) => (
              <div className="" key={note.id}>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
              </div>
            ))}
          </div>
        </div>
    </>
  );
};

export default PrintLayour;
