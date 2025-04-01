import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const RESOLVED = 'fulfilled';
const messages = {
  fulfilled: { type: 'success', title: '✅', text: 'Fulfilled promise in' },
  rejected: { type: 'error', title: '❌', text: 'Rejected promise in' },
}
const options = {
  delay: 1000,
  shouldResolve: true
}

const form = document.querySelector('.form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const { delay, state } = Object.fromEntries(new FormData(form).entries());

  options.delay = delay;
  options.shouldResolve = state === RESOLVED;

  generatePromise(options)
    .then((delay) => {
      showMessage(
        messages.fulfilled.type,
        messages.fulfilled.title,
        `${messages.fulfilled.text} ${delay}ms`
      );
    })
    .catch((delay) => {
      showMessage(
        messages.rejected.type,
        messages.rejected.title,
        `${messages.rejected.text} ${delay}ms`
      );
    });
});

function generatePromise(options) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if(options.shouldResolve) {
        resolve(options.delay)
      } else {
        reject(options.delay)
      }
    }, options.delay);
  });
}

function showMessage(type, title, message) {
  iziToast[type]({
    title: title,
    message: message
  })
}
