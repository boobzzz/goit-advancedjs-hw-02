import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

const values = document.querySelectorAll('.value');
const input = document.querySelector('.timer-input');
const btn = document.querySelector('.timer-btn');
btn.disabled = true;

const INTERVAL = 1000;
let userSelectedDate;
let timer;

const fp = flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const currentTimestamp = Date.now();
    const selectedTimestamp = new Date(selectedDates[0]).getTime();
    if (selectedTimestamp > currentTimestamp) {
      userSelectedDate = selectedTimestamp - currentTimestamp;
      btn.disabled = false;
    } else {
      alertMessage('Invalid date:', 'Please choose a date in the future');
      btn.disabled = true;
    }
  },
});

btn.addEventListener('click', (e) => {
  input.disabled = true;
  btn.disabled = true;
  startCountdown();
});

function startCountdown() {
  timer = setInterval(() => {
    userSelectedDate -= INTERVAL;
    const parsedDate = convertMs(userSelectedDate);
    values.forEach((value) => {
      const key = Object.keys(value.dataset)[0];
      value.innerText = addLeadingZero(parsedDate[key].toString());
    });
    if (userSelectedDate < INTERVAL) {
      clearInterval(timer);
      input.disabled = false;
    }
  }, INTERVAL);
}

function addLeadingZero(value) {
  return value.padStart(2, '0');
}

function alertMessage(title, message) {
  iziToast.error({
    title: title,
    message: message,
    titleSize: 20,
    messageSize: 20,
    position: 'topRight'
  });
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
