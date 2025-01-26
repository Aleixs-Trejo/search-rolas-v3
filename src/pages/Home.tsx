// CSS
import "../css/SongSearch.css";

// Hooks
import { useState, useEffect } from "react";

// Components
import Loader from "../components/Loader";
import SongForm from "../components/SongForm";

// Helpers
import { helpHttp } from "../helpers/helpHttp";

// Types
import {
  type Rolitas as RolitasType,
  type Datum,
  type Album,
  type Artist,
  TitleVersion,
  DatumType,
  AlbumType,
  ArtistType
} from "../types/RolitasType.d";
import SongList from "../components/SongList";

const SongSearch: React.FC = () => {

  const searchDataType: RolitasType = {
    data: [],
    total: 0,
    next: "",
  };

  const emptyResult: Datum = {
    id: 0,
    readable: false,
    title: "",
    title_short: "",
    title_version: TitleVersion.Empty,
    link: "",
    duration: 0,
    rank: 0,
    explicit_lyrics: false,
    explicit_content_lyrics: 0,
    explicit_content_cover: 0,
    preview: "",
    md5_image: "",
    artist: {
      id: 0,
      name: "",
      link: "",
      picture: "",
      picture_small: "",
      picture_medium: "",
      picture_big: "",
      picture_xl: "",
      tracklist: "",
      type: ArtistType.Artist
    },
    album: {
      id: 0,
      title: "",
      cover: "",
      cover_small: "",
      cover_medium: "",
      cover_big: "",
      cover_xl: "",
      md5_image: "",
      tracklist: "",
      type: AlbumType.Album
    },
    type: DatumType.Track,
  };

  const emptyAlbum: Album = {
    id: 0,
    title: "",
    cover: "",
    cover_small: "",
    cover_medium: "",
    cover_big: "",
    cover_xl: "",
    md5_image: "",
    tracklist: "",
    type: AlbumType.Album,
  };

  const emptyArtist: Artist = {
    id: 0,
    name: "",
    link: "",
    picture: "",
    picture_small: "",
    picture_medium: "",
    picture_big: "",
    picture_xl: "",
    tracklist: "",
    type: ArtistType.Artist,
  };

  const [search, setSearch] = useState<string>("");
  const [songs, setSongs] = useState<RolitasType>(searchDataType);
  const [result, setResult] = useState<Datum>(emptyResult);
  const [album, setAlbum] = useState<Album>(emptyAlbum);
  const [artist, setArtist] = useState<Artist>(emptyArtist);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        const searchSongData: RolitasType = await helpHttp().get<RolitasType>(searchData, optionsDeezer);
        setSongs(searchSongData);

      } catch (error) {
        console.error(error);
        setAlbum(emptyAlbum);
        setArtist(emptyArtist);
        setResult(emptyResult);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);
  
  const handeSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    // Manejo de la URL
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("q", searchTerm);
    window.history.replaceState(null, "", "?" + urlParams.toString());
  };

  const selectSong = (song: Datum) => {
    // Limpiar la URL
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete("q");
    window.history.replaceState(null, "", window.location.pathname + window.location.hash);

    setResult(song);
    setAlbum(song.album);
    setArtist(song.artist);
  }

  const resetSearch = () => {
    setSearch("");
    setResult(emptyResult);
    setAlbum(emptyAlbum);
    setArtist(emptyArtist);
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete("q");
    window.history.replaceState(null, "", window.location.pathname + window.location.hash);
  }

  return (
    <section className="app__container">
      <h1 className="app__title">Buscador de rolitas</h1>
      <div className="song__search__container">
        <SongForm handleSearch={handeSearch} />
        {isLoading && <Loader />}
        {search && !isLoading && (
          <SongList
            search={search}
            songs={songs}
            selectSong={selectSong}
            resetSearch={resetSearch}
          />
        )}
      </div>
    </section>
  );
};

export default SongSearch;