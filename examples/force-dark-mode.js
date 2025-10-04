const matchMedia = window.matchMedia;
window.matchMedia = (mediaQuery) => {
  if (
    typeof mediaQuery === "string" &&
    mediaQuery.includes("prefers-color-scheme")
  ) {
    const matches = mediaQuery.includes("dark");
    return {
      matches,
      media: mediaQuery,
      onchange: null,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent() {
        return true;
      },
    };
  }
  return matchMedia(mediaQuery);
};
