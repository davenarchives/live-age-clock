let birthDate;

function startClock() {
  const input = document.getElementById('birthdate-input').value;
  if (!input) {
    alert("Please enter your birthdate.");
    return;
  }

  birthDate = new Date(input);

  if (isNaN(birthDate.getTime())) {
    alert("Invalid date format. Please use MM/DD/YYYY format.");
    return;
  }

  document.getElementById('birthdate-input').style.display = 'none';
  document.querySelector("button").style.display = 'none';
  document.querySelector("h1").textContent = "Your Age:";
  document.getElementById('age-display').style.display = 'flex';

  setInterval(updateAge, 1000);
}

function updateAge() {
  const now = new Date();
  const ageInMs = now - birthDate;
  
  const years   = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365.25));
  const days    = Math.floor((ageInMs % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((ageInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ageInMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ageInMs % (1000 * 60)) / 1000);

  document.getElementById('years')  .textContent = years;
  document.getElementById('days')   .textContent = days;
  document.getElementById('hours')  .textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('seconds').textContent = seconds;
}