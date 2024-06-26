import {
  supabase,
  successNotification,
  errorNotification,
  doLogout,
} from "../main";
const parentIdFromStorage = localStorage.getItem("parentId");
/* bridege function to sets IMPORTANT */
getSet();
getPages();
function getSet() {
  if (parentIdFromStorage) {
    console.log(parentIdFromStorage);
  } else {
    console.log("parentId not found in localStorage");
  }
}
/*END of bridege function to sets IMPORTANT */

let currentIndex = 0;
let userSelections = []; // Array to store user selections

async function getPages() {
  try {
    const { data: dataset, error } = await supabase
      .from("set_pages")
      .select("*")
      .eq("set_id", parentIdFromStorage);

    if (error) {
      throw error;
    }

    if (dataset.length === 0) {
      document.getElementById("problem_body").innerHTML =
        "<p>No data available.</p>";
      return;
    }

    const currentData = dataset[currentIndex];

    document.getElementById(
      "problem_body"
    ).innerHTML = `<p data-id="${currentData.id}">${currentData.question}</p>`;
    document.getElementById("choiceA").innerHTML = currentData.choiceA;
    if (currentData.choiceB) {
      document.getElementById("choiceB").innerHTML = currentData.choiceB;
    }
    if (currentData.choiceC) {
      document.getElementById("choiceC").innerHTML = currentData.choiceC;
    }
    if (currentData.choiceD) {
      document.getElementById("choiceD").innerHTML = currentData.choiceD;
    }

    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => {
      radio.addEventListener("change", function () {
        const checkedRadio = document.querySelector(
          'input[type="radio"]:checked'
        );
        if (checkedRadio) {
          document.getElementById("final").disabled = false;
          const questionId = currentData.id;
          const selectedChoice = checkedRadio.value;
          userSelections[currentIndex] = { questionId, selectedChoice }; // Store user selection
        }
      });
    });

    document.body.addEventListener("click", function (event) {
      if (event.target.id === "final") {
        lockInAnswer(dataset);
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

function lockInAnswer(dataset) {
  const selectedChoice = document.querySelector('input[type="radio"]:checked');
  if (!selectedChoice) {
    Toastify({
      text: "please select a choice before proceeding.",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      className: "centered-toast",
      onClick: function(){} // Callback after click
    }).showToast();
    return;
  }

  const confirmation = confirm("Are you sure?");
  if (confirmation) {
    if (currentIndex < dataset.length - 1) {
      currentIndex++;
      const nextData = dataset[currentIndex];

      // Clear radio button selections
      const radios = document.querySelectorAll('input[type="radio"]');
      radios.forEach(radio => {
        radio.checked = false;
      });

      // Update card content
      document.getElementById(
        "problem_body"
      ).innerHTML = `<p data-id="${nextData.id}">${nextData.question}</p>`;
      document.getElementById("choiceA").innerHTML = nextData.choiceA;
      if (nextData.choiceB) {
        document.getElementById("choiceB").innerHTML = nextData.choiceB;
      } else {
        document.getElementById("choiceB").innerHTML = "";
      }
      if (nextData.choiceC) {
        document.getElementById("choiceC").innerHTML = nextData.choiceC;
      } else {
        document.getElementById("choiceC").innerHTML = "";
      }
      if (nextData.choiceD) {
        document.getElementById("choiceD").innerHTML = nextData.choiceD;
      } else {
        document.getElementById("choiceD").innerHTML = "";
      }
    } else {
      Toastify({
        text: "end of dataset reached",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        className: "centered-toast",
        onClick: function(){} // Callback after click
      }).showToast();
      localStorage.setItem('userSelections', JSON.stringify(userSelections)); // Convert to JSON string before storing
      $("#form_celebration").modal("show");
      // Optionally, reset currentIndex or handle the end of the dataset
    }
  } else {
    Toastify({
      text: "Question not locked in",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      className: "centered-toast",
      onClick: function(){} // Callback after click
    }).showToast();
    
  }

  console.log(userSelections);
}

document.body.addEventListener("click", function (event) {
  if (event.target.id === "showBtn") {
    window.location.href = '/answer.html';
  }
});
document.body.addEventListener("click", function (event) {
  if (event.target.id === "exitBtn") {
    window.location.href = '/home.html';
  }
});

