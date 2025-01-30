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
  mySongs: Datum[];
  setMySongs: React.Dispatch<React.SetStateAction<Datum[]>>;
}

// Assets
import SongLink from "./SongLink";

// Helpers
import { formatSeconds } from "../helpers/helpNumber";
import { isInFavorites } from "../helpers/helpFavorites";

// Components
import StarIcon from "./StarIcon";

const SongList: React.FC<SongListProps> = ({ search, songs, resetSearch, mySongs, setMySongs }) => {
  const navigate = useNavigate();

  if (!songs) return null;

  const { data, total } = songs;

  const handleAddSong = (song: Datum) => {
    if (!song) return;
    const mySongsList = [...mySongs, song];
    setMySongs(mySongsList);
    localStorage.setItem("mySongs", JSON.stringify(mySongsList));
    console.log("Añadiendo canción a favoritos: ", song);
  };

  const handleRemoveSong = (id: number) => {
    const songToRemove = mySongs.find((song) => song.id === id);
    if (!songToRemove) return;
    const updatedSongs = mySongs.filter((song) => song.id !== id);
    setMySongs(updatedSongs);
    localStorage.setItem("mySongs", JSON.stringify(updatedSongs));
    console.log("Eliminando canción de favoritos: ", songToRemove);
  };

  const handleSelectSong = (song: Datum) => {
    // Limpiar la URL
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete("q");
    window.history.replaceState(null, "", window.location.pathname + window.location.hash);
    navigate(`/details/${song.id}`, { state: { song, search } });
  };

  const handleFavorites = (song: Datum, id: number) => isInFavorites(id) ? handleRemoveSong(id) : handleAddSong(song);

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
                  song={song}
                  url={`/details/${song.id}`}
                  bgSong={`https://cdns-images.dzcdn.net/images/cover/${song.md5_image}/500x500-000000-80-0-0.jpg`}
                  duration={formatSeconds(song.duration)}
                  nameSong={song.title}
                  bgArtist={song.artist.picture_small}
                  nameArtist={song.artist.name}
                  nameAlbum={song.album.title}
                  favorites={isInFavorites(song.id)}
                />
                <button
                  className="btn__favorites"
                  onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                    e.stopPropagation();
                    handleFavorites(song, song.id);
                  }}
                >
                  <StarIcon filled={isInFavorites(song.id)} />
                </button>
              </li>
            ))
          }
        </ul>
      </div>
    </section>
  );
};

export default SongList;