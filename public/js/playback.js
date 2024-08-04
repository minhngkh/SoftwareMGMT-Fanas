const PausePlayBtn = document.querySelector('.button-play i')

// code mới được chuyển từ hbs qua
const audioPlayer = document.getElementById('audioPlayer');


async function fetchAudioUrl() {
    try {
        //const response = await fetch('/get-audio-url?chapters=' + 
        //                document.getElementById("chapters").value);
        const response = await fetch('/get-audio-url?chapters=0');
        const data = await response.json();
        audioPlayer.src = data.url;
        
    } catch (error) {
        console.error('Error fetching audio URL:', error);
    }
}

fetchAudioUrl();
alert('Press play button to start');

PausePlayBtn.addEventListener("click", () => {
    console.log('Button clicked');
    if (audioPlayer.paused) {
        audioPlayer.play();
        console.log('Playing audio');
    } else {
        audioPlayer.pause();
        console.log('Pausing audio');
    }
    console.log('Audio paused state:', audioPlayer.paused);
});

audioPlayer.addEventListener("play", () => {
    console.log('Audio started playing');
    PausePlayBtn.classList.remove("fa-play");
    PausePlayBtn.classList.add("fa-pause");
});

audioPlayer.addEventListener("pause", () => {
    PausePlayBtn.classList.remove("fa-pause");
    PausePlayBtn.classList.add("fa-play");
    console.log('Audio paused');
});