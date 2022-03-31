import React from "react";
import ReactDOM from "react-dom";
import Picker from "emoji-picker-react";

const Emoji = ({ isEmoji, onClose, setChosenEmoji }) => {
  if (!isEmoji) return null;

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
  };

  return ReactDOM.createPortal(
    <div className="fixed left-0 top-1/4">
      <Picker onEmojiClick={onEmojiClick} />
    </div>,
    document.getElementById("portal")
  );
};

export default Emoji;
