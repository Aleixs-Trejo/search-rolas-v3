// CSS
import "../css/SongList.css";

// React
import React from "react";
import { Datum, Rolitas } from "../types/RolitasType";
import { useNavigate } from "react-router-dom";

// Types
interface SongListProps {
  search: string
  songs: Rolitas
  resetSearch: () => void;
}

// Assets
import SongLink from "./SongLink";

// Helpers
import { formatSeconds } from "../helpers/helpNumber";

const SongList: React.FC<SongListProps> = ({ search, songs, resetSearch }) => {
  const navigate = useNavigate();

  if (!songs) return null;

  const { data, total } = songs;

  const handleSelectSong = (song: Datum) => {
    // Limpiar la URL
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete("q");
    window.history.replaceState(null, "", window.location.pathname + window.location.hash);
    navigate(`/details/${song.id}`, { state: { song, search } });
  };

  return (
    <section className="container songs__list__container">
      <h2 className="songs__list__title">Resultados de la búsqueda &apos;{search}&apos; - {total} rolitas encontradas UwU</h2>
      <div className="songs__list__content">
        <button className="form__button btn__reset" onClick={() => resetSearch()}>Limpiar búsqueda</button>
        <ul className="songs__ul">
          {
            data.map((song: Datum) => (
              <li
                key={song.id}
                className="song__li"
                onClick={() => handleSelectSong(song)}
              >
                <SongLink
                  url={`/details/${song.id}`}
                  bgSong={`https://cdns-images.dzcdn.net/images/cover/${song.md5_image}/500x500-000000-80-0-0.jpg`}
                  duration={formatSeconds(song.duration)}
                  nameSong={song.title}
                  bgArtist={song.artist.picture_small}
                  nameArtist={song.artist.name}
                  nameAlbum={song.album.title}
                />
              </li>
            ))
          }
        </ul>
      </div>
    </section>
  );
};

export default SongList;