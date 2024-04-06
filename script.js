let moveSpeed = 3;
let gravity = 0.5;
let bird = document.querySelector(".bird");
let img = document.getElementById("bird-1");

let sound_point = new Audio("music/point.mp3");
let sound_die = new Audio("music/die.mp3");
let sound_play = new Audio("music/backsound.mp3");

let bird_props = bird.getBoundingClientRect();
let background = document.querySelector(".background").getBoundingClientRect();
let score_val = document.querySelector(".score_val");
let message = document.querySelector(".message");
let score_title = document.querySelector(".score_title");
let bestScoreElement = document.querySelector(".best-score_val");

let game_state = "Start";
let difficultyMode = "Normal"; // Variabel untuk melacak mode kesulitan
img.style.display = "none";
message.classList.add("messageStyle");

// reset best score saat load kembail
window.onload = function () {
  localStorage.setItem("bestScore", 0);
};

// mengisi best score
let bestScore = localStorage.getItem("bestScore") || 0;
bestScoreElement.textContent = bestScore;

// menyembunyikan best score di tampilan awal
bestScoreElement.style.display = "none";

document.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && game_state != "Play") {
    document.querySelectorAll(".pipe_sprite").forEach((e) => {
      e.remove();
    });
    img.style.display = "block";
    bird.style.top = "40vh";
    game_state = "Play";
    message.innerHTML = "";
    score_title.innerHTML = "Score : ";
    score_val.innerHTML = "0";
    message.classList.remove("messageStyle");
    // Menampilkan best score saat game dimulai
    bestScoreElement.style.display = "block";
    // Ubah konten bestScoreElement untuk menampilkan skor terbaik 
    bestScoreElement.textContent = "Best Score: " + bestScore;
    play();
  }
});

function play() {
  let isFlying = false;

  function move() {
    if (game_state != "Play") return;
    sound_play.play();
    let pipe_sprite = document.querySelectorAll(".pipe_sprite");
    pipe_sprite.forEach((element) => {
      let pipe_sprite_props = element.getBoundingClientRect();
      bird_props = bird.getBoundingClientRect();

      if (pipe_sprite_props.right <= 0) {
        element.remove();
      } else {
        if (
          bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
          bird_props.left + bird_props.width > pipe_sprite_props.left &&
          bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
          bird_props.top + bird_props.height > pipe_sprite_props.top
        ) {
          game_state = "End";
          message.innerHTML =
            "Game Over".fontcolor("red") + "<br>Press Enter To Restart Game";
          message.classList.add("messageStyle");
          img.style.display = "none";
          // sound play
          sound_die.play();
          return;
        } else {
          if (
            pipe_sprite_props.right < bird_props.left &&
            pipe_sprite_props.right + moveSpeed >= bird_props.left &&
            element.increase_score == "1"
          ) {
            let currentScore = parseInt(score_val.innerHTML);
            score_val.innerHTML = currentScore + 1;
            updateBestScore(currentScore + 1); // Update best score
            // sound play
            sound_point.play();

            // cek score untuk perubahan kesulitan
            if (
              currentScore === 10 ||
              currentScore === 20 ||
              currentScore === 30
            ) {
              if (difficultyMode === "Normal") {
                moveSpeed -= 1; // mengurangi kecepatan saat kesulitan dimulai
                createObstacle(); // membuat rintangan/obstacle
                difficultyMode = "Hard"; // mengubah kesulitan
              } else {
                difficultyMode = "Normal"; // mengubah ke normal
              }
            }
          }
          element.style.left = pipe_sprite_props.left - moveSpeed + "px";
        }
      }
    });
    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);

  let bird_dy = 0;
  function apply_gravity() {
    if (game_state != "Play") return;
    bird_dy = bird_dy + gravity;
    if (isFlying) {
      bird_dy = -7.6;
      isFlying = false;
    }

    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
      game_state = "End";
      message.style.left = "28vw";
      window.location.reload();
      message.classList.remove("messageStyle");
      return;
    }
    bird.style.top = bird_props.top + bird_dy + "px";
    bird_props = bird.getBoundingClientRect();
    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  let pipe_seperation = 0;
  let pipe_gap = 35;

  function create_pipe() {
    if (game_state != "Play") return;

    if (pipe_seperation > 115) {
      pipe_seperation = 0;

      let pipe_posi = Math.floor(Math.random() * 43) + 8;
      let pipe_sprite_inv = document.createElement("div");
      pipe_sprite_inv.className = "pipe_sprite";
      pipe_sprite_inv.style.top = pipe_posi - 70 + "vh";
      pipe_sprite_inv.style.left = "100vw";

      document.body.appendChild(pipe_sprite_inv);
      let pipe_sprite = document.createElement("div");
      pipe_sprite.className = "pipe_sprite";
      pipe_sprite.style.top = pipe_posi + pipe_gap + "vh";
      pipe_sprite.style.left = "100vw";
      pipe_sprite.increase_score = "1";

      document.body.appendChild(pipe_sprite);
    }
    pipe_seperation++;
    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);


  // Function untuk membuat rintangan/obstacle
  function createObstacle() {
    let pipe_posi = Math.floor(Math.random() * 30); // Menyesuaikan posisi vertikal obstacle agar lebih mudah
    let pipe_sprite_inv = document.createElement("div");
    pipe_sprite_inv.className = "pipe_sprite";
    pipe_sprite_inv.style.top = pipe_posi - 60 + "vh"; // Mengatur posisi obstacle lebih tinggi untuk celah yang lebih besar
    pipe_sprite_inv.style.left = "100vw";

    document.body.appendChild(pipe_sprite_inv);
    let pipe_sprite = document.createElement("div");
    pipe_sprite.className = "pipe_sprite";
    pipe_sprite.style.top = pipe_posi + pipe_gap + 80 + "vh"; // Menambah jarak vertikal antara dua obstacle
    pipe_sprite.style.left = "100vw";
    pipe_sprite.increase_score = "1";

    document.body.appendChild(pipe_sprite);
  }

  function updateDifficulty(score) {
    if (score === 25) {
      moveSpeed = 3; // Mengembalikan kecepatan game ke nilai awal
      pipe_gap = 35; // Mengembalikan jarak antar pipa ke nilai awal
    }
  }

  function updateBestScore(score) {
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem("bestScore", bestScore);
      bestScoreElement.textContent = "Best Score: " + bestScore;
      updateDifficulty(score); // Memanggil fungsi untuk memperbarui kesulitan permainan
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.key == "ArrowUp" || e.key == " ") {
      img.src = "assets2/Bird-2.png";
      isFlying = true;
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.key == "ArrowUp" || e.key == " ") {
      img.src = "assets2/Bird.png";
    }
  });
}

// Function to reset game
function resetGame() {
  game_state = "Start";
  img.style.display = "none";
  message.innerHTML =
    "Game Over".fontcolor("red") + "<br>Press Enter To Restart Game";
  message.classList.add("messageStyle");
  // Hide best score element when game is reset
  bestScoreElement.style.display = "none";
  // Reset best score to 0
  bestScore = 0;
  localStorage.setItem("bestScore", bestScore);
  // Update best score element content to display the reset value
  bestScoreElement.textContent = "Best Score: " + bestScore;
  // Reset moveSpeed and difficultyMode to initial values
  moveSpeed = 3;
  difficultyMode = "Normal";
}

// Function to update best score
// function updateBestScore(score) {
//   if (score > bestScore) {
//     bestScore = score;
//     localStorage.setItem("bestScore", bestScore);
//     bestScoreElement.textContent = "Best Score: " + bestScore;
//     updateDifficulty(score); // Memanggil fungsi untuk memperbarui kesulitan permainan
//   }
// }
