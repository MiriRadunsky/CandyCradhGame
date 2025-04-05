
document.addEventListener('DOMContentLoaded', () => {
    const playAgainButton = document.getElementById('play-again');
    const exitButton = document.getElementById('exit');
    const backgroundMusic = document.getElementById('background-music');


    let musicPlayed = false;


    const playMusic = () => {
        if (!musicPlayed) {
            backgroundMusic.play().catch(error => {
                console.error('Failed to play audio:', error);
            });
            musicPlayed = true;
        }
    };

    playAgainButton.addEventListener('click', () => {
        playMusic();
        window.location.href = '../html/game.html';
    });


    exitButton.addEventListener('click', () => {
        playMusic();
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        window.location.href = '../../login.html'
    });


    document.body.addEventListener('click', playMusic);
});
