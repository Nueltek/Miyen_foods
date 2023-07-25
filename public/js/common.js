const loader = document.querySelector(".loader");
const err = document.getElementById("err");

// Display error message in the form
export const showError = ( errorMessage) => {
  err.innerText = errorMessage
  return
};

const processData = (dataFromForm) => {
  console.log(dataFromForm);

  if (dataFromForm.alert) {
   showError(dataFromForm.alert) 
    console.log(dataFromForm.alert);
  } else if (dataFromForm.name) {
    sessionStorage.user = JSON.stringify(dataFromForm);
    location.replace("/");
  }

  loader.style.display = "none";
};

const sendAuthData = async (path, data) => {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not OK");
    }

    const responseData = await response.json();
    processData(responseData);
  } catch (error) {
    console.error("Error:", error);
    // Handle the error, show a generic error message, or take necessary actions
    loader.style.display = "none";
  }
};

export { sendAuthData };
