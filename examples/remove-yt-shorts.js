if (/youtube\.[a-z]{2,3}/.test(window.location.host)) {
  const removeShorts = () => {
    document
      .querySelectorAll("ytd-rich-shelf-renderer[is-shorts]")
      .forEach((e) => e.remove());
  };
  new MutationObserver(removeShorts).observe(document, {
    childList: true,
    subtree: true,
  });
}
