import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { useContext, useEffect } from 'react';
import { Image } from '../assets/images';
import { Button, IconIdentifier } from '../components';
import { GlobalContext } from '../contexts';
import { firebaseAuth } from '../services';

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
    <Popover className="relative">
      <PopoverButton className="flex size-8 shrink-0 overflow-hidden rounded-full border outline-none">
        <img
          className="aspect-square size-full"
          src={
            loggedUser ? (loggedUser.photoURL ?? randomAvatarUrl) : Image.User
          }
          alt={loggedUser?.displayName ?? 'User Info'}
        />
      </PopoverButton>

      <PopoverPanel className="absolute right-0 mt-4 min-w-60 rounded-lg border border-gray-700 bg-gray-800 py-3 text-gray-50 shadow-md">
        <div className="mb-3 px-4">
          {loggedUser ? (
            <>
              {/* User details card */}
              <div className="flex items-center gap-3 pb-3">
                <img
                  className="aspect-square size-10 rounded-full border"
                  src={loggedUser.photoURL ?? randomAvatarUrl}
                  alt={loggedUser.displayName ?? 'user'}
                />
                <div className="flex flex-col">
                  <span>{loggedUser.displayName}</span>
                  <span className="text-xs text-gray-300">
                    {loggedUser.email}
                  </span>
                </div>
              </div>

              {/* Logout button */}
              <Button
                variant="secondary"
                className="my-1 w-full border"
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
              className="my-1 w-full border"
              iconIdentifier={IconIdentifier.GoogleColor}
              onClick={loginWithGoogle}
            >
              Login with Google
            </Button>
          )}
        </div>

        {/* Panel Footer */}
        <hr />
        <div className="mt-2 flex items-center justify-center gap-2 rounded-md px-4">
          <p className="text-sm font-medium italic text-gray-300">Product by</p>
          <img
            src={Image.Logo}
            alt="CodinGunda"
            className="aspect-square size-6 object-contain"
            title="CodinGunda"
          />
        </div>
      </PopoverPanel>
    </Popover>
  );
};
