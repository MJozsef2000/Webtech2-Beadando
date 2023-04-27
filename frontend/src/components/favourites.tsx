import React, { useState, useEffect } from "react";

interface Video {
  _id: string;
  link: string;
  favby: string[];
  vid: number;
}

interface Props {
  username: string | null;
}

const UserFavoritesTable: React.FC<Props> = ({ username }) => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    fetch(`http://localhost:4000/videos/favorites/${username}`)
      .then((res) => res.json())
      .then((data) => {
        setVideos(data);
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [username]);

  return (
    <ul>
  {videos.map((video, index) => (
    <div className="list-wrapper">
      <div className="list-inner">
        <li key={video._id}>
          <a href={`https://www.youtube.com/watch?v=${video.link}`}>
            https://www.youtube.com/watch?v={video.link}
          </a>
          <button type="button" className="btn btn-danger" onClick={() => {
            const newVideos = [...videos];
            newVideos.splice(index, 1);
            setVideos(newVideos);
             // Make API request to remove video from favorites
             fetch(`http://localhost:4000/videos/remove/${video.vid}/${username}`, {
              method: 'DELETE'
            })
            .then(res => {
              if (!res.ok) {
                throw new Error('Network response was not ok');
              }
              console.log('Video removed from favorites');
            })
            .catch(err => {
              console.error(err);
            });
          }}>Törlés</button>
        </li>
      </div>
    </div>
  ))}
</ul>

  );
};

export default UserFavoritesTable;