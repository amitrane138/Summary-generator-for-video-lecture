import { Avatar, Button, TextField } from "@material-ui/core";
import React, {useEffect, useState } from "react";
import db, { storage } from "../../lib/firebase";
import "./style.css";
import firebase from "firebase";
import { v4 as uuidV4 } from "uuid";
import { useLocalContext } from "../../context/context";
import { Announcment } from "..";
const Main = ({ classData}) => {
  const { loggedInMail } = useLocalContext();

  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInput] = useState("");
  const [video, setVideo] = useState(null);
  const [progress, setProgress] = useState(0);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [videoURL, setVideoURL] = useState(null);

  const handlesubmit = () =>{
    handlevideoupload();
  }

  const handlevideoupload = () => {
    const uploadVideo = storage.ref(`videos/${video.name}`).put(video);

    uploadVideo.on("state_changed",
    (snapshot) => {
      const progressPercent = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      setProgress(progressPercent);
    },
    (err) => {
      console.log(err);
    },
     () => {
      storage
        .ref("videos")
        .child(video.name)
        .getDownloadURL()
        .then((url) => {
          setVideoURL(url);
          setVideoUploaded(true);
        });
    });

  }

  
  
  const handleChangeVideo = (e) => {
    if (e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };
  
  const detailid = uuidV4();

  useEffect(() => {
    if (videoUploaded) {
      db.collection("announcments")
        .doc("classes")
        .collection(classData.id)
        .add({
          detailid:detailid,
          timstamp: firebase.firestore.FieldValue.serverTimestamp(),
          videoURL: videoURL,
          text: inputValue,
          sender: loggedInMail,
        })
        .then(() => {
          setProgress(0);
          setVideo(null);
          setVideoURL("");
          setInput("");
          setShowInput(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUploaded]);
  return (
    <div className="main">
      <div className="main__wrapper">
        <div className="main__content">
          <div className="main__wrapper1">
            <div className="main__bgImage">
              <div className="main__emptyStyles" />
            </div>
            <div className="main__text">
              <h1 className="main__heading main__overflow">
                {classData.className}
              </h1>
              <div className="main__section main__overflow">
                {classData.section}
              </div>
              <div className="main__wrapper2">
                <em className="main__code">Class Code :</em>
                <div className="main__id">{classData.id}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="main__announce">
          <div className="main__announcements">
            <div className="main__announcementsWrapper">
              <div className="main__ancContent">
                {showInput ? (
                  <div className="main__form">
                    <TextField
                      id="filled-multiline-flexible"
                      multiline
                      label="Video Title"
                      variant="outlined"
                      value={inputValue}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <div className="main__buttons">
                      
                    <input className="uploadbutton"
                      onChange={handleChangeVideo}
                      variant="outlined"
                      label="Select Video"
                      color="primary"
                      type="file"
                      name="file"
                      id="file"
                    />
                    <label for="file">Select Video</label>
                    <progress className="progressbar" value={progress} max="100" />

                      <div>
                        <Button onClick={() => setShowInput(false)}>
                          Cancel
                        </Button>

                        <Button
                          onClick={handlesubmit}
                          color="primary"
                          variant="contained"
                        >
                          Post
                        </Button>
                        
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="main__wrapper100"
                    onClick={() => setShowInput(true)}
                  >
                    <Avatar />
                    <div>Add Video To Class</div>
                  </div>
                )}
              </div>
            </div>
            <Announcment classData={classData}  />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
