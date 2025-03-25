document.addEventListener("DOMContentLoaded", () => {
    let audioPlayer = document.getElementById('audio-player');
    let lyricsDisplay = document.getElementById('lyrics');
    let lyricsData = [];

    audioPlayer.volume = 1.0;

    
    fetch("Jisoo earthquake.lrc")
        .then(response => response.text())
        .then(text => {
            parseLRC(text);
        })
        .catch(error => {
            console.error("Error:", error);
            lyricsDisplay.innerHTML = "<p> #2.</p>";
        });

    function parseLRC(text) {
        let lines = text.split('\n');
        lyricsData = [];

        lines.forEach(line => {
            let match = line.match(/\[([0-9]{2}):([0-9]{2})\.(\d{2})\](.*)/);
            if (match) {
                let minutes = parseInt(match[1]);
                let seconds = parseInt(match[2]);
                let milliseconds = parseInt(match[3]);
                let lyric = match[4];

                let timeInSeconds = minutes * 60 + seconds + milliseconds / 1000;
                lyricsData.push({ time: timeInSeconds, text: lyric });
            }
        });
    }

    audioPlayer.addEventListener('timeupdate', displayLyrics);

    function displayLyrics() {
        let currentTime = audioPlayer.currentTime;
        let currentIndex = 0;

        for (let i = 0; i < lyricsData.length; i++) {
            if (currentTime >= lyricsData[i].time) {
                currentIndex = i;
            }
        }

        let linesToShow = [];
        for (let j = 0; j < 4; j++) {
            if (currentIndex + j < lyricsData.length) {
                linesToShow.push(lyricsData[currentIndex + j].text);
            }
        }
        lyricsDisplay.innerHTML = linesToShow.map((line, index) => {
            return `<p class="${index === 0 ? 'active' : 'next'}">${line}</p>`;
        }).join('');
    }
});
