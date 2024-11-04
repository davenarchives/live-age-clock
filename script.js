let birthDate;

function startClock() {
  const day = document.getElementById('day').value;
  const month = document.getElementById('month').value;
  const year = document.getElementById('year').value;
  const time = document.getElementById('time').value;

  if (!day || !month || !year) {
    alert("Please complete the birthdate fields.");
    return;
  }

  // Construct birthdate using selected date and optional time
  birthDate = new Date(year, month, day);
  if (time) {
    const [hours, minutes] = time.split(':');
    birthDate.setHours(hours, minutes);
  }

  // Hide birthdate heading and input sections
  document.querySelector("h1").style.display = 'none'; // Hide "Enter Your Birthdate" heading
  document.querySelector(".date-inputs").style.display = 'none';
  document.querySelector(".time-inputs").style.display = 'none';
  document.getElementById('age-label').style.display = 'block'; // Show "Age:" label
  document.getElementById('age-display').style.display = 'flex'; // Show age display section

  setInterval(updateAge, 1000);
}

function updateAge() {
  const now = new Date();
  const ageInMs = now - birthDate;

  const years = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25));
  const days = Math.floor((ageInMs % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
  const hours = String(Math.floor((ageInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
  const minutes = String(Math.floor((ageInMs % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
  const seconds = String(Math.floor((ageInMs % (1000 * 60)) / 1000)).padStart(2, '0');

  document.getElementById('years').textContent = years;
  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('seconds').textContent = seconds;
}
