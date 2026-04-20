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

  // const Header = [
  //   {
  //     type: "text",
  //     value:
  //       data.user?.name.charAt(0).toUpperCase() +
  //       data.user?.name.slice(1).toLowerCase() +
  //       "s Notes",
  //     style: { fontSize: "16px", textAlign: "center" },
  //   },
  //   {
  //     type: "text",
  //     value: new Date().toLocaleString(),
  //     style: { fontSize: "13px", textAlign: "center" },
  //   },
  //    {
  //     type: "text",
  //     value: "------------------------------",
  //     style: { textAlign: "center" },
  //   },
  // ];

  // const title =
  //   data.notes?.flatMap((note) => [
  //     {
  //       id: note.id,
  //       type: "text",
  //       value: note.title,
  //       style: { fontSize: "15px", textAlign: "center" },
  //     },
  //     {
  //       id: note.id,
  //       type: "text",
  //       value: note.content,
  //       style: { fontSize: "12px", textAlign: "center" },
  //     },
  //   ]) || [];

  // const PrintData = [...Header, ...title];
  // const SendData = async () => {
  //   await window.api.printpage(JSON.stringify(PrintData));
  // };
 

  // SendData();

  return (
    <>
      {id === "A4" && (
        <div className="print-container">
          <div className="print-top">
            <h2>
              {data.user?.name.charAt(0).toUpperCase() +
                data.user?.name.slice(1).toLowerCase()}
              's Notes
            </h2>
            <p>{new Date().toLocaleString()}</p>
          </div>
          <div className="print-data">
            {data.notes?.map((note, index) => (
              <div className="" key={note.id}>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {id === "2-inch" && (
         <div className="inch2-print-container">
          <div className="print2-top">
            <h2>
              {data.user?.name.charAt(0).toUpperCase() +
                data.user?.name.slice(1).toLowerCase()}
              's Notes
            </h2>
            <p>{new Date().toLocaleString()}</p>
          </div>
          <div className="inch2-print-data">
            {data.notes?.map((note, index) => (
              <div className="" key={note.id}>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {id === "3-inch" && (
       
        <div className="inch3-print-container">
          <div className="print3-top">
            <h2>
              {data.user?.name.charAt(0).toUpperCase() +
                data.user?.name.slice(1).toLowerCase()}
              's Notes
            </h2>
            <p>{new Date().toLocaleString()}</p>
          </div>
          <div className="inch3-print-data">
            {data.notes?.map((note, index) => (
              <div className="" key={note.id}>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PrintLayour;
