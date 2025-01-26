// CSS
import "../css/Message.css";

// Assets
import icon from "../assets/icon-error-white.svg";

type ColorHex = `#${string}`;

interface MessageProps {
  text: string,
  bgColor?: ColorHex
}

const Message: React.FC<MessageProps> = ({text, bgColor}) => {
  const style: React.CSSProperties = {
    backgroundColor: bgColor || "#dc2323",
  };

  return (
    <div className="message__container" style={style}>
      <div className="message__content">
        <figure className="message__figure">
          <img className="message__img" src={icon} alt="Icon Error" />
        </figure>
        <span className="message__text">{text}</span>
      </div>
    </div>
  );
};

export default Message;