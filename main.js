document.addEventListener("DOMContentLoaded", function () {
  // Constants
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const imageInput = document.getElementById("imageInput");
  const cropButton = document.getElementById("cropButton");
  const saveButton = document.getElementById("saveButton");

  // Variables
  let image = new Image();
  let placeholderRadius = 100; // Adjust as needed
  let canvasCenterX;
  let canvasCenterY;
  let isImageLoaded = false;
  let isDragging = false;
  let offsetX, offsetY;
  let imageX = 0;
  let imageY = 0;
  let dragStartX = 0;
  let dragStartY = 0;
  let currentZoom = 1; // Zoom initial (sans zoom)
  const zoomFactor = 0.1; // Ajustez le facteur de zoom selon vos besoins

  // Event Listeners
  imageInput.addEventListener("change", handleImageSelect);
  cropButton.addEventListener("click", cropAvatar);
  saveButton.addEventListener("click", saveAvatar);

  canvas.addEventListener("mousedown", startDrag);
  canvas.addEventListener("mousemove", dragImage);
  canvas.addEventListener("mouseup", endDrag);
  canvas.addEventListener("mouseout", endDrag);
  canvas.addEventListener("wheel", handleZoom);
  canvas.addEventListener("touchmove", handleZoom);

  // Handle Image Selection
  function handleImageSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      image.onload = function () {
        const aspectRatio = image.width / image.height;
        let resizedWidth = 400;
        let resizedHeight = 400;

        if (aspectRatio > 1) {
          resizedHeight = 400 / aspectRatio;
        } else {
          resizedWidth = 400 * aspectRatio;
        }

        canvas.width = resizedWidth;
        canvas.height = resizedHeight;

        canvasWidth = canvas.width; // Initial canvas width
        canvasHeight = canvas.height; // Initial canvas height

        canvasCenterX = canvas.width / 2;
        canvasCenterY = canvas.height / 2;

        isImageLoaded = true;
        drawImageAndPlaceholder();
      };
      image.src = event.target.result;
    };

    reader.readAsDataURL(file);
  }

  // Draw Image and Placeholder
  function drawImageAndPlaceholder() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, imageX, imageY, image.width, image.height);

    // Darken area outside circle
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (isImageLoaded) {
      drawPlaceholder();
    }
  }

  function fillDarkRect(width, height) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, width, height);
  }

  // Draw Placeholder
  function drawPlaceholder() {
    // Draw the darkened area outside the circle

    // Draw the circle with the original image inside
    const circleRadius = placeholderRadius / currentZoom; // Met à jour le rayon du cercle en fonction du zoom
    const centerX = canvasCenterX / currentZoom; // Met à jour la coordonnée X du centre en fonction du zoom
    const centerY = canvasCenterY / currentZoom; // Met à jour la coordonnée Y du centre en fonction du zoom


    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();


    // Draw the original image
    ctx.drawImage(image, imageX, imageY, image.width, image.height);

    ctx.restore();
  }

  // Crop Avatar
  function cropAvatar() {
    drawImageAndPlaceholder();
  }

  // Save Avatar
  function saveAvatar() {
    const croppedImageData = canvas.toDataURL("image/png");
    // Send croppedImageData to server or perform any desired action
  }

  // Start image drag
  function startDrag(event) {
    if (isImageLoaded) {
      isDragging = true;
      offsetX = event.offsetX;
      offsetY = event.offsetY;
      dragStartX = imageX;
      dragStartY = imageY;
    }
  }

  // Drag image
  function dragImage(event) {
    if (isDragging) {
      const minX =
        -(image.width * currentZoom - placeholderRadius) + canvasCenterX;
      const minY =
        -(image.height * currentZoom - placeholderRadius) + canvasCenterY;
      const maxX = canvasCenterX - placeholderRadius;
      const maxY = canvasCenterY - placeholderRadius;

      const newX = dragStartX + (event.offsetX - offsetX) / currentZoom;
      const newY = dragStartY + (event.offsetY - offsetY) / currentZoom;

      imageX = Math.max(Math.min(newX, maxX), minX);
      imageY = Math.max(Math.min(newY, maxY), minY);

      // Limit the image position based on the current zoom
      const maxImageX = maxX / currentZoom;
      const minImageX = minX / currentZoom;
      const maxImageY = maxY / currentZoom;
      const minImageY = minY / currentZoom;

      imageX = Math.max(Math.min(imageX, maxImageX), minImageX);
      imageY = Math.max(Math.min(imageY, maxImageY), minImageY);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(currentZoom, currentZoom);
      drawImageAndPlaceholder();
      ctx.restore();
    }
  }

  // End image drag
  function endDrag() {
    if (isDragging) {
      isDragging = false;
    }
  }

  function handleZoom(event) {
    event.preventDefault();


    const zoomDirection = event.deltaY < 0 ? 1 : -1; // Vérifie la direction du zoom
    const zoomAmount = zoomFactor * zoomDirection; // Calcule le montant de zoom
    const previousZoom = currentZoom; // Stocke le zoom précédent
    currentZoom = Math.max(currentZoom + zoomAmount, 0.5); // Ajustez le niveau de zoom minimal selon vos besoins

    // Ajuste la position de l'image en fonction du zoom
    const zoomRatio = currentZoom / previousZoom;
    const centerX = canvasCenterX * zoomRatio;
    const centerY = canvasCenterY * zoomRatio;
    imageX = (imageX - canvasCenterX) * zoomRatio + centerX;
    imageY = (imageY - canvasCenterY) * zoomRatio + centerY;


    // Applique le zoom sur l'image et le placeholder
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    ctx.save();
    ctx.scale(currentZoom, currentZoom);
    drawImageAndPlaceholder();
    ctx.restore();
  }
});
