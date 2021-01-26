import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService, dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Profile = ({ refreshUser, userObj }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(
    userObj.displayName || ""
  );
  const [fileUrl, setFileUrl] = useState("");
  const [toggleBtn, setToggleBtn] = useState(true);
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  const getMyNweets = async () => {
    const nweets = await dbService
      .collection("nweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt")
      .get();
  };
  useEffect(() => {
    getMyNweets();
  });
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async () => {
    if (!toggleBtn) {
      let photoURL = userObj.photoURL;

      // 파일이 있을 때
      if (fileUrl !== "") {
        if (userObj.photoURL !== "") {
          await storageService.refFromURL(userObj.photoURL).delete();
        }
        const attachmentRef = storageService
          .ref()
          .child(`${userObj.uid}/author/${uuidv4()}`);

        const response = await attachmentRef.putString(fileUrl, "data_url");
        photoURL = await response.ref.getDownloadURL();

        const nweet_author = await dbService
          .collection("nweets_author")
          .where("uid", "==", userObj.uid)
          .get();

        if (nweet_author.empty) {
          const author = {
            uid: userObj.uid,
            photoURL,
          };
          await dbService.collection("nweets_author").add(author);
        } else {
          const { id } = nweet_author.docs[0];
          await dbService.doc(`nweets_author/${id}`).update({
            photoURL,
          });
        }
      }

      if (
        userObj.displayName !== newDisplayName ||
        userObj.photoURL !== photoURL
      ) {
        await userObj.updateProfile({
          displayName: newDisplayName,
          photoURL,
        });
        refreshUser();
      }
    }
  };

  const toggleUpdate = () => {
    setToggleBtn((pre) => !pre);
    if (!toggleBtn) {
      onSubmit();
      document.getElementById("display_name").disabled = true;
    } else {
      document.getElementById("display_name").disabled = false;
    }
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setFileUrl(result);
    };
    reader.readAsDataURL(theFile);
  };

  return (
    <div className="container">
      <form className="profileForm">
        <input
          onChange={onChange}
          type="text"
          disabled
          autoFocus
          placeholder="Display name"
          value={newDisplayName}
          className="formInput"
          id="display_name"
        />
        {!toggleBtn && (
          <>
            <label
              htmlFor="profile-file"
              className="factoryInput__label"
              style={{ textAlign: "center" }}
            >
              <span>Change photos</span>
              <FontAwesomeIcon icon={faPlus} />
            </label>
            <input
              id="profile-file"
              type="file"
              accept="imamge/*"
              onChange={onFileChange}
              style={{ opacity: 0, display: "none" }}
            />
          </>
        )}
        <button
          onClick={toggleUpdate}
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        >
          {toggleBtn ? "Update Profile" : "OK"}
        </button>
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};
export default Profile;
