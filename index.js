const timer = document.querySelector("#timer");
const modeButtons = document.querySelectorAll(".modeBtn");
const message = document.querySelector("#message");
const timerCard = document.querySelector("#timerCard");

const modes = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15
};
const colors = {
    pomodoro:"#BA4949",
    shortBreak:"#297479",
    longBreak:"#2F6A95"
};


let currentMode = "pomodoro";
let pomodoroCount = 0;

let totalSeconds = modes[currentMode] * 60;



let timerInterval;
let isRunning = false;

let messageTimeout;

const startButton = document.querySelector("#startButton");
const nextButton = document.querySelector("#nextButton");

const alarm = new Audio ("Sounds/alarm.mp3");
const startSound = new Audio ("Sounds/startSound.mp3");
const pauseSound = new Audio ("Sounds/pauseSound.mp3");


startSound.volume = 0.3;
pauseSound.volume = 0.3;

startButton.addEventListener("click",function () {

    if(isRunning){
         pauseSound.currentTime = 0;
         pauseSound.play();
        pauseTimer();

    }else{

        startTimer();

    }
       
});

nextButton.addEventListener("click",function () {
    pauseTimer();
    nextMode();
    clearMessage();
});


function formatTime() {
    let minutes =  Math.floor(totalSeconds / 60);
    minutes = String(minutes).padStart(2, "0");

    let seconds = totalSeconds % 60;    
    seconds = String(seconds).padStart(2, "0");

    const time = `${minutes}:${seconds}`;
    return time;
}


function switchMode(mode) {
    currentMode = mode;

    totalSeconds = modes[currentMode] * 60;

    document.body.style.backgroundColor = colors[currentMode];

    startButton.style.color = colors[currentMode];

    updateActiveButton();

    timer.textContent = formatTime();

}

function nextMode() {
    if ( currentMode === "pomodoro") {
        switchMode("shortBreak");
    }else if( currentMode === "shortBreak"){
        switchMode("longBreak");
    }else{
        switchMode("pomodoro"); 
    };
}

function showMessage(text){
    
    clearTimeout(messageTimeout);

    message.textContent = text;
    message.style.opacity = "1";


    messageTimeout = setTimeout(function(){

        message.style.opacity = "0";
        message.textContent = "";

    },2500);


}

function clearMessage(){

    message.textContent="";
    message.style.opacity="0";

}

function timerFinished() {
  if(currentMode === "pomodoro"){

        pomodoroCount++;

        if(pomodoroCount % 4 === 0){

            showMessage("You need a long break!");

            switchMode("longBreak");

        }else{

            showMessage("Take a short break!");

            switchMode("shortBreak");

        }

    }else{

        showMessage("Back to work!");

        switchMode("pomodoro");

    }
}

function startTimer() {

      if(timerInterval){
        return;
    }

    isRunning = true;

    startSound.currentTime = 0;
    startSound.play();

    nextButton.style.display = "flex";
    startButton.textContent = "PAUSE";
    
    timerInterval = setInterval(function () {

         if (totalSeconds <= 0) {
                pauseTimer();
                alarm.currentTime = 0;
                alarm.play();
                timerCard.classList.add("finished");
                setTimeout(function(){
                    timerCard.classList.remove("finished");
                },500);
                timerFinished();

            } else {
                totalSeconds --;
                timer.textContent= formatTime(); 
            }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
     
    timerInterval = undefined;

    isRunning = false;

    startButton.textContent = "START";
    nextButton.style.display = "none";
}

modeButtons.forEach(function (button) {

    button.addEventListener("click", function () {
        pauseTimer();

        switchMode(button.dataset.mode);

        clearMessage();

    });

});

function updateActiveButton() {
    modeButtons.forEach(function(button){

        button.classList.remove("active");

        if(button.dataset.mode === currentMode){

            button.classList.add("active");

        }
    });
}

timer.textContent = formatTime();