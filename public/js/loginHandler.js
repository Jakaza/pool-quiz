const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
const formInputs = loginForm.querySelectorAll("input");
formInputs.forEach((input) => {
  input.addEventListener("input", () => {
    errorMessage.style.display = "none";
    errorMessage.textContent = "";
  });
});
loginForm.addEventListener("submit", async (e) => {
  updateUI();
  e.preventDefault();
  const username = loginForm["username"].value;
  const password = loginForm["password"].value;
  const status = validateInput(username, password);
  if (status) {
    await loginUser(username, password);
  }
});
async function loginUser(username, password) {
  const url = "http://localhost:5000/login";
  const data = {
    username,
    password,
  };
  try {
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
    console.log(result);
    if (result.status === true) {
      window.location.href = "/";
      const loggedInUsername = getUsernameFromToken();
    } else {
      updateUI(false);
      errorUL(result.message);
    }
  } catch (error) {
    updateUI(false);
    console.error(error);
  }
}
function getTokenFromCookie() {
  const cookieString = document.cookie;
  const cookies = cookieString.split("; ");
  const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
}
function getUsernameFromToken() {
  const token = getTokenFromCookie();
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.username;
  }
  return null;
}

function validateInput(username, password) {
  if (!username || !password) {
    errorUL("All fields are required");
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
