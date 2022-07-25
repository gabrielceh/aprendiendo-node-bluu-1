console.log('Hola desde public/js/app.js... soy frontend');
const server = window.location.origin;

document.addEventListener('click', (e) => {
  if (e.target.matches('.js-btn-copy')) {
    const url = `${server}/${e.target.dataset.short}`;
    // console.log(url);

    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log(`Texto copiado: ${url}`);
        e.target.textContent = 'Copied 📝';
      })
      .catch((error) => {
        console.log('❌ Ocurrió un error');
      });

    setTimeout(() => {
      e.target.textContent = 'Copy';
    }, 10000);
  }
});
