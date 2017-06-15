function onYouTubeIframeAPIReady() {
    $(document).ready(on_ready_video);
}
var player, iframe;
var $ = document.querySelector.bind(document);

function on_ready_video(){
    var player;
    player = new YT.Player('ytvideo', {
        videoId: 'ECnlyAGcLPs', // YouTube Video ID
        playerVars: {
            autoplay: 1,        // Auto-play the video on load
            controls: 0,        // Show pause/play buttons in player
            showinfo: 0,        // Hide the video title
            modestbranding: 1,  // Hide the Youtube Logo
            loop: 1,            // Run the video in a loop
            fs: 0,              // Hide the full screen button
            cc_load_policy: 0,  // Hide closed captions
            iv_load_policy: 3,  // Hide the Video Annotations
            autohide: 1         // Hide video controls when playing
        },
        events: {
            onReady: function(e) {
                e.target.mute();
            },
            onStateChange: function(e){
                if (e.data === YT.PlayerState.ENDED) {
                    player.playVideo();
                }
            }
        }

    });
}

// when ready, wait for clicks
function onPlayerReady(event) {
    var player = event.target;
    iframe = $('#ytvideo');
    setupListener();
}

function setupListener (){
    $('button').addEventListener('click', playFullscreen);
}

function playFullscreen (){
    player.playVideo();//won't work on mobile

    var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
    if (requestFullScreen) {
        requestFullScreen.bind(iframe)();
    }
}
