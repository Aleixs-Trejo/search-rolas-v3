// CSS
import "../css/SongForm.css";

// Assets
import iconSearch from "../assets/icon-search-white.svg";

// Hooks
import React, { useState } from "react";
import { Datum } from "../types/RolitasType";

interface SongFormProps {
  handleSearch: (searchTerm: string) => void;
  mySongs: Datum[];
  showFavorites: boolean;
  setShowFavorites: React.Dispatch<React.SetStateAction<boolean>>;
}

const SongForm: React.FC<SongFormProps> = ({ handleSearch, mySongs, showFavorites, setShowFavorites }) => {
  const [search, setSearch] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!search) {
      alert("Busca algo, no seas idiota!");
      return;
    }

    handleSearch(search);
  };

  return (
    <section className="section__form">
      <div className="form__container">
        <form className="form form__search" onSubmit={handleSubmit}>
          <div className="form__content">
            <div className="inputs__container">
              <div className="form__inputs">
                <input
                  type="text"
                  className="form__input"
                  name="search"
                  placeholder="Nombre de la rola o artist..."
                  onChange={handleChange}
                  value={search}
                  autoComplete="off"
                />
              </div>
              <button className="flex-c-c form__button" type="submit">
                <figure className="flex-c-c button__figure">
                  <img
                    className="button__img"
                    src={iconSearch}
                    alt="Icon Search"
                  />
                </figure>
              </button>
            </div>
            <button
              type="button"
              className="form__button btn__show__favorites"
              onClick={() => setShowFavorites(!showFavorites)}
              disabled={!mySongs.length}
            >
              {showFavorites ? "Ocultar Favoritos" : "Ver Favoritos"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SongForm;