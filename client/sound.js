function playSndBackground() {
    sndBackground = new Audio('./client/snd/bgm.mp3'); 
    sndBackground.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    sndBackground.play();
}
