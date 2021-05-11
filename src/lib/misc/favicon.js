const changeFavicon = (src) => {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.getElementsByTagName("head")[0].appendChild(link);
  }
  link.href = src;
};

// eslint-disable-next-line import/prefer-default-export
export { changeFavicon };
