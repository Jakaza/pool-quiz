const categoryForm = document.getElementById("categoryForm");
const editCategoryForm = document.getElementById("edit-category-form");
const formInputs = categoryForm.querySelectorAll("input");
formInputs.forEach((input) => {
  input.addEventListener("input", () => {
    errorMessage.style.display = "none";
    errorMessage.textContent = "";
  });
});

editCategoryForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const categoryID = editCategoryForm["categoryID"].value;
  const url = `http://localhost:5000/edit-category/${categoryID}`;
  const editTitle = editCategoryForm["editTitle"].value;
  const editDescription = editCategoryForm["editDescription"].value;
  const flexSwitchCheckChecked =
    editCategoryForm["flexSwitchCheckChecked"].value;
  const status =
    validateInput[(editDescription, editTitle, flexSwitchCheckChecked)];
  if (status) {
    await sendHttpRequest(url, {
      title: editTitle,
      description: editDescription,
      isVisible: flexSwitchCheckChecked,
    });
  }
});

async function sendHttpRequest(URL, data) {
  try {
    const res = await fetch(URL, {
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
    categoryForm.reset();
    window.location.href = "/dashboard";
  } catch (error) {
    updateUI(false);
    console.log(error);
  }
}

document
  .getElementById("submitCategoryBtn")
  .addEventListener("click", async function () {
    updateUI();
    const url = "http://localhost:5000/add-category";
    const title = categoryForm["title"].value;
    const description = categoryForm["description"].value;
    const status = validateInput(title, description);
    if (status) {
      const data = {
        title,
        description,
      };
      await sendHttpRequest(url, data);
    }
  });

function validateInput(...inputField) {
  for (let index = 0; index < inputField.length; index++) {
    if (!inputField[index]) {
      errorUL("All fields are required");
      return false;
    }
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
