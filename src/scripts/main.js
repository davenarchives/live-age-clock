const valueNodes = {
  years: document.getElementById('years'),
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds')
};

const controls = {
  month: document.getElementById('month'),
  day: document.getElementById('day'),
  year: document.getElementById('year'),
  time: document.getElementById('time'),
  start: document.getElementById('start-button'),
  reset: document.getElementById('reset-button'),
  form: document.getElementById('birth-form')
};

const clockStage = document.getElementById('clock-stage');
const themeViews = document.querySelectorAll('[data-theme-view]');
const decimalYearNode = document.getElementById('decimal-year');
const decimalFractionNode = document.getElementById('decimal-fraction');
const navDropdown = document.querySelector('.nav-dropdown');
const themeToggle = document.getElementById('theme-toggle');
const themeButtons = document.querySelectorAll('[data-theme-option]');
const brandButton = document.getElementById('brand-toggle');
const flipDisplays = {
  year: document.querySelector('[data-flip-unit="year"] .flip-display'),
  hour: document.querySelector('[data-flip-unit="hour"] .flip-display'),
  minute: document.querySelector('[data-flip-unit="minute"] .flip-display'),
  second: document.querySelector('[data-flip-unit="second"] .flip-display')
};

const MS_SECOND = 1000;
const MS_MINUTE = MS_SECOND * 60;
const MS_HOUR = MS_MINUTE * 60;
const MS_DAY = MS_HOUR * 24;
const MS_YEAR = MS_DAY * 365.25;

const THEMES = {
  date: 'date',
  decimal: 'decimal',
  digital: 'digital'
};

let birthDate = null;
let ageTimer = null;
let activeTheme = THEMES.date;
const flipState = {
  year: null,
  hour: null,
  minute: null,
  second: null
};

const showFormView = () => {
  document.body.classList.remove('has-results');
  clockStage.classList.add('hidden');
};

const showClockView = () => {
  if (!birthDate) return;
  document.body.classList.add('has-results');
  clockStage.classList.remove('hidden');
};

const setMaxYear = () => {
  controls.year.max = new Date().getFullYear();
};

const setAgeDisplay = (years = '00', days = '00', hours = '00', minutes = '00', seconds = '00') => {
  valueNodes.years.textContent = years;
  valueNodes.days.textContent = days;
  valueNodes.hours.textContent = hours;
  valueNodes.minutes.textContent = minutes;
  valueNodes.seconds.textContent = seconds;
};

const updateDecimalClock = (ageInMs = 0) => {
  if (!decimalYearNode || !decimalFractionNode) return;
  const exactYears = Math.max(0, ageInMs / MS_YEAR);
  let wholeYears = Math.floor(exactYears);
  const fractional = Math.max(0, exactYears - wholeYears);
  let fractionString = fractional.toFixed(8);

  if (fractionString.startsWith('1')) {
    wholeYears += 1;
    fractionString = '0.00000000';
  }

  decimalYearNode.textContent = String(wholeYears).padStart(2, '0');
  decimalFractionNode.textContent = fractionString.slice(1);
};

const updateDigitalClock = ({ years, hours, minutes, seconds }) => {
  const values = {
    year: years,
    hour: hours,
    minute: minutes,
    second: seconds
  };
  Object.entries(values).forEach(([unit, value]) => {
    const display = flipDisplays[unit];
    if (!display) return;
    if (flipState[unit] === null) {
      flipState[unit] = value;
      display.textContent = value;
      return;
    }
    if (flipState[unit] === value) return;
    flipState[unit] = value;
    display.classList.remove('flip-animate');
    // force reflow to restart animation
    void display.offsetWidth;
    display.classList.add('flip-animate');
    setTimeout(() => {
      display.textContent = value;
    }, 200);
    display.addEventListener(
      'animationend',
      () => display.classList.remove('flip-animate'),
      { once: true }
    );
  });
};

const setTheme = (theme) => {
  if (!Object.values(THEMES).includes(theme)) return;
  activeTheme = theme;
  document.body.dataset.theme = theme;
  themeViews.forEach((view) => {
    view.classList.toggle('active', view.dataset.themeView === theme);
  });
  themeButtons.forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.themeOption === theme);
  });
};

const startClock = () => {
  const monthValue = controls.month.value;
  const dayValue = controls.day.value;
  const yearValue = controls.year.value;
  const time = controls.time.value;

  if (monthValue === '' || dayValue === '' || yearValue === '') {
    alert('Please complete the month, day, and year before starting.');
    return;
  }

  const month = Number(monthValue);
  const day = Number(dayValue);
  const year = Number(yearValue);

  birthDate = new Date(year, month, day);

  if (time) {
    const [hours, minutes] = time.split(':').map(Number);
    birthDate.setHours(hours || 0, minutes || 0, 0, 0);
  } else {
    birthDate.setHours(0, 0, 0, 0);
  }

  updateAge();
  if (ageTimer) {
    clearInterval(ageTimer);
  }
  ageTimer = setInterval(updateAge, 1000);
  controls.reset.classList.remove('hidden');
  navDropdown.classList.remove('open');
  themeToggle.setAttribute('aria-expanded', 'false');
  showClockView();
};

const updateAge = () => {
  if (!birthDate) return;

  const now = new Date();
  const ageInMs = now - birthDate;
  let msDifference = ageInMs;

  if (msDifference < 0) {
    alert('The selected date is in the future. Please pick a valid birthdate.');
    resetClock();
    return;
  }

  const years = Math.floor(msDifference / MS_YEAR);
  msDifference %= MS_YEAR;

  const days = Math.floor(msDifference / MS_DAY);
  msDifference %= MS_DAY;

  const hours = Math.floor(msDifference / MS_HOUR);
  msDifference %= MS_HOUR;

  const minutes = Math.floor(msDifference / MS_MINUTE);
  msDifference %= MS_MINUTE;

  const seconds = Math.floor(msDifference / MS_SECOND);

  setAgeDisplay(
    years,
    String(days).padStart(2, '0'),
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0')
  );
  updateDecimalClock(ageInMs);
  updateDigitalClock({
    years: String(years).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0')
  });
};

const resetClock = () => {
  birthDate = null;
  if (ageTimer) {
    clearInterval(ageTimer);
    ageTimer = null;
  }
  controls.form.reset();
  controls.reset.classList.add('hidden');
  showFormView();
  setAgeDisplay();
  updateDecimalClock(0);
  flipState.year = null;
  flipState.hour = null;
  flipState.minute = null;
  flipState.second = null;
  Object.values(flipDisplays).forEach((display) => {
    if (display) {
      display.textContent = '00';
      display.classList.remove('flip-animate');
    }
  });
};

setMaxYear();
setAgeDisplay();
updateDecimalClock(0);
updateDigitalClock({
  years: '00',
  hours: '00',
  minutes: '00',
  seconds: '00'
});
setTheme(THEMES.date);

controls.start.addEventListener('click', startClock);
controls.reset.addEventListener('click', resetClock);

themeToggle.addEventListener('click', (event) => {
  event.stopPropagation();
  const isOpen = navDropdown.classList.toggle('open');
  themeToggle.setAttribute('aria-expanded', String(isOpen));
});

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const { themeOption } = button.dataset;
    setTheme(themeOption);
    navDropdown.classList.remove('open');
    themeToggle.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', (event) => {
  if (!navDropdown.contains(event.target)) {
    navDropdown.classList.remove('open');
    themeToggle.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    navDropdown.classList.remove('open');
    themeToggle.setAttribute('aria-expanded', 'false');
  }
});

brandButton?.addEventListener('click', () => {
  if (document.body.classList.contains('has-results')) {
    showFormView();
    return;
  }
  if (birthDate) {
    showClockView();
  } else {
    showFormView();
  }
});
