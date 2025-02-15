// CSS
import "../css/SongSearch.css";

// Hooks
import React, { useState, useEffect } from "react";

// Components
import Loader from "../components/Loader";
import SongForm from "../components/SongForm";
import Message from "../components/Message";

// Helpers
import { helpHttp } from "../helpers/helpHttp";

// Types
import {
  Datum,
  type Rolitas as RolitasType,
} from "../types/RolitasType.d";

// Components
import SongList from "../components/SongList";
import FavoritesSongs from "../components/FavoritesSongs";

// LocalStorage
// let mySongsInit: Datum[] = JSON.parse(localStorage.getItem("mySongs") || "[]");

const mySongsInit: Datum[] = (() => {
  try {
    const storedData = JSON.parse(localStorage.getItem("mySongs") || "[]");
    return Array.isArray(storedData) ? storedData : [];
  } catch (error) {
    console.error("Error al leer datos de localStorage", error);
    return [];
  }
})();

const SongSearch: React.FC = () => {

  const searchDataType: RolitasType = {
    data: [],
    total: 0,
    next: "",
  };

  const [search, setSearch] = useState<string>("");
  const [songs, setSongs] = useState<RolitasType>(searchDataType);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mySongs, setMySongs] = useState<Datum[]>(mySongsInit);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);

  useEffect(() => {
    // Manejo de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("q");

    if (query) setSearch(query);
  }, []);

  useEffect(() => {
    if (!search) return;
    
    // Limpiamos consola
    console.clear();
    
    const fetchData = async () => {
      const optionsDeezer = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': 'd28f99b928mshd47f28f3ab35126p1cb27ajsncd22da7836b7',
          'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
        }
      };

      const searchData = `https://deezerdevs-deezer.p.rapidapi.com/search?q=${encodeURIComponent(search)}`;

      setIsLoading(true);

      try {
        const searchSongData = await helpHttp().get<RolitasType>(searchData, optionsDeezer);

        if ("err" in searchSongData) {
          console.error(searchSongData.statusText);
        } else {
          console.log("searchSongData.data", searchSongData.data);
          setSongs(searchSongData);
        }

      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [search]);
  
  const handeSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    // Manejo de la URL
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("q", searchTerm);
    window.history.replaceState(null, "", "?" + urlParams.toString());
  };

  const resetSearch = () => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete("q");
    window.history.replaceState(null, "", window.location.pathname + window.location.hash);
    setSearch("");
  }

  return (
    <section className="app__container">
      <h1 className="app__title">Buscador de rolitas</h1>
      <div className="song__search__container">
        <SongForm
          handleSearch={handeSearch}
          mySongs={mySongs}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
        />
        {isLoading && <Loader />}
        {search && !isLoading && songs.data.length > 0 && (
          <SongList
            search={search}
            songs={songs}
            resetSearch={resetSearch}
            mySongs={mySongs}
            setMySongs={setMySongs}
          />
        )}
        {search && !isLoading && songs.data.length === 0 && (
          <Message text="No se encontraron resultados, ¿Qué estás buscando, baboso?" />
        )}
        {
          !search && !isLoading && showFavorites && mySongs.length > 0 && (
            <FavoritesSongs
              mySongs={mySongs}
              setMySongs={setMySongs}
            />
          )
        }
      </div>
    </section>
  );
};

export default SongSearch;