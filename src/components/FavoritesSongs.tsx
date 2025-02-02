// React
import React from "react";

// React-Router-Dom
import { useNavigate } from "react-router-dom";

// Types
import { Datum } from "../types/RolitasType";

// Components
import SongLink from "../components/SongLink";
import StarIcon from "../components/StarIcon";

// Helpers
import { formatSeconds } from "../helpers/helpNumber";
import { isInFavorites } from "../helpers/helpFavorites";

// Interface
interface FavoritesSongProps {
  mySongs: Datum[];
}

const FavoritesSongs: React.FC<FavoritesSongProps> = ({ mySongs }) => {

  const navigate = useNavigate();

  const handleFavorites = (song: Datum, id: number) => isInFavorites(id) ? handleRemoveSong(id) : handleAddSong(song);

  const handleAddSong = (song: Datum) => {
    if (!song) return;
    const mySongsList = [...mySongs, song];
    localStorage.setItem("mySongs", JSON.stringify(mySongsList));
    console.log("Añadiendo canción a favoritos: ", song);
  };

  const handleRemoveSong = (id: number) => {
    const songToRemove = mySongs.find((song) => song.id === id);
    if (!songToRemove) return;
    const updatedSongs = mySongs.filter((song) => song.id !== id);
    localStorage.setItem("mySongs", JSON.stringify(updatedSongs));
    console.log("Eliminando canción de favoritos: ", songToRemove);
  };

  const handleSelectSong = (song: Datum) => {
      // Limpiar la URL
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.delete("q");
      window.history.replaceState(null, "", window.location.pathname + window.location.hash);
      navigate(`/details/${song.id}`);
    };

  return (
    <section className="container songs__list__container">
      <h2 className="songs__list__title">Favoritos</h2>
      <div className="songs__list__content">
        <ul className="songs__ul">
          {
            mySongs.map((song: Datum) => (
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

export default FavoritesSongs;