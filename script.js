const avatar = document.querySelector(".avatar");
const avatarFullZone = document.querySelector(".avatar-picker");
const avatarImg = document.querySelector(".avatar__image");

let avatarPercentageZoom = 100;
let avatarFormat = "long";
let Dragging = false;

function setAvatarDefaultSize(width, height) {
  console.log(width, height);
  if (width > height) {
    avatarImg.style.height = 100 + "%";
    avatarFormat = "long";
  } else {
    avatarImg.style.width = 100 + "%";
    avatarFormat = "high";
  }
}

setAvatarDefaultSize(avatarImg.naturalWidth, avatarImg.naturalHeight);

function handleWheel(e) {
  if (e.deltaY > 0 && avatarPercentageZoom > 100) {
    avatarPercentageZoom -= 10;
  } else if (e.deltaY < 0 && avatarPercentageZoom < 200) {
    avatarPercentageZoom += 10;
  }

  if (avatarFormat === "long") {
    avatarImg.style.height = avatarPercentageZoom + "%";
  } else if (avatarFormat === "high") {
    avatarImg.style.width = avatarPercentageZoom + "%";
  }
}

avatar.addEventListener("wheel", handleWheel);
avatarFullZone.addEventListener("mousedown", startDrag);
avatarFullZone.addEventListener("mouseup", stopDrag);
avatarFullZone.addEventListener("mouseleave", stopDrag);
avatarFullZone.addEventListener("mousemove", handleDrag);

let offset = { x: 0, y: 0 };
let avatarCircleBounds, avatarImageBounds;
avatarCircleBounds = avatar.getBoundingClientRect();
avatarImageBounds = avatarImg.getBoundingClientRect();

let leftMax = avatarCircleBounds.left - avatarImageBounds.left;
function startDrag(e) {
  Dragging = true;


  offset = {
    x: e.clientX - avatarImg.offsetLeft,
    y: e.clientY - avatarImg.offsetTop,
  };
}

function stopDrag() {
  Dragging = false;
}

let position = { x: 0, y: 0 };

function handleDrag(e) {
  e.preventDefault();
  if (!Dragging) return;

  const { leftBound, rightBound, topBound, bottomBound } = checkBoundaries();

  let offsetX = e.clientX - offset.x;
  let offsetY = e.clientY - offset.y;
  console.log(offsetX, offsetY, leftMax);

  if (!rightBound && offsetX < leftMax) {
    offsetX = leftMax;
  } else if (!leftBound && offsetX > 100 + leftMax) {
    offsetX = 100 + leftMax;
  }

  avatarImg.style.left = offsetX + "px";
  avatarImg.style.top = offsetY + "px";
}

function checkBoundaries() {
  avatarImageBounds = avatarImg.getBoundingClientRect();

  return {
    leftBound: avatarCircleBounds.left > avatarImageBounds.left,
    rightBound: avatarCircleBounds.right < avatarImageBounds.right,
    topBound: avatarCircleBounds.top > avatarImageBounds.top,
    bottomBound: avatarCircleBounds.bottom < avatarImageBounds.bottom,
  };
}
