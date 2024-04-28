export const LocalStorageManager = {
  isSideNavOpen: () => {
    const value = localStorage.getItem("isSideNavOpen");

    if (value === null) {
      return value;
    }
    return value === "true";
  },
  setSideNavOpen: (value: boolean) => {
    localStorage.setItem("isSideNavOpen", String(value));
  },
};
