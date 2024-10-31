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
  document.getElementById('age-display').style.display = 'block';

  setInterval(updateAge, 100);
}

function updateAge() {
  const now = new Date();
  const ageInMs = now - birthDate;
  const ageInYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25);
  const ageParts = ageInYears.toFixed(8).split('.');

  document.getElementById('age-int').textContent = ageParts[0];
  document.getElementById('age-decimal').textContent = '.' + ageParts[1];
}
