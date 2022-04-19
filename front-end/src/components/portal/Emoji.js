import React from "react";
import ReactDOM from "react-dom";
import Picker from "emoji-picker-react";

const Emoji = ({ isEmoji, setChosenEmoji, CN }) => {
  if (!isEmoji) return null;

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
  };

  return ReactDOM.createPortal(
    <div className={CN}>
      <Picker onEmojiClick={onEmojiClick} />
    </div>,
    document.getElementById("portal")
  );
};

export default Emoji;
