import React from "react";

export default function useFilesToImageUrls(
  initImageUrls = null,
  initFiles = null
) {
  const [files, setFiles] = React.useState(initFiles);
  const [imageUrls, setImageUrls] = React.useState(initImageUrls);

  React.useEffect(() => {
    if (files instanceof FileList) {
      Promise.all(
        Object.values(files).map(file =>
          readFilePromise(file).then(e => e.target.result)
        )
      ).then(urls => setImageUrls(urls));
    } else if (files instanceof File) {
      readFilePromise(files).then(e => setImageUrls([e.target.result]));
    }
  }, [files]);

  return [imageUrls, setFiles];
}

const readFilePromise = file =>
  new Promise((res, rej) => {
    const fr = new FileReader();

    fr.onload = res;
    fr.onerror = rej;

    fr.readAsDataURL(file);
  });
