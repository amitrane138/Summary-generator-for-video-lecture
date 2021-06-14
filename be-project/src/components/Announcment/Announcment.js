import { Avatar,Button,Checkbox } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Axios from 'axios';
import {Watch} from "..";
import db from "../../lib/firebase";
//import {PythonShell} from 'python-shell';
import "./style.css";


const Announcment = ({ classData}) => {

  const [announcment, setAnnouncment] = useState([]);
  const [currentvid, setcurrentvid] = useState("");
  const baseurl="http://localhost:8000/addvideo"
  function send(e){
    e.preventDefault();
    Axios.post(baseurl,{
      url:currentvid
    }).then(res =>{
      console.log(res)
    })
    console.log(currentvid);
  }


  useEffect(() => {
    if (classData) {
      let unsubscribe = db
        .collection("announcments")
        .doc("classes")
        .collection(classData.id)
        .onSnapshot((snap) => {
          setAnnouncment(snap.docs.map((doc) => doc.data()));
        });
      return () => unsubscribe();
    }
  }, [classData]);

  console.log(announcment);
  
  return (
    <div>
      {
      announcment.map((item) => (
        <div className="amt">
          <div className="amt__Cnt">
            <div className="amt__top">
              <Avatar />
              <div>{item.sender}</div>
            </div>
            <p className="amt__txt">{item.text}</p>

            <Watch detail={item}/>
            
          </div>
          <div className="amt_btns">
              <Checkbox color="primary" onChange={(e) => setcurrentvid(item.videoURL)}/>
              <Button variant="contained" color="primary" onClick = {send} >GET SUMMARY</Button>  
          </div>
        </div>
      ))}
    </div>
    
  );
};

export default Announcment;
