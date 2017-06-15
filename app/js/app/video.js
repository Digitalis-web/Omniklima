function onYouTubeIframeAPIReady() {
    $(document).ready(on_ready_video);

}
function on_ready_video(){
    var player;
    player = new YT.Player('video', {
        videoId: 'ECnlyAGcLPs', // YouTube Video ID
        //playlist:'z8kBoDdQOgc',
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
            //playlist:'z8kBoDdQOgc'
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
