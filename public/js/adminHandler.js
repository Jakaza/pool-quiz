const categoryForm = document.getElementById("categoryForm");
const formInputs = categoryForm.querySelectorAll("input");
formInputs.forEach((input) => {
  input.addEventListener("input", () => {
    errorMessage.style.display = "none";
    errorMessage.textContent = "";
  });
});
document
  .getElementById("submitCategoryBtn")
  .addEventListener("click", async function () {
    updateUI();
    const url = "http://localhost:5000/";
    const title = categoryForm["title"].value;
    const description = categoryForm["description"].value;
    const status = validateInput(title, description);
    if (status) {
      const data = {
        title,
        description,
      };

      try {
        const res = await fetch(`${url}add-category`, {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        updateUI(false);
        if (!result.status) {
          errorUL(result.message);
        }
        console.log(result);
      } catch (error) {
        updateUI(false);
        console.log(error);
      }
    }
  });

function validateInput(title, description) {
  if (!title || !description) {
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
  const submitBtn = document.getElementById("submitCategoryBtn");
  if (isLoading) {
    submitBtn.innerHTML =
      'Loading <i class="fa fa-circle-o-notch fa-spin"></i>';
    submitBtn.classList.add("loading");
  } else {
    submitBtn.innerHTML = 'Knew Category Added <i class="fa fa-check"></i>';
    setTimeout(function () {
      submitBtn.innerHTML = "Submit";
      submitBtn.classList.remove("loading");
    }, 2000);
  }
}
