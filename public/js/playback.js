const PausePlayBtn = document.querySelector('.button-play i')

// code mới được chuyển từ hbs qua
const audioPlayer = document.getElementById('audioPlayer');
const durationContainer = document.getElementById('duration');
const slider = document.getElementById('progress-slider');
const currentTimeContainer = document.getElementById('current-time');
// const progressContainer = document.getElementById('progress-container');

let rAF = null;

async function fetchAudioUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    try {
        //const response = await fetch('/get-audio-url?chapters=' + 
        //                document.getElementById("chapters").value);
        const bookId = urlParams.get('id');
        const chapter = urlParams.get('chapter');
        const response = await fetch(`/get-audio-url?id=${bookId}&chapter=${chapter}`);
        const data = await response.json();
        audioPlayer.src = data.url;
        
    } catch (error) {
        console.error('Error fetching audio URL:', error);
    }
}

fetchAudioUrl();
// alert('Press play button to start');

PausePlayBtn.addEventListener("click", () => {
    //console.log('Button clicked');
    if (audioPlayer.paused) {
        audioPlayer.play();
        //console.log('Playing audio');
    } else {
        audioPlayer.pause();
        cancelAnimationFrame(rAF);
        //console.log('Pausing audio');
    }
    //console.log('Audio paused state:', audioPlayer.paused);
});

audioPlayer.addEventListener("play", () => {
    //console.log('Audio started playing');
    PausePlayBtn.classList.remove("fa-play");
    PausePlayBtn.classList.add("fa-pause");
    requestAnimationFrame(whilePlaying);
});

audioPlayer.addEventListener("pause", () => {
    PausePlayBtn.classList.remove("fa-pause");
    PausePlayBtn.classList.add("fa-play");
    //console.log('Audio paused');
});

slider.addEventListener('input', () => {
    currentTimeContainer.textContent = calculateTime(slider.value);
    if(!audioPlayer.paused) {
        cancelAnimationFrame(rAF);
    }
});

slider.addEventListener('change', () => {
    audioPlayer.currentTime = slider.value;
    if(!audioPlayer.paused) {
        requestAnimationFrame(whilePlaying);
    }
});

const setSliderMax = () => {
    slider.max = Math.floor(audioPlayer.duration);
}

const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
}

const displayDuration = () => {
    durationContainer.textContent = calculateTime(audioPlayer.duration);
}

// const displayBufferedAmount = () => {
//     const bufferedAmount = Math.floor(audioPlayer.buffered.end(audioPlayer.buffered.length - 1));
//     console.log((bufferedAmount / slider.max) * 100);
//     progressContainer.style.setProperty('--buffered-width', `${(bufferedAmount / slider.max) * 100}%`);
// }

const whilePlaying = () => {
    slider.value = Math.floor(audioPlayer.currentTime);
    currentTimeContainer.textContent = calculateTime(slider.value);
    rAF = requestAnimationFrame(whilePlaying);
}

if (audioPlayer.readyState > 0) {
    displayDuration();
    setSliderMax();
    // displayBufferedAmount();
  } else {
    audioPlayer.addEventListener('loadedmetadata', () => {
        displayDuration();
        setSliderMax();
        // displayBufferedAmount();
    });
  }