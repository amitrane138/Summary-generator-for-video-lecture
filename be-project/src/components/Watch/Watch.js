import React from 'react'

const watch = ({detail}) => {
    console.log(detail);
    return (
        <div>
            <video width="500" height="281" className="watch__video" controls>
                <source src={detail.videoURL}type="video/mp4" />
             </video>
        </div>
    )
}

export default watch

