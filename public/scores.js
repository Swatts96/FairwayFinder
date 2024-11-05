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
  