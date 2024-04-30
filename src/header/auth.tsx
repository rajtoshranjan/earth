import { Popover } from "@headlessui/react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useContext, useEffect } from "react";
import { Image } from "../assets/images";
import { Button, IconIdentifier } from "../components";
import { GlobalContext } from "../contexts";
import { firebaseAuth } from "../services";

export const Auth = () => {
  // Contexts.
  const { loggedUser, setLoggedUser } = useContext(GlobalContext);

  // Constants.
  const randomAvatarUrl = `https://ui-avatars.com/api/?format=svg&background=f9fafb&color=111827&bold=false&name=${loggedUser?.displayName}`;

  // useEffects.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setLoggedUser?.(user);
    });
    return unsubscribe;
  }, []);

  // Handlers.
  const loginWithGoogle = () => {
    const googleAuthProvider = new GoogleAuthProvider();

    signInWithPopup(firebaseAuth, googleAuthProvider)
      .then((userCredential) => {
        setLoggedUser?.(userCredential.user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const logout = () => {
    signOut(firebaseAuth)
      .then(() => {
        setLoggedUser?.(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Popover>
      <Popover.Button className="size-8 border flex shrink-0 overflow-hidden rounded-full outline-none">
        <img
          className="aspect-square size-full"
          src={loggedUser ? loggedUser.photoURL ?? randomAvatarUrl : Image.User}
        />
      </Popover.Button>

      <Popover.Panel className="absolute bg-gray-800 right-0 mt-4 mr-3 py-3 rounded-lg text-gray-50 w-60">
        <div className="px-4 mb-3">
          {loggedUser ? (
            <>
              {/* User details card */}
              <div className="flex items-center gap-3 pb-3">
                <img
                  className="aspect-square size-10 rounded-full border"
                  src={loggedUser.photoURL ?? randomAvatarUrl}
                />
                <div className="flex flex-col">
                  <span className="text-md">{loggedUser.displayName}</span>
                  <span className="text-xs text-gray-300">
                    {loggedUser.email}
                  </span>
                </div>
              </div>

              {/* Logout button */}
              <Button
                variant="secondary"
                className="border w-full my-1"
                iconIdentifier={IconIdentifier.Logout}
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            // Login buttons.
            <Button
              variant="secondary"
              className="border w-full my-1"
              iconIdentifier={IconIdentifier.GoogleColor}
              onClick={loginWithGoogle}
            >
              Login with Google
            </Button>
          )}
        </div>

        {/* Panel Footer */}
        <hr />
        <div className="flex gap-2 px-4 items-center justify-center rounded-md mt-2">
          <p className="text-sm font-medium text-gray-300 italic">Product by</p>
          <img
            src={Image.Logo}
            alt="CodinGunda"
            className="aspect-square object-contain size-6"
            title="CodinGunda"
          />
        </div>
      </Popover.Panel>
    </Popover>
  );
};
