import {
  faPencilAlt,
  faSave,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure?");
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete();
      if (nweetObj.attachmentUrl !== "") {
        await storageService.refFromURL(nweetObj.attachmentUrl).delete();
      }
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`nweets/${nweetObj.id}`).update({ text: newNweet });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };
  return (
    <div className="nweet">
      <div className="nweet_container" style={{ paddingRight: "10px" }}>
        <img className="profile" src={nweetObj.creator.photoURL} />
      </div>
      <div>
        {nweetObj.creator.displayName}
        {editing ? (
          <>
            <br />
            <input
              type="text"
              onChange={onChange}
              value={newNweet}
              required
              autoFocus
            />
            {nweetObj.attachmentUrl && (
              <img className="content__img" src={nweetObj.attachmentUrl} />
            )}
            {isOwner && (
              <div className="nweet__actions">
                <span onClick={toggleEditing}>
                  <FontAwesomeIcon icon={faTimes} />
                </span>
                <span onClick={onSubmit}>
                  <FontAwesomeIcon icon={faSave} />
                </span>
              </div>
            )}
          </>
        ) : (
          <>
            <h4>{nweetObj.text}</h4>
            {nweetObj.attachmentUrl && (
              <img className="content__img" src={nweetObj.attachmentUrl} />
            )}

            {isOwner && (
              <div className="nweet__actions">
                <span onClick={onDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} />
                </span>
                <span onClick={toggleEditing}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Nweet;
