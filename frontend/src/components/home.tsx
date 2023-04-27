import YouTube, { YouTubeProps } from 'react-youtube';
import { MouseEvent, useState } from 'react';

export default function Home() {
  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  function addFavourite(e: MouseEvent<HTMLButtonElement>){
  const username = window.localStorage.getItem("username");
    fetch(`http://localhost:4000/videos/${vid}/${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      if (res.status == 200){
        window.alert("Hozzáadva a kedvencekhez!");
      } else if(res.status == 400) {
        window.alert("Ez a videó már a kedvencek között van!");
      } else {
        window.alert("Ismeretlen belső hiba!");
      }
    });
  }

  const [video, setVideo] = useState('eZuhIIJJPNI');
  const [vid, setVid] = useState(7);

  function getVideo(e: MouseEvent<HTMLButtonElement>) {
    setVid(getRandomInt(11));
    fetch(`http://localhost:4000/videos/${vid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.text())
      .then(link => setVideo(link));
    console.log(video);
  }

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    event.target.pauseVideo();
  };

  const opts: YouTubeProps['opts'] = {
    height: '440',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
    onReady: onPlayerReady,
  };

  return (
    <div className="video-wrapper">
      <div className="video-inner">
        <YouTube videoId={video} opts={opts} />
        <div>
          <button onClick={getVideo} type="button" className="btn btn-primary">Még!</button>
          <button onClick={addFavourite} type="button" className="btn btn-warning">Kedvencekhez adás</button>
        </div>
      </div>
    </div>
  );
}