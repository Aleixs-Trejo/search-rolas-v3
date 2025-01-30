// React-Router-Dom
import { Link } from "react-router-dom";
import React from "react";

// Types
import { Datum } from "../types/RolitasType";
interface SongLinkProps {
  song: Datum
  url: string
  bgSong: string
  duration: string
  nameSong: string
  bgArtist: string
  nameArtist: string
  nameAlbum: string
  favorites: boolean
}

// Assets
import iconMusic from "../assets/icon-music-note-white.svg"

const SongLink: React.FC<SongLinkProps> = ({ url, bgSong, duration, nameSong, bgArtist, nameArtist, nameAlbum }) => {
  return(
    <Link to={url} className="song__li__container">
      <figure className="song__li__figure">
        <img
          className="song__li__img"
          src={bgSong}
          alt="Cover"
          draggable={false}
        />
        <span className="span__duration">{duration}</span>
      </figure>
      <div className="song__li__texts">
        <span className="song__li__title">{nameSong}</span>
        <div className="song__li__artist">
          <figure className="artist__figure">
            <img
              className="artist__img"
              alt="Artist Image"
              src={bgArtist}
            />
          </figure>
            <span className="song__li__artist__name">
              {nameArtist}
            </span>
            <figure className="artist__icon">
              <img
                className="artist__icon__img"
                src={iconMusic}
                alt="Icon Music"
                draggable={false}
              />
            </figure>
          </div>
        <span className="song__li__album">Álbum: {nameAlbum}</span>
      </div>
    </Link>
  );
};

export default SongLink;