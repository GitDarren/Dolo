alert("Dom.js was reached");
function startup(){
    navigator.mediaDevices.getUserMedia()({ video: true }, function (stream) {
        var video = document.getElementById("v");
        var canvas = document.getElementById("c");
        var button = document.getElementById("b");
        video.src = window.URL.createObjectURL(stream);
        video.play();
        button.disabled = false;
        button.onclick = function () {
            canvas.getContext("2d").drawImage(video, 0, 0, 300, 300, 0, 0, 300, 300);
            var img = canvas.toDataURL("image/png");
            alert("done");
        };
    }, function (err) { alert("there was an error " + err) });
}
window.addEventListener('load', startup, false);