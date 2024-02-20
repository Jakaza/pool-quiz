const registerForm = document.getElementById("registerForm");
const errorMessage = document.getElementById("errorMessage");
const formInputs = registerForm.querySelectorAll("input");
formInputs.forEach((input) => {
  input.addEventListener("input", () => {
    errorMessage.style.display = "none";
    errorMessage.textContent = "";
  });
});
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  updateUI();
  const terms = registerForm["terms"].checked;
  if (!terms) {
    errorUL("Must accept terms and conditions");
    return;
  }
  const username = registerForm["username"].value;
  const password = registerForm["password"].value;
  const rePassword = registerForm["rePassword"].value;
  const email = registerForm["email"].value;
  try {
    const isValid = validateInput(username, email, password, rePassword);
    if (!isValid) {
      console.error("Enter correct details");
      return;
    }
    const url = "http://localhost:5000/register";
    const data = {
      username,
      email,
      password,
    };
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    updateUI(false);
    if (result.status === true) {
      window.location.href = `/login?user=${result.user.username}`;
    } else {
      errorUL(result.message);
    }
  } catch (error) {
    updateUI(false);
    errorUL(error.message);
  }
});
function validateInput(username, email, password, rePassword) {
  if (!username || !email || !password || !rePassword) {
    errorUL("All fields are required");
    return false;
  }
  if (username.length < 3 || username.length > 30) {
    errorUL("Username must be between 3 and 30 characters");
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorUL("Invalid email address");
    return false;
  }
  if (password.length < 5 || password.length > 30) {
    errorUL("Password must be between 5 and 30 characters");
    return false;
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    errorUL(
      "Password must contain at least one uppercase letter, one lowercase letter, and one digit"
    );
    return false;
  }
  if (password !== rePassword) {
    errorUL("Passwords do not match");
    return false;
  }
  return true;
}
function errorUL(message) {
  updateUI(false);
  errorMessage.style.display = "block";
  errorMessage.textContent = message;
}
function updateUI(isLoading = true) {
  const submitBtn = document.getElementById("submitBtn");
  if (isLoading) {
    submitBtn.innerHTML =
      'Loading <i class="fa fa-circle-o-notch fa-spin"></i>';
    submitBtn.classList.add("loading");
  } else {
    submitBtn.innerHTML = 'Submitted <i class="fa fa-check"></i>';
    setTimeout(function () {
      submitBtn.innerHTML = "Submit";
      submitBtn.classList.remove("loading");
    }, 1000);
  }
}
