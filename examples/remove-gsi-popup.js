const removeSignInPopup = () => {
  const dialog = document.querySelector("div#credential_picker_container");
  if (dialog) {
    const iframe = dialog.querySelector(
      'iframe[src*="google.com"][src*="gsi"]',
    );
    if (iframe) {
      dialog.remove();
      observer.disconnect();
    }
  }
};
new MutationObserver(removeSignInPopup).observe(document, {
  childList: true,
  subtree: true,
});
