// index.js
// Step 1: Fetch Weather Alerts from National Weather Service API
function fetchWeatherAlerts(state) {
  // Clear any previous errors before making the request
  clearError();

  // Validate state code input
  if (!state || state.trim().length !== 2) {
    displayError("Please enter a valid 2-letter state abbreviation");
    return;
  }

  const cleanState = state.trim().toUpperCase();
  const url = `https://api.weather.gov/alerts/active?area=${cleanState}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch alerts. Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Step 2 & Step 3: Display results and clear input field
      displayAlerts(data, cleanState);
      resetInput();
    })
    .catch((errorObject) => {
      // Step 4: Handle and display error messages
      displayError(errorObject.message);
    });
}

// Step 2: Display Alerts in the DOM
function displayAlerts(data, state) {
  const titleElement = document.getElementById("alerts-title");
  const listElement = document.getElementById("alerts-list");

  // Step 3: Reset previous data from display
  titleElement.textContent = "";
  listElement.innerHTML = "";

  const features = data.features || [];
  
  // Set summary title using the title or count format specified
  const summaryTitle = data.title || `Current watches, warnings, and advisories for ${state}`;
  titleElement.textContent = `${summaryTitle}: ${features.length}`;

  // Populate list of headlines
  if (features.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No active weather alerts for this region.";
    listElement.appendChild(li);
  } else {
    features.forEach((alert) => {
      const headline = alert.properties?.headline || "No headline available";
      const li = document.createElement("li");
      li.textContent = headline;
      listElement.appendChild(li);
    });
  }
}

// Step 3: Reset input field
function resetInput() {
  const inputElement = document.getElementById("state-input");
  if (inputElement) {
    inputElement.value = "";
  }
}

// Step 4: Error Handling Helpers
function displayError(message) {
  const errorDiv = document.getElementById("error-message");
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
  }
}

function clearError() {
  const errorDiv = document.getElementById("error-message");
  if (errorDiv) {
    errorDiv.textContent = "";
    errorDiv.style.display = "none";
  }
}

// Event Listener for Form Submission
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("weather-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("state-input");
      fetchWeatherAlerts(input.value);
    });
  }
});

// Export functions for Jest unit testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    fetchWeatherAlerts,
    displayAlerts,
    resetInput,
    displayError,
    clearError
  };
}
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!