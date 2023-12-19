const checkSessionAndRedirect = (navigate, sessionKey, redirectPage) => {
  const data = sessionStorage.getItem(sessionKey);

  if (!data || data === "") {
    navigate(redirectPage);
    return;
  }
};

export default checkSessionAndRedirect;
