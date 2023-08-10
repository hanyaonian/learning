function setAppContent(text: string) {
  const app = document.getElementById('app');
  if (app) {
    app.textContent = text;
  }
}

(function () {
  const button = document.getElementById('req');
  button?.addEventListener('click', async () => {
    const content = await fetch('/demo');
    const text = await content.text();

    setAppContent(text);
  })
})()