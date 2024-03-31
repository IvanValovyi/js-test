const video = document.getElementById("video");
const startRecordBtn = document.getElementById("startRecord");
const stopRecordBtn = document.getElementById("stopRecord");
const recordedVideo = document.getElementById("recorded");
const errorMsgElement = document.querySelector("span#errorMsg");

const constraints = {
  audio: true,
  video: {
    width: 640,
    height: 480,
  },
};

let mediaRecorder;
let recordedChunks = [];

// Access webcam
async function init() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

// Success
function handleSuccess(stream) {
  window.stream = stream;
  video.srcObject = stream;

  // Create MediaRecorder
  mediaRecorder = new MediaRecorder(stream);

  // Setup data available event
  mediaRecorder.ondataavailable = function (event) {
    recordedChunks.push(event.data);
  };

  // Setup stopped event
  mediaRecorder.onstop = function () {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    recordedChunks = [];
    recordedVideo.src = URL.createObjectURL(blob);
    recordedVideo.controls = true;
  };
}

startRecordBtn.addEventListener("click", () => {
  mediaRecorder.start();
  startRecordBtn.disabled = true;
  stopRecordBtn.disabled = false;
});

stopRecordBtn.addEventListener("click", () => {
  mediaRecorder.stop();
  startRecordBtn.disabled = false;
  stopRecordBtn.disabled = true;
});

// Load init
document.addEventListener("DOMContentLoaded", () => {
  init();
});
