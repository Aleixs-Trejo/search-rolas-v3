import React from 'react';

interface ModalProps {
  modal: boolean;
  closeModal: () => void;
  actionModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ modal, closeModal, actionModal }) => {
  return (
    <article className={`flex-c-c modal ${modal && 'modal--show'}`} onClick={closeModal}>
      <div className="modal__container" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal__close"
          onClick={closeModal}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 6L6 18"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="modal__content">
          <h2 className="modal__title">Desea eliminar de favoritos?</h2>
          <div className="modal__btns">
            <button
              className="modal__btn action__modal__btn"
              type="button"
              onClick={actionModal}
            >
              Aceptar
            </button>
            <button
              className="modal__btn"
              type="button"
              onClick={closeModal}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Modal;
