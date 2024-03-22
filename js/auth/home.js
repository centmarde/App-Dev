import {
  doLogout,
  supabase,
  successNotification,
  errorNotification,
} from "../main";

const itemsImageUrl =
  "https://plsyfklzwmasyypcuwei.supabase.co/storage/v1/object/public/profilePic/";
// Assign Logout Functionality

const userId = localStorage.getItem("user_id");
const form_item = document.getElementById("form_item");
const btn_logout = document.getElementById("btn_logout");
const form_search = document.getElementById('form_search');
btn_logout.onclick = doLogout;
document.querySelector("#btn_logout button").disabled = true;
document.querySelector(
    "#btn_logout button" //logout button script
).innerHTML = `<span>Loading...</span>`;


btn_logout.onclick = doLogout;

//function initialize for navbar dynamic name
getDatas();
getQuestions();


//navbar dynamic name
async function getDatas() {

  
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
let for_update_id = "";
//setquestions

async function getterAllquestions() {
  let { data: questions, error } = await supabase
    .from("questions")
    .select("count", { count: 'exact' })
 /*    .eq("user_id", userId); */
  
 const count = questions[0].count;

  let container = "";
  questions.forEach((data_s) => {
    container += `<p class="mt-2" data-id="${data_s.id}"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-question-diamond me-2" viewBox="0 0 16 16">
    <path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.48 1.48 0 0 1 0-2.098zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"/>
    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
  </svg>Total Questions: ${count}</p>`;
  });
  
  // Assuming you have a container in your HTML with an id, for example, "userContainer"
  document.getElementById("topContainer").innerHTML = container;
 return count;
}
getterAllquestions();

async function getterUserQuestions() {
  let { data: questions, error } = await supabase
    .from("questions")
    .select("count", { count: 'exact' })
    .eq("user_id", userId); 
  
 const count = questions[0].count;

  let container = "";
  questions.forEach((data_s) => {
    container += `<p class="mt-2" data-id="${data_s.id}"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-question-diamond-fill me-2" viewBox="0 0 16 16">
    <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/>
  </svg>Your Questions: ${count}</p>`;
  });
  
  // Assuming you have a container in your HTML with an id, for example, "userContainer"
  document.getElementById("topContainer2").innerHTML = container;
 return count;
}
getterUserQuestions();

async function updateProgressBar() {
  const { data: questions, error } = await supabase
    .from("questions")
    .select("count", { count: "exact" });

  if (error) {
    console.error("Error fetching questions:", error.message);
    return;
  }

  const totalCount = questions[0].count;

  const userQuestions = await supabase
    .from("questions")
    .select("count", { count: "exact" })
    .eq("user_id", userId);

  if (userQuestions.error) {
    console.error("Error fetching user questions:", userQuestions.error.message);
    return;
  }

  const userQuestionCount = userQuestions.data[0].count;

  const percentage = (userQuestionCount / totalCount) * 100;
  const progressBar = document.querySelector(".progress-bar");

  
  progressBar.style.width = percentage + "%";
  progressBar.style.backgroundColor = "#2b1055";
  progressBar.textContent = percentage.toFixed(2) + "%"; // Set the progress text
}

updateProgressBar()
  .then(() => {
    console.log("Progress bar updated successfully.");
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });



form_search.onsubmit = async (e) => {
  e.preventDefault();
  
  const formData = new FormData(form_search);
  getQuestions(formData.get("keyword"))
  document.getElementById("modal_close_search").click();
  form_search.reset();
}

form_item.onsubmit = async (e) => {
  e.preventDefault();
  // Disable Button
  document.querySelector("#form_item button[type='submit']").disabled = true;
  document.querySelector("#form_item button[type='submit']").innerHTML = `
                  <span>Loading...</span>`;

  const formData = new FormData(form_item);

  // Supabase Image Upload

  /* update */
  if (for_update_id == "") {
    const { data: questions, error } = await supabase
      .from("questions")
      .insert([
        {
          tittle: formData.get("tittle"),
          question_text: formData.get("question"),
          answer_text: formData.get("answer"),
        },
      ])
      .select();
     
    if (error) {
      errorNotification("Something wrong happened. Cannot add question.", 15);
      console.log(error);
    } else {
      successNotification("question Successfully Added!", 15);
      // Reload Datas
      getDatas();
          window.location.pathname = "/home.html";

    }
  }

  // for update
  else {
    errorNotification("Something wrong happened. Cannot add item.", 15);
    console.log(error);
  }
  // Modal Close
  document.getElementById("modal_close").click();

  // Reset Form
  form_item.reset();

  // Enable Submit Button
  document.querySelector("#form_item button[type='submit']").disabled = false;
  document.querySelector(
    "#form_item button[type='submit']"
  ).innerHTML = `Submit`;
};



//get questions
async function getQuestions(keyword = "") {
  let { data: questions, error } = await supabase
    .from("questions")
    .select("*,profiles(*)")
    .or(
      "question_text.ilike.%" + keyword + "%",
      "tittle.ilike.%" + keyword + "%",
      /* "username.ilike.%" + keyword + "%" */
  );
 
    questions.sort(() => Math.random() - 0.5);
    //CHILLI SPICY COM-SCI LORDS BABY!
  
  let questionContainer = "";
  console.log(questionContainer);

  questions.forEach((data, index) => {
    
    const imagepath = data.profiles.image_path;
    const username = data.profiles.username;
    const likes = data.profiles.likes;

    questionContainer += `<div class="col d-flex justify-content-center mb-3">
    <div class="card justify-content-center hiddenAnimate2" style="width: 20rem">
      <div class="card" style="width: 20rem; background-color:#e3deeb;">
        <div class="card-body">
          <div class="row">
            <div class="col-4">
              <img
                src="${itemsImageUrl + imagepath}"
                class="block my-2 border border-dark border-2 rounded-circle"
                width="80px"
                height="80px"
              />
            </div>
            <div class="col-8">
              <div>
                <p>
                <svg xmlns="http://www.w3.org/2000/svg" width="18"  height="18" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                <path  d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                </svg>

                <b class ="me-1">IGN:</b> ${username}</p>

                <p>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                </svg>
            
                <b class ="me-1">Likes:</b> ${likes}</p>
              </div>
            </div>
          </div>
          <h2 class="card-title text-center">${data.tittle}</h2>
          <p class="card-text text-center">
          ${data.question_text}
          </p>
          <div id="textContainer${index}" class="d-grid gap-2 d-none">
              <i>${data.answer_text}</i>
          </div>
          <div class="d-grid gap-2 mt-2" >
          <button type="button" id="showButton${index}" class="btn btn-dark"  style=" background-color:#2b1055;">Show Answer</button>
          </div>
          
              <div class="row" >
                <div class="col mt-3"><h5 >Show Profile...</h5>
              </div>
              
                <div class="col mt-3 d-flex justify-content-end">
                <div class="d-flex me-3" data-bs-toggle="modal"
                data-bs-target="#modal_heart">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                </svg>
                <p class="ms-2">${data.heart}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-chat-dots" viewBox="0 0 16 16">
                <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2"/>
                </svg>
                
                </div>
              </div>
          
        </div>
      </div>
    </div>
  </div>
  <!-- modal for hearts -->
    
  <div class="modal fade" id="modal_heart" tabindex="-1">
   <div class="modal-dialog modal-dialog-centered">
     <div class="modal-content">
       <div class="modal-header">
         <h5 class="modal-title text-center">Like this Question?</h5>
         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
       </div>
       <div class="modal-body">
         <p>Submiting a heart helps 🥰🥰🥰🥰
         </p>
       </div>
       <div class="modal-footer">
         <button type="button" id="modal_close_heart" class="btn" data-bs-dismiss="modal" style="background-color: #e00909; color: white;">No</button>
         <button type="submit" data-id ="${data.id}" id="btn_heart" class="btn" style="background-color: #2b1055; color: white;" >Submit 1Heart</button>
       </div>
     </div>
   </div>
 </div>

  <!-- end modal for hearts -->
  
  
  `;

});



document.getElementById("indexContainer").innerHTML = questionContainer;

for (let i = 0; i < questions.length; i++) {
    var showButton = document.getElementById(`showButton${i}`);
    showButton.onclick = function () {
        var textContainer = document.getElementById(`textContainer${i}`);
        textContainer.classList.remove("d-none");
    };
}}

form_modal.onsubmit = async (e) => {
  e.preventDefault();
  document.querySelector("#form_modal button").disabled = true;
  document.querySelector(
    "#form_modal button" //logout button script
  ).innerHTML = `<span>Loading...</span>`;

  // Modal Close
  document.getElementById("modal_close").click();

  // Reset Form
  form_item.reset();

  // Enable Submit Button
  document.querySelector("#form_item button[type='submit']").disabled = false;
  document.querySelector(
    "#form_modal button[type='submit']"
  ).innerHTML = `Submit`;
};

// start of animations
document.addEventListener("DOMContentLoaded", function() {
  // Function to check if an element is in the viewport
  function isInViewport(element) {
    var rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Function to add show class to elements in viewport
  function showInView() {
    var elements = document.querySelectorAll('.hiddenAnimate2');
    elements.forEach(function(element) {
      if (isInViewport(element)) {
        element.classList.add('show2');
      }
    });
  }

  // Initial check when the page loads
  showInView();

  // Check again on scroll
  window.addEventListener('scroll', showInView);
});
function showHiddenElements() {
  // Get all elements with the class hiddenAnimate3
  const hiddenElements = document.querySelectorAll('.hiddenAnimate3');
  
  // Loop through each hidden element
  hiddenElements.forEach(element => {
    // Add the show class after a delay of 1000 milliseconds (1 second)
    setTimeout(() => {
      element.classList.add('show2');
    }, 1000);
  });
}

document.addEventListener('DOMContentLoaded', showHiddenElements);

// end of animations

document.body.addEventListener("click", function (event) {
  if (event.target.id === "btn_heart") {
    submit_heart(event);
  }
});

const submit_heart = async (e) => {
  const consid = e.target.getAttribute("data-id");
  console.log("Data ID:", consid);
  console.log("Event target:", e.target);
  console.log("Event object:", e);

  // Supabase show by id
  const { data: questions, error } = await supabase
    .from('questions')
    .select('heart')
    .eq('id', consid)
    .single(); // Ensure only one record is returned

  if (error) {
    errorNotification("Something wrong happened. Cannot add heart.", 15);
    console.log(error);
    return;
  }

  // Check if question is null
  if (!questions) {
    errorNotification("Question not found.", 15);
    return;
  }

  const updatedHeartsCount = questions.heart + 1;
  const { updateError } = await supabase
    .from('questions')
    .update({ heart: updatedHeartsCount })
    .eq('id',consid);

  if (updateError) {
    errorNotification("Error updating heart count.", 15);
    console.log(updateError);
    return;
  }

  successNotification("Heart Successfully Added!", 15);
  document.getElementById("modal_close_heart").click();
  window.location.reload();
};

window.onload = function() {
  setTimeout(function() {
    window.scrollTo(0, 2);
  },1500); 
}

// rankbar
async function updateRankBar() {
  try {
    // Fetching the percentage column from the rank table
    const { data: rankData, error: rankError } = await supabase
      .from("rank")
      .select("percentage");

    if (rankError) {
      throw new Error("Error fetching rank data: " + rankError.message);
    }

    // Extracting percentage value from the fetched data
    const percentage = rankData[0].percentage;

    // Updating the progress bar
    const progressBar = document.querySelector(".progress-bar2");
    progressBar.style.width = percentage + "%";
    progressBar.style.backgroundColor = "#2b1055";
    progressBar.style.color = "white";
    progressBar.textContent = percentage.toFixed(2) + "%";
    progressBar.style.textAlign = "center";
   


     // Set the progress text

    // Check if the percentage is 100% or more
    if (percentage >= 100) {
      // Define the ranks progression
      const rankProgression = {
        "newbie": "junior",
        "junior": "Senior",
        "Senior": "juniorOfficer",
        "juniorOfficer": "SeniorOfficer",
        "SeniorOfficer": "Officer",
        "Officer": "Master"
      };
      
      // Get the current rank from the database or wherever appropriate
      const currentRank = await getCurrentRank(); // Implement this function according to your database or application logic
      
      // Determine the next rank based on the current rank
      const nextRank = rankProgression[currentRank];

      // Update the rank in the database or wherever appropriate
      await updateRank(nextRank);

      // Notify the user about the rank-up
      console.log(`Congratulations! You've ranked up to ${nextRank}.`);
    }

  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Call the function
updateRankBar();


// Call the function
updateRankBar();

// updating rank
async function updateRank(rank_name) {
  try {
    // Get the current user's ID or any identifier
    const userId = getCurrentUserId(); // Implement this function according to your authentication system

    // Update the rank for the user in the database
    const { data, error } = await supabase
      .from("rank")
      .update({ rank: rank_name })
      .eq("user_id", userId);

    if (error) {
      throw new Error("Error updating rank: " + error.message);
    }

    console.log("Rank updated successfully!");

  } catch (error) {
    console.error("Error:", error.message);
  }
}
// end of rank

//logout button loading
document.querySelector("#btn_logout button[type='button']").disabled = false;
document.querySelector(
    "#btn_logout button[type='button']"
).innerHTML = `Log-Out`;


