document.getElementById("req")?.addEventListener("click", loadImage);

const info = (text: string) => {
  const output = document.getElementById("output") as HTMLDivElement;
  output.innerHTML = text;
};

function loadImage() {
  fetch("https://fetch-progress.anthum.com/30kbps/images/sunrise-baseline.jpg")
    .then((response) => {
      if (!response.ok) {
        info(response.status + " " + response.statusText);
      }

      if (!response.body) {
        info("ReadableStream not yet supported in this browser.");
      }

      const contentEncoding = response.headers.get("content-encoding");
      const contentLength = response.headers.get(
        contentEncoding ? "x-file-size" : "content-length"
      );
      if (contentLength === null) {
        throw Error("Response size header unavailable");
      }
      let loaded = 0;
      const total = parseInt(contentLength, 10);
      return new Response(
        new ReadableStream({
          start(controller) {
            const reader =
              response.body?.getReader() as ReadableStreamDefaultReader;

            read();
            function read() {
              reader
                .read()
                .then(({ done, value }) => {
                  if (done) {
                    controller.close();
                    return;
                  }
                  loaded += value.byteLength;
                  controller.enqueue(value);
                  info(
                    `downloaded: ${Number((loaded / total) * 100).toFixed(2)} %`
                  );
                  read();
                })
                .catch((error) => {
                  console.error(error);
                  controller.error(error);
                });
            }
          },
        })
      );
    })
    .then((response) => response.blob())
    .then((data) => {
      const img_el = document.getElementById("result") as HTMLImageElement;
      img_el.src = URL.createObjectURL(data);
    })
    .catch((error) => {
      console.error(error);
      info(error);
    });
}
