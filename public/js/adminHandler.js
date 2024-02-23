const categoryForm = document.getElementById("categoryForm");
const editCategoryForm = document.getElementById("edit-category-form");

const errorMessage = document.getElementById("errorMessage");

const formInputs = categoryForm.querySelectorAll("input");
formInputs.forEach((input) => {
  input.addEventListener("input", () => {
    hideErrorMessage();
  });
});

editCategoryForm.addEventListener("submit", handleEditCategory);

document
  .getElementById("submitCategoryBtn")
  .addEventListener("click", handleAddCategory);

async function handleEditCategory(e) {
  e.preventDefault();
  const { categoryID, editTitle, editDescription, flexSwitchCheckChecked } =
    editCategoryForm.elements;
  const url = `http://localhost:5000/edit-category/${categoryID.value}`;
  const status = validateInput(
    editTitle.value,
    editDescription.value,
    flexSwitchCheckChecked.value
  );
  if (status) {
    await sendHttpRequest(url, {
      title: editTitle.value,
      description: editDescription.value,
      isVisible: flexSwitchCheckChecked.value,
    });
  }
}

async function handleAddCategory() {
  updateUI();
  const url = "http://localhost:5000/add-category";
  const { title, description } = categoryForm.elements;
  const status = validateInput(title.value, description.value);
  if (status) {
    const data = { title: title.value, description: description.value };
    await sendHttpRequest(url, data);
  }
}

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
      displayErrorMessage(result.message);
    }
    categoryForm.reset();
    window.location.href = "/dashboard";
  } catch (error) {
    updateUI(false);
    console.log(error);
  }
}

function validateInput(...inputFields) {
  for (const field of inputFields) {
    if (!field) {
      displayErrorMessage("All fields are required");
      return false;
    }
  }
  return true;
}

function displayErrorMessage(message) {
  errorMessage.style.display = "block";
  errorMessage.textContent = message;
}

function hideErrorMessage() {
  errorMessage.style.display = "none";
}

function updateUI(isLoading = true) {
  const submitBtn = document.getElementById("submitCategoryBtn");
  if (isLoading) {
    submitBtn.innerHTML =
      'Loading <i class="fa fa-circle-o-notch fa-spin"></i>';
    submitBtn.classList.add("loading");
  } else {
    submitBtn.innerHTML = 'New Category Added <i class="fa fa-check"></i>';
    setTimeout(() => {
      submitBtn.innerHTML = "Submit";
      submitBtn.classList.remove("loading");
    }, 2000);
  }
}
