import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      console.log("onAuthStateChanged");
      if (user) {
        setUserObj({
          photoURL:
            user.photoURL ||
            "https://us.123rf.com/450wm/2nix/2nix1408/2nix140800145/30818238-%EC%86%8C%EC%85%9C-%EC%9B%B9-%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%97%90-%EB%8C%80%ED%95%9C-%EB%82%A8%EC%84%B1-%EC%95%84%EB%B0%94%ED%83%80-%ED%94%84%EB%A1%9C%ED%95%84-%EC%82%AC%EC%A7%84-%EC%82%AC%EC%9A%A9-%EB%B2%A1%ED%84%B0-.jpg?ver=6",
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    console.log("refreshUser");
    const user = authService.currentUser;
    setUserObj({
      photoURL:
        user.photoURL ||
        "https://us.123rf.com/450wm/2nix/2nix1408/2nix140800145/30818238-%EC%86%8C%EC%85%9C-%EC%9B%B9-%EC%82%AC%EC%9D%B4%ED%8A%B8%EC%97%90-%EB%8C%80%ED%95%9C-%EB%82%A8%EC%84%B1-%EC%95%84%EB%B0%94%ED%83%80-%ED%94%84%EB%A1%9C%ED%95%84-%EC%82%AC%EC%A7%84-%EC%82%AC%EC%9A%A9-%EB%B2%A1%ED%84%B0-.jpg?ver=6",
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing...."
      )}
    </>
  );
}

export default App;
