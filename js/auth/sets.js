import {
  supabase,
  successNotification,
  errorNotification,
  doLogout,
} from "../main";


document.body.addEventListener("click", function (event) {
  if (event.target.id === "btn_logout") { 
      // Disable the button and show loading spinner
      document.querySelector("#btn_logout").disabled = true;
      document.querySelector("#btn_logout").innerHTML = `<div class="spinner-border spinner-border-sm me-2" role="status"></div><span>Loading...</span>`;
      
     
      doLogout().then(() => {
          // Re-enable ang button then change sa text
          document.querySelector("#btn_logout").disabled = false;
          document.querySelector("#btn_logout").innerHTML = "Log-Out";
      }).catch((error) => {
         
          console.error("Logout failed:", error);
          // in case of error
          document.querySelector("#btn_logout").disabled = false;
        
          document.querySelector("#btn_logout").innerHTML = "Log-Out";
      });
  }
});

//start of sets navigation
$(document).ready(function () {
  // Function to get URL parameters
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  // Check if the parameter 'showModal' is set to true in the URL
  if (getUrlParameter("showModal") === "true") {
    // Show the modal when the document is ready and parameter is true
    $("#form_modal").modal("show");
  }
});

//end of sets navigation
const form_search = document.getElementById("form_search");

const itemsImageUrl =
  "https://plsyfklzwmasyypcuwei.supabase.co/storage/v1/object/public/profilePic/";
const userId = localStorage.getItem("user_id");
const form_set_creation = document.getElementById("form_set_creation");
const form_set_making = document.getElementById("form_set_making");
getSet();


// start of search functionality
form_search.onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(form_search);
  getSet(formData.get("keyword"));
  document.getElementById("modal_close_search").click();
  form_search.reset();
};
// End of Search Functionality

async function getSet(keyword = "") {
  try {
    // Ensure Supabase is properly configured and accessible
    let { data: dataset, error } = await supabase
      .from("set")
      .select("*,profiles(*)")
      .or(
        "category.ilike.%" +
          keyword +
          "%, details.ilike.%" +
          keyword +
          "%, title.ilike.%" +
          keyword +
          "%"
      );

    let box = "";

    // Iterate through the dataset
    for (const data of dataset) {
      const username = data.profiles.username;
      const modalId = `id_${data.id}`; // Generate unique modal ID

      // Query set_pages to count the number of pages associated with the current set
      let { data: pageCounter, error: pageError } = await supabase
        .from("set_pages")
        .select("count", { count: "exact" })
        .eq("set_id", data.id); // Filter by the current set's id

      // Extract the count of pages
      const pageCount = pageCounter ? pageCounter[0].count : 0;

      // Construct the card HTML
      box += `<div class=" col-lg-6 col-sm-12 px-2">
      <div class="card  text-dark mb-5" data-bs-toggle="modal"
              data-bs-target="#${modalId}" data-id="${modalId}">
              <div class="card">
              <div class="d-flex justify-content-center" id="imageCont_${data.id}">
              </div>
              <div class="card-img-overlay row">
                <h5 id="set_title" class="card-title text-center">${data.title}</h5>
                <i class="text-center">by: ${username}</i> <br> <i class="card-text text-center mt-4">Pages in Total: ${pageCount}</i>
                <br>
                <h5 class="card-text mt-4 text-center">${data.details}</h5>
                <p class="card-text mt-3 text-center">Created: ${data.created_at}</p>
              </div>
            </div>
  
            <div
            class="modal fade"
            id="${modalId}"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <button
                    id ="close_button"
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="container">
                  <h2 class="text-center">Accept a Questionnaire Set?</h2>
                </div>
                <div class="modal-footer d-flex justify-content-center">
                  <button
                    id="modal_close_search"
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button id="set_accept" type="submit" class="btn"  style="background-color: #1c0522; color: aliceblue">Accept</button>
                </div>
              </div>
            </div>
          </div>
        </div></div>`;
    }

    // Update index with all cards
    document.getElementById("index").innerHTML = box;
    console.log("DOM updated successfully.");
  } catch (error) {
    console.error("Error:", error.message);
  }

  // Moved this part inside try block to ensure proper execution
  try {
    let { data: dataset2, error } = await supabase
      .from("set")
      .select("*,profiles(*)");

    // Inside the second try block
    dataset2.forEach((data) => {
      const imageContainer = document.getElementById(`imageCont_${data.id}`);
      if (imageContainer) {
        let image;
        switch (data.category) {
          case "Math":
            image = `<img src="https://i.ibb.co/QprStd4/Math.jpg" width="100%" height="340vh">`;
            break;
          case "Programming":
            image = `<img src="https://i.ibb.co/fnQtrXz/different-school-subjects-vector-illustrations-set.jpg" width="100%" height="340vh">`;
            break;
          case "Science":
            image = `<img src="https://i.ibb.co/0Qy30rz/Science.jpg" width="100%" height="340vh">`;
            break;
          case "English":
            image = `<img src="https://i.ibb.co/jZFP0B0/English.jpg" width="100%" height="340vh">`;
            break;
          default:
            image = `<img src="https://i.ibb.co/3R6nVY0/Other.jpg" width="100%" height="340vh">`;
            break;
        }
        imageContainer.innerHTML = image;
      } else {
        console.error(`Image container not found for ID: imageCont_${data.id}`);
      }
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

document.body.addEventListener("click", function (event) {
  if (event.target.id === "set_accept") {
    const parentId = parseInt(
      event.target.closest(".card").getAttribute("data-id").split("_")[1],
      10
    );

    if (!isNaN(parentId)) {
      console.log(parentId);
      localStorage.setItem("parentId", parentId);
      window.location.href = "/accept.html";
    } else {
      console.log("parentId could not be converted to an integer.");
    }
  }
});

document.body.addEventListener("click", function (event) {
  if (event.target.id === "closer") {
    window.location.reload();
  }
});

// modal creations set 1st start
let setIdPromise = new Promise((resolve, reject) => {
  form_set_creation.onsubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      const formData = new FormData(form_set_creation); // Get form data
      const title = formData.get("title");
      const category = formData.get("category");
      const details = formData.get("details");

      // Assuming userId is defined elsewhere in your code
      const { data, error } = await supabase
        .from("set")
        .insert([
          {
            title,
            category,
            details,
            user_id: userId,
          },
        ])
        .select();

      if (error) {
        throw error.message; // Throw error message if there's an error
      } else {
        Toastify({
          text: `set ${title} created successfully!`,
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          className: "centered-toast",
          onClick: function(){} // Callback after click
        }).showToast();

        // Get the ID of the newly inserted set
        const setId = data[0].id;

        // Show modal after successful submission
        $("#modal_set_making").modal("show");
        document.getElementById("btn-close").click();

        // Clear the form fields if needed
        form_set_creation.reset();

        resolve(setId); // Resolve the promise with the ID of the newly created set
      }
    } catch (error) {
      console.error("Error:", error);
      /*  window.location.reload(); */
      reject(error); // Reject the promise if an error occurs
    }
  };
});

// Usage example:
setIdPromise
  .then((setId) => {
    console.log("setId outside function:", setId);
  })
  .catch((error) => {
    console.error("Error occurred:", error);
  });

// modal set creation 1st end

const finnishButton = document.getElementById("finnishButton");
const newPage = document.getElementById("newPage");

// Function to handle form submission
const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent the default form submission behavior

  try {
    const setId = await setIdPromise;
    const formData = new FormData(form_set_making);
    const question = formData.get("question");
    const choiceA = formData.get("choiceA");
    const choiceB = formData.get("choiceB");
    const choiceC = formData.get("choiceC");
    const choiceD = formData.get("choiceD");
    const answer = formData.get("answer");

    const { data, error } = await supabase
      .from("set_pages")
      .insert([
        {
          question,
          choiceA,
          choiceB,
          choiceC,
          choiceD,
          answer,
          set_id: setId,
        },
      ])
      .select();

    if (error) {
      throw error.message;
    }
    form_set_making.reset();
    // Wait until the Finnish button is clicked
    while (!finnishButton.clicked) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    errorNotification("Something wrong happened. Cannot add Question.", 15);
    console.error(error);
  }
  /* document.getElementById("btn_close2").click();
  window.location.reload(); */
};
user();
async function user() {
  let { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId);
  /*  alert("Start Scrolling"); */
  let container = "";
  profiles.forEach((user_info) => {
    container += `<h4 class="mt-2" data-id="${user_info.username}">Good Day! ${user_info.username}</h4>`;
  });

  // Assuming you have a container in your HTML with an id, for example, "userContainer"
  document.getElementById("userContainer").innerHTML = container;
}

// Event listener for form submission
form_set_making.onsubmit = handleSubmit;

// Event listener for the NewPage button to reload the form
newPage.addEventListener("click", () => {
  $("#form_celebration").modal("show");
  document.getElementById("btn_close2").click();
});



document.getElementById("finnishButton").addEventListener("click", function () {
  // Get the current value of the counter
  let counter = document.getElementById("counter");
  let currentValue = parseInt(counter.textContent);

  // Increment the counter
  currentValue++;

  // Update the counter text
  counter.textContent = currentValue;
});
function hideSpinner() {
  var container = document.getElementById("spin");
  container.style.display = "none";
}

window.addEventListener("load", function () {
  // Simulating dynamic content loading completion
  // You should replace this with your actual code where dynamic content is loaded
  setTimeout(function () {
    // Call hideSpinner when dynamic content is loaded
    hideSpinner();
  }, 2000); // Adjust the time delay as needed
});
