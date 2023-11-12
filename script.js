// Function to get the exchange rate from local storage
function getExchangeRate() {
    const storedRate = localStorage.getItem("exchangeRate");
    return storedRate ? parseFloat(storedRate) : 1.0;
}

// Function to set the exchange rate in local storage
function setExchangeRate(rate) {
    localStorage.setItem("exchangeRate", rate.toString());
}

// Function to convert amount to Euros using the stored exchange rate
function convertToEuros(amount, rate) {
    return amount * rate;
}

// Function to get activities from local storage
function getActivities() {
    const storedActivities = localStorage.getItem("activities");
    return storedActivities ? JSON.parse(storedActivities) : [];
}

// Function to set activities in local storage
function setActivities(activities) {
    localStorage.setItem("activities", JSON.stringify(activities));
}

// Initialize the activity list when the page loads
document.addEventListener("DOMContentLoaded", () => {
    activities = getActivities(); // Load activities from local storage
    updateActivityList();
    updateTotalAmount();
});

const activitySelect = document.getElementById("activity-select");
const customActivityInput = document.getElementById("custom-activity");
const dateInput = document.getElementById("date");
const amountInput = document.getElementById("amount");
const currencySelect = document.getElementById("currency");
const addActivityButton = document.getElementById("add-activity");

const activityList = document.getElementById("activity-list");
const totalAmountSpan = document.getElementById("total-amount");

const categorySelect = document.getElementById("category-select");
const showAmountButton = document.getElementById("show-amount-button");
const amountSpentDiv = document.getElementById("amount-spent");
const exchangeRateInput = document.getElementById("exchange-rate");

// Initialize the exchange rate input with the stored value
exchangeRateInput.value = getExchangeRate();

let activities = getActivities(); // Load activities from local storage

addActivityButton.addEventListener("click", addActivity);
showAmountButton.addEventListener("click", showAmount);

function addActivity() {
    const selectedActivity = activitySelect.value === "custom" ? customActivityInput.value : activitySelect.value;
    const date = dateInput.value;
    const amount = parseFloat(amountInput.value);
    const currency = currencySelect.value;

    
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid positive amount.");
        return;
    }

    const activity = {
        type: selectedActivity,
        date: date,
        amount: amount,
        currency: currency
    };

    activities.push(activity);
    setActivities(activities); // Save activities to local storage
    updateActivityList();
    updateTotalAmount();


    // Clear input fields
    activitySelect.value = "choose";
    customActivityInput.value = "";
    customActivityInput.value = "";
    dateInput.value = "";
    amountInput.value = "";
    currencySelect.value = "THB";
    categorySelect.value = ""; 
}

function updateActivityList() {
    activityList.innerHTML = "";
    activities.forEach((activity, index) => {
        const listItem = document.createElement("li");
        const formattedDate = new Date(activity.date).toLocaleDateString("en-GB");

        let activityDetails = `${formattedDate}: ${activity.type} - Spent ${activity.amount} ${activity.currency}`;

        if (activity.type === "custom") {
            if (!activity.customInfo) {
                // Create an input field for custom activities with no additional information
                const inputField = document.createElement("input");
                inputField.type = "text";
                inputField.placeholder = "Add additional information";
                inputField.addEventListener("input", (event) => {
                    activity.customInfo = event.target.value;
                    setActivities(activities); // Save activities to local storage
                });

                listItem.appendChild(inputField);
            } else {
                // Display additional information for custom activities
                activityDetails += ` - Additional Info: ${activity.customInfo}`;
            }
        }

        listItem.textContent = activityDetails;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteActivity(index));

        listItem.appendChild(deleteButton);

        activityList.appendChild(listItem);
    });
}

function deleteActivity(index) {
    activities.splice(index, 1);
    setActivities(activities);
    updateActivityList();
    updateTotalAmount();
}

function updateTotalAmount() {
    const totalAmount = activities.reduce((sum, activity) => {
        return sum + convertToEuros(activity.amount, getExchangeRate());
    }, 0);

    totalAmountSpan.textContent = totalAmount.toFixed(2);
}

function showAmount() {
    const selectedCategory = categorySelect.value;
    const filteredActivities = selectedCategory
        ? activities.filter(activity => activity.type === selectedCategory)
        : activities;

    const totalAmount = filteredActivities.reduce((sum, activity) => {
        return sum + convertToEuros(activity.amount, getExchangeRate());
    }, 0);

    amountSpentDiv.textContent = `Total amount spent in ${selectedCategory || 'all categories'}: ${totalAmount.toFixed(2)} Euros`;
}

exchangeRateInput.addEventListener("input", () => {
    const newRate = parseFloat(exchangeRateInput.value);

    if (!isNaN(newRate)) {
        setExchangeRate(newRate);
        updateTotalAmount();
    } else {
        alert("Please enter a valid exchange rate.");
    }
});
