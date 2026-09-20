const form = document.querySelector("#calorie-form");
const resultsPanel = document.querySelector("#results");
const activitySelect = document.querySelector("#activity");
const activityHint = document.querySelector("#activity-hint");

const output = {
  maintain: document.querySelector("#maintain-calories"),
  lose: document.querySelector("#lose-calories"),
  gain: document.querySelector("#gain-calories"),
  bmr: document.querySelector("#bmr-value"),
  activity: document.querySelector("#activity-value"),
};

const activityDescriptions = {
  "1.2": "Little or no exercise and mostly seated work.",
  "1.375": "Light exercise or active movement 1–3 days per week.",
  "1.55": "Exercise or active movement 3–5 days per week.",
  "1.725": "Hard exercise or active movement 6–7 days per week.",
  "1.9": "Very hard training, physical work, or twice-daily exercise.",
};

const fields = {
  age: { min: 15, max: 100, label: "Age" },
  height: { min: 120, max: 230, label: "Height" },
  weight: { min: 35, max: 300, label: "Weight" },
};

function formatCalories(value) {
  return Math.round(value).toLocaleString("en-US");
}

function validateField(name) {
  const input = form.elements[name];
  const config = fields[name];
  const value = Number(input.value);
  const error = document.querySelector(`#${name}-error`);

  if (!input.value || Number.isNaN(value)) {
    error.textContent = `${config.label} is required.`;
    input.classList.add("invalid");
    return false;
  }

  if (value < config.min || value > config.max) {
    error.textContent = `Enter a value from ${config.min} to ${config.max}.`;
    input.classList.add("invalid");
    return false;
  }

  error.textContent = "";
  input.classList.remove("invalid");
  return true;
}

function calculateCalories() {
  const age = Number(form.elements.age.value);
  const height = Number(form.elements.height.value);
  const weight = Number(form.elements.weight.value);
  const gender = form.elements.gender.value;
  const activity = Number(activitySelect.value);

  // Mifflin–St Jeor equation for basal metabolic rate.
  const genderAdjustment = gender === "male" ? 5 : -161;
  const bmr = 10 * weight + 6.25 * height - 5 * age + genderAdjustment;
  const maintenance = bmr * activity;

  output.bmr.textContent = formatCalories(bmr);
  output.maintain.textContent = formatCalories(maintenance);
  output.lose.textContent = formatCalories(Math.max(1200, maintenance - 500));
  output.gain.textContent = formatCalories(maintenance + 500);
  output.activity.textContent = `× ${activity}`;

  resultsPanel.classList.remove("is-updated");
  requestAnimationFrame(() => resultsPanel.classList.add("is-updated"));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const isValid = Object.keys(fields).every(validateField);

  if (!isValid) {
    form.querySelector(".invalid")?.focus();
    return;
  }

  calculateCalories();

  if (window.matchMedia("(max-width: 860px)").matches) {
    resultsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

Object.keys(fields).forEach((name) => {
  form.elements[name].addEventListener("input", () => validateField(name));
});

activitySelect.addEventListener("change", () => {
  activityHint.textContent = activityDescriptions[activitySelect.value];
});

calculateCalories();
