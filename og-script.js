"use strict";

document.addEventListener("DOMContentLoaded", function () {
    // Dark Mode Toggle
    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;

    // Toggle Conditionals
    function setTheme(theme) {
        if (theme === "dark") {
            body.classList.add("dark-mode", "bg-dark", "text-light");
            body.classList.remove("bg-light", "text-dark");
            themeToggle.innerHTML = "☀️ Light Mode";
        } else {
            body.classList.remove("dark-mode", "bg-dark", "text-light");
            body.classList.add("bg-light", "text-dark");
            themeToggle.innerHTML = "🌙 Dark Mode";
        }
        localStorage.setItem("theme", theme);
    }
    
 
    // Toggle Event Listener
    themeToggle.addEventListener("click", function () {
        const currentTheme = localStorage.getItem("theme") === "dark" ? "light" : "dark";
        setTheme(currentTheme);
    });

    // Apply Theme on Load
    setTheme(localStorage.getItem("theme") || "light");

    // FORM VALIDATION
    const form = document.querySelector("form");
    const fullName = document.getElementById("fullName");
    const phoneNum = document.getElementById("phoneNum");
    const emailAddress = document.getElementById("emailAddress");
    const details = document.getElementById("details");
    const contactOptions = document.querySelectorAll('input[name="contactPref"]');
    const successMessageContainer = document.getElementById("successMessage");

    // Email Validation (regex)
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Phone Number Validation (regex) (Format: 555-555-5555)
    function validatePhone(phone) {
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        return phoneRegex.test(phone);
    }

    // Show an error message next to the invalid input field
    function showError(input, message) {
        // Remove any existing error messages before adding a new one
        let existingError = input.parentElement.querySelector(".text-danger");
        if (existingError) existingError.remove();

        const error = document.createElement("div");
        error.className = "text-danger mt-1";
        error.innerText = message;
        input.classList.add("is-invalid");
        input.parentElement.appendChild(error);
    }

    // Remove all error messages when revalidating
    function clearErrors() {
        document.querySelectorAll(".is-invalid").forEach((input) => input.classList.remove("is-invalid"));
        document.querySelectorAll(".text-danger").forEach((error) => error.remove());
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        clearErrors();
        successMessageContainer.innerHTML = ""; // Clear any previous success message

        let isValid = true;
        let selectedContact = [...contactOptions].find((option) => option.checked)?.id; // Identify the selected radio button

        // Validate Name (required)
        if (fullName.value.trim() === "") {
            showError(fullName, "Full name is required.");
            isValid = false;
        }

        // Ensure at least one contact method is selected
        if (!selectedContact) {
            showError(contactOptions[0].parentElement, "Please select a preferred contact method.");
            isValid = false;
        }

        // Validate Email (if email is chosen as preferred contact)
        if (selectedContact === "email" && !validateEmail(emailAddress.value)) {
            showError(emailAddress, "Please enter a valid email (e.g., name@example.com).");
            isValid = false;
        }

        // Validate Phone Number (if phone is chosen as preferred contact)
        if (selectedContact === "tel" && !validatePhone(phoneNum.value)) {
            showError(phoneNum, "Phone number must be in the format 555-555-5555.");
            isValid = false;
        }

        // Validate Message (required)
        if (details.value.trim() === "") {
            showError(details, "Please tell us about your move.");
            isValid = false;
        }

        // If form is valid, create customer object and show success message
        if (isValid) {
            const customer = {
                fullName: fullName.value.trim(),
                phoneNum: selectedContact === "tel" ? phoneNum.value.trim() : "N/A",
                emailAddress: selectedContact === "email" ? emailAddress.value.trim() : "N/A",
                preferredContact: selectedContact === "tel" ? "Phone" : "Email",
                details: details.value.trim(),
            };

            form.reset(); // Clear the form fields
            showSuccessMessage(customer);
        }
    });

    // Show a success message when the form is valid and submitted
    function showSuccessMessage(customer) {
        successMessageContainer.innerHTML = `
            <div class="alert alert-success mt-4">
                <h4>Thank you for your submission, ${customer.fullName}!</h4>
                <p>We will contact you via <strong>${customer.preferredContact}</strong>.</p>
                <p><strong>Phone:</strong> ${customer.phoneNum}</p>
                <p><strong>Email:</strong> ${customer.emailAddress}</p>
                <p><strong>Message:</strong> ${customer.details}</p>
            </div>
        `;
    }
});

// Quote Calculator
document.addEventListener("DOMContentLoaded", function () {
    const bedroomSelect = document.getElementById("bedroomSelect");
    const addOns = document.querySelectorAll(".add-on");
    const basePriceEl = document.getElementById("basePrice");
    const addOnsEl = document.getElementById("addOns");
    const taxEl = document.getElementById("tax");
    const totalEl = document.getElementById("total");
    const quoteBtn = document.getElementById("quoteBtn");

    const taxRate = 0.08; // 8% tax

    // Function to update the total price dynamically
    function updateTotal() {
        let basePrice = parseInt(bedroomSelect.value) === 0 ? 500 :
                        parseInt(bedroomSelect.value) === 1 ? 800 :
                        parseInt(bedroomSelect.value) === 2 ? 1200 :
                        parseInt(bedroomSelect.value) === 3 ? 1800 : 2500;

        let addOnsTotal = 0;
        addOns.forEach(addOn => {
            if (addOn.checked) {
                addOnsTotal += parseInt(addOn.value);
            }
        });

        let tax = (basePrice + addOnsTotal) * taxRate;
        let total = basePrice + addOnsTotal + tax;

        basePriceEl.innerText = basePrice.toFixed(2);
        addOnsEl.innerText = addOnsTotal.toFixed(2);
        taxEl.innerText = tax.toFixed(2);
        totalEl.innerText = total.toFixed(2);
    }

    // Event listeners for updating total dynamically
    bedroomSelect.addEventListener("change", updateTotal);
    addOns.forEach(addOn => addOn.addEventListener("change", updateTotal));

    // Quote Button
    quoteBtn.addEventListener("click", function () {
        alert(`Thank you for using our cost estimator! Your estimated moving cost is $${totalEl.innerText}. Contact us for an exact quote!`);
    });

    // Initialize the total on page load
    updateTotal();
});