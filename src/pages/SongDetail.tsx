/* eslint-disable @typescript-eslint/no-unused-expressions */
// CSS
import "../css/SongDetails.css";

// React
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Types
import { Datum } from "../types/RolitasType";
import { Track } from "../types/TrackType";
import { Lyrics } from "../types/LyricsType";
import { ArtistBio } from "../types/ArtistBio";

// Components
import Message from "../components/Message";

// Assets
import errorImg from "../assets/img-error.webp";
import arrow from "../assets/icon-arrow-white.svg";

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
      image: [
        {
          "#text": "",
          size: "",
        }
      ],
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

const lyricsEmpty: Lyrics = {
  lyrics: "",
};

const artistBioEmpty: ArtistBio = {
  artist: {
    name: "",
    mbid: "",
    url: "",
    image: [
      {
        "#text": "",
        size: "",
      }
    ],
    streamable: "",
    ontour: "",
    stats: {
      listeners: "",
      playcount: "",
    },
    similar: {
      artist: [
        {
          name: "",
          url: "",
          image: [
            {
              "#text": "",
              size: "",
            }
          ],
        }
      ],
    },
    tags: {
      tag: [
        {
          name: "",
          url: "",
        },
      ],
    },
    bio: {
      links: {
        link: {
          "#text": "",
          rel: "",
          href: "",
        }
      },
      published: "",
      summary: "",
      content: "",
    },
  },
};

const SongDetail: React.FC = () => {
  const [music, setMusic] = useState<Track>(trackEmpty);
  const [lyric, setLyric] = useState<Lyrics>(lyricsEmpty);
  const [showLyric, setShowLyric] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [artistBio, setArtistBio] = useState<ArtistBio>(artistBioEmpty);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { state } = useLocation();

  const handleBack = () => {
    const searchParam = state?.search || "";
    const baseUrl = `${window.location.origin}/search-rolas-v3`;
    console.log("baseUrl", baseUrl);
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
      const searchlyrics = `https://api.lyrics.ovh/v1/${encodeURIComponent(nameArtist)}/${encodeURIComponent(nameSong)}`;
      const searchArtistBio = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(nameArtist)}&api_key=359068a0c00cee1077c6b8250442f33a&format=json`;
      try {
        // ir al top de la página
        window.scrollTo(0, 0);
        const [musicData, lyricData, artistBioData] = await Promise.all([
          helpHttp().get<Track>(searchMusic),
          helpHttp().get<Lyrics>(searchlyrics),
          helpHttp().get<ArtistBio>(searchArtistBio)
        ]);

        "err" in musicData ? console.error(musicData.statusText) : setMusic(musicData);

        "err" in lyricData ? console.error(lyricData.statusText) : setLyric(lyricData);

        "err" in artistBioData ? console.error(artistBioData.statusText) : setArtistBio(artistBioData);

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
      <section className="details__song__container">
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
                {
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
                }
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
      </section>
      <section className="container song__artist__section">
        <h4 className="song__artist__title">Acerca del artista</h4>
        <article className="song__artist__container">
          {/* aquí irían las imágenes */}
          <div className="song__artist__photos">
            <article className="artist__bio__container">
              <div className="artist__bg" style={{"--bg-img": `url(${artist.picture_medium})`, "--bg-img-xl": `url(${artist.picture_xl})`} as React.CSSProperties}>
                <div className="artist__text__container">
                  <div className="artist__text">
                    <div className="artist__text__header">
                      <h2 className="artist__name">{artist.name}</h2>
                      <span className="artist__listeners">{formatNumber(music.track?.listeners)} oyentes</span>
                    </div>
                    <div className="artist__text__bio">
                      <div className="artist__text__bio__content">
                        <p className="artist__bio__text" dangerouslySetInnerHTML={{ __html: artistBio.artist.bio.summary }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
          <div className="song__artist__about">
            <div className="artist__tags">
              <ul className="song__artist__tags__list">
                {
                  artistBio.artist.tags.tag.map((tag, index) => (
                    <li key={index} className="song__artist__tags__item">
                      <a className="tag__link" href={tag.url}>{tag.name}</a>
                    </li>
                  ))
                }
              </ul>
            </div>
            <div className="song__artist__more">
              <p className="song__artist__bio__profile">
                <a className="song__link" href={artistBio.artist.bio.links.link.href} target="_blank" rel="noreferrer">Perfil del artista</a>
              </p>
              <p className="song__artist__bio__wiki">
                <a
                  className="song__link"
                  href={`https://es.wikipedia.org/w/index.php?search=${artist.name}+music`} target="_blank" rel="noreferrer"
                >
                  Wiki del artista
                </a>
              </p>
            </div>
          </div>
        </article>
      </section>
    </section>
  );
};

export default SongDetail;