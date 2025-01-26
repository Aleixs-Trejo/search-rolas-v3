// CSS
import "../css/SongDetails.css";

// React
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Types
import { Datum } from "../types/RolitasType";
import { Track } from "../types/TrackType";

// Components
import Message from "../components/Message";

// Assets
import errorImg from "../assets/img-error.webp";

// Helpers
import { formatSeconds, formatNumber } from "../helpers/helpNumber";
import { helpHttp } from "../helpers/helpHttp";

const trackEmpty: Track = {
  track: {
    name: "",
    mbid: "",
    url: "",
    duration: "",
    streamable: {
      "#text": "",
      fulltrack: "",
    },
    listeners: "",
    playcount: "",
    artist: {
      name: "",
      mbid: "",
      url: "",
    },
    album: {
      artist: "",
      title: "",
      mbid: "",
      url: "",
      image: {
        "#text": "",
        size: "",
      },
      "@attr": {
        position: "",
      },
    },
    toptags: {
      tag: [
        {
          name: "",
          url: "",
        },
      ],
    },
  }
};

const SongDetail: React.FC = () => {
  const [music, setMusic] = useState<Track>(trackEmpty);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { state } = useLocation();

  const handleBack = () => {
    const searchParam = state?.search || "";
    const baseUrl = window.location.origin;
    const newUrl = `${baseUrl}/?q=${encodeURIComponent(searchParam)}`;
    window.location.href = newUrl;
  };

  const song: Datum = state?.song;

  const { album, artist } = song;

  const imageAlbum = album?.cover_medium;

  const getBgAlbum = (imageAlbum: string): string => {
    return imageAlbum ? `url(${imageAlbum})` : `url(${errorImg})`;
  };

  const styleBg: React.CSSProperties = {
    position: "absolute",
    right: "0",
    width: "8rem",
    top: "0",
    bottom: "0",
    zIndex: "0",
    backgroundImage: `
      linear-gradient(to right, #1e1e2e 0%, rgba(255, 255, 255, 0) 5%),
      ${getBgAlbum(imageAlbum)}`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "center right",
  }

  const handleAudio = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleEnded = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const nameSong = song.title;
  const nameArtist = artist.name;

  useEffect(() => {
    const fetchData = async () => {
      const searchMusic = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=359068a0c00cee1077c6b8250442f33a&artist=${encodeURIComponent(nameArtist)}&track=${encodeURIComponent(nameSong)}&format=json`;
      try {
        const musicData = await helpHttp().get<Track>(searchMusic);
        if ("err" in musicData) {
          console.error(musicData.statusText);
        } else {
          setMusic(musicData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [nameSong, nameArtist]);

  if (!song) return <Message text="No se encontró la canción" />;

  return(
    <section className="section__details__song">
      <button className="form__button btn__back" onClick={handleBack}>Volver</button>
      <div className="details__song__container">
        <div className="song__header">
          <div className="song__header__container">
            <article className="song__header__content">
              <div className="song__bg" style={styleBg}></div>
              <div className="song__bg--color"></div>
              <div className="container song__data">
                <div className="song__data__texts">
                  <span className="song__data__artist">{artist?.name}</span>
                  <span className="song__data__title">{song.title}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
        <div className="container song__info__container">
          <article className="song__info__content">
            <section className="song__listeners__details">
              <div className="song__listeners__container">
                <span className="song__listeners__text">Oyentes</span>
                <span className="song__listeners__number">{formatNumber(music.track?.listeners)}</span>
              </div>
              <div className="song__listeners">
                <span className="song__listeners__text">Reproducido</span>
                <span className="song__listeners__number">{formatNumber(music.track?.playcount)}</span>
              </div>
            </section>
            <section className="song__info__details">
              <div className="song__lyrics__container">
                {
                  music.track?.duration && (
                    <div className="song__info__detail song__duration">
                      <span className="song__info__detail__text">Duración</span>
                      <span className="song__info__detail__number">{formatSeconds(song.duration)}</span>
                    </div>
                  )
                }
                {/* {
                  lyric.lyrics
                  ? (
                    <div className="song__info__detail song__lyric">
                      <span className="song__info__detail__text">Letra</span>
                      <div className={`song__lyric__container ${showLyric ? "show__lyric" : ""}`}>
                        <p className="song__info__detail__lyric">{lyric.lyrics}</p>
                      </div>
                      <button className="song__lyric__button" onClick={() => setShowLyric(!showLyric)}>
                        <img className="arrow__icon" src={arrow} alt="Icono de flecha" />
                      </button>
                    </div>
                  )
                  : (<Message text={`No se encontró letra para la canción`} />)
                } */}
                <Message text={`No se encontró letra para la canción`} />
              </div>
            </section>
            <section className="song__extra__details">
              <div className="song__extra__container">
                {music.track?.wiki && (
                  <div className="song__extra__info">
                    <p dangerouslySetInnerHTML={{ __html: music.track?.wiki.summary }} />
                  </div>
                )}
                <div className="song__extra__tags">
                  <div className="song__extra__tags__container">
                    <ul className="song__extra__tags__list">
                      {
                        music.track?.toptags.tag.map((tag, index) =>(
                          <li key={index} className="song__extra__tags__item">
                            <a className="tag__link" href={tag.url} rel="noreferrer" target="_blank">{tag.name}</a>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                </div>
                <div className="song__extra__album">
                  <h4 className="song__extra__title">Destacado en</h4>
                  <div className="song__extra__album__container">
                    <article className="song__audio__photo">
                      <figure className="song__extra__album__figure">
                        <img
                          className="song__extra__album__img"
                          src={album.cover_medium}
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; target.src = errorImg;
                          }}
                          alt="Imagen del álbum"
                        />
                        <div className="flex-c-c play__song" onClick={handleAudio}>
                          {
                            isPlaying ? (
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="icon__pause">
                                <path
                                  stroke="none"
                                  d="M0 0h24v24H0z"
                                  fill="none"
                                />
                                <path
                                  d="M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z"
                                />
                                <path d="M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" />
                              </svg>
                            ) : (
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="icon__play">
                                <path
                                  stroke="none"
                                  d="M0 0h24v24H0z"
                                  fill="none"
                                />
                                <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" />
                              </svg>
                            )
                          }
                          
                        </div>
                      </figure>
                      <a className="song__extra__album__content" href={music.track?.url ? music.track?.url : "#"} target="_blank" rel="noreferrer">
                        <div className="song__extra__album__text">
                          <div className="song__extra__album__texts">
                            <span className="song__extra__album__text">
                              {music.track?.album ? music.track?.album.title : music.track?.name}
                            </span>
                            <span className="song__extra__album__text">
                              {music.track?.album? music.track?.album.artist : music.track?.artist.name}
                            </span>
                            {
                              music.track?.listeners && <span className="song__extra__album__text">{formatNumber(music.track?.listeners)} Oyente(s)</span>
                            }
                          </div>
                        </div>
                      </a>
                    </article>
                  </div>
                </div>
              </div>
            </section>
            <section className="song__audio">
              <div className="song__audio__container">
                <audio
                  ref={audioRef}
                  src={song.preview}
                  onEnded={handleEnded}
                  className="song__audio__player"
                ></audio>
              </div>
            </section>
          </article>
        </div>
      </div>
    </section>
  );
};

export default SongDetail;