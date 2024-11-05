// Show score tracking container when a course is selected
function showScoreTracker() {
    const selectedCourse = document.getElementById("courseSelect").value;
    const scoreContainer = document.getElementById("scoreContainer");
    const scoreInputs = document.getElementById("scoreInputs");
  
    if (selectedCourse) {
      scoreContainer.style.display = 'block';
      scoreInputs.innerHTML = ''; // Clear any existing inputs
  
      // Assuming 18 holes; create inputs for each hole
      for (let i = 1; i <= 18; i++) {
        const holeDiv = document.createElement("div");
        holeDiv.className = "col-2 mb-2";
        holeDiv.innerHTML = `
          <label>Hole ${i}</label>
          <input type="number" min="1" class="form-control" id="hole${i}" placeholder="Shots">
        `;
        scoreInputs.appendChild(holeDiv);
      }
    } else {
      scoreContainer.style.display = 'none';
    }
  }
  
  // Save score and redirect to round completed page
  function saveScore() {
    const scores = [];
    let totalScore = 0;
  
    for (let i = 1; i <= 18; i++) {
      const shots = parseInt(document.getElementById(`hole${i}`).value) || 0;
      scores.push(shots);
      totalScore += shots;
    }
  
    sessionStorage.setItem("lastRoundScores", JSON.stringify(scores));
    sessionStorage.setItem("lastRoundTotal", totalScore);
  
    window.location.href = "round_completed.html";
  }
  

  let currentHole = 1;
const totalHoles = 18;
let scores = Array(totalHoles).fill(null); // Array to hold scores for each hole

// Update the UI for the current hole
function updateHoleUI() {
  document.getElementById("holeTitle").innerText = `Hole ${currentHole}`;
  document.getElementById("holeScore").value = scores[currentHole - 1] || ''; // Show score if already entered

  // Enable/Disable navigation buttons
  document.getElementById("prevHole").disabled = currentHole === 1;
  document.getElementById("nextHole").innerText = currentHole === totalHoles ? 'Finish Round' : 'Next Hole';
}

// Move to the next hole
function nextHole() {
  // Save the current score
  const scoreInput = document.getElementById("holeScore").value;
  scores[currentHole - 1] = scoreInput ? parseInt(scoreInput) : 0;

  // If this is the last hole, show the final scorecard
  if (currentHole === totalHoles) {
    displayFinalScore();
  } else {
    currentHole++;
    updateHoleUI();
  }
}

// Move to the previous hole
function prevHole() {
  currentHole--;
  updateHoleUI();
}

// Display the final scorecard
function displayFinalScore() {
  let totalScore = 0;
  const scoreList = document.getElementById("scoreList");
  scoreList.innerHTML = ''; // Clear any existing scores

  // Calculate total score and populate score list
  scores.forEach((score, index) => {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between align-items-center";
    listItem.innerHTML = `Hole ${index + 1} <span class="badge badge-primary badge-pill">${score}</span>`;
    scoreList.appendChild(listItem);
    totalScore += score;
  });

  // Display total score
  document.getElementById("totalScore").innerText = totalScore;

  // Show the final scorecard and hide the score input interface
  document.querySelector(".card.shadow.p-4").style.display = 'none';
  document.getElementById("finalScoreCard").style.display = 'block';
}

// Initialize the UI
document.addEventListener("DOMContentLoaded", updateHoleUI);
