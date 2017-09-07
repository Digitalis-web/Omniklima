function onYouTubeIframeAPIReady() {
    $(document).ready(on_ready_video);
}

var player, iframe;

function on_ready_video(){
    player = new YT.Player('video', {
        videoId: 'ECnlyAGcLPs', // YouTube Video ID
        playerVars: {
            autoplay: 1,        // Auto-play the video on load
            controls: 1,        // Show pause/play buttons in player
            showinfo: 0,        // Hide the video title
            modestbranding: 0,  // Hide the Youtube Logo
            loop: 1,            // Run the video in a loop
            fs: 1,              // Hide the full screen button
            cc_load_policy: 1,  // Hide closed captions
            iv_load_policy: 3,  // Hide the Video Annotations
            autohide: 1,         // Hide video controls when playing
            rel: 0
        },
        events: {
            onReady: function(e) {
                onPlayerReady(e);
            },
            onStateChange: function(e){
                if (e.data === YT.PlayerState.ENDED) {
                    player.playVideo();
                }
            }
        }
    });
}

function onPlayerReady(event) {
    var player = event.target;
    iframe = $('#video');
    setupListener();
}

function setupListener (){
    $('.video_text_container').on('click', fullscreen);
}

function fullscreen() {
    var e = document.getElementById("video");
    if (e.requestFullscreen) {
        e.requestFullscreen();
    } else if (e.webkitRequestFullscreen) {
        e.webkitRequestFullscreen();
    } else if (e.mozRequestFullScreen) {
        e.mozRequestFullScreen();
    } else if (e.msRequestFullscreen) {
        e.msRequestFullscreen();
    }
}