let bgImg = new Image();
// 各フェーズの秒数
const waitingTime = 4;
const startTime = 1;
const timeLevel1 = 20;
const timeLevel2 = 20;
const timeLevel3 = 20;
const totalAnswerTime = timeLevel1 + timeLevel2 + timeLevel3;
const totalStage = 5;
const questionInterval = 5;

let stage = 1;
let titles = [];
let points = [];
let timeoutIDs = [];
let correctTitle = "";
let phaseStartTime = 0;
let isLoading = true;

function start() {
  document.getElementById('how-to-play').style.display = 'none';
  document.getElementById('point').style.display = 'block';
  document.getElementById('ranking-link').style.display = 'none';
  nextQuestion();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function nextQuestion() {
  setRandomMusic();
  resetSelectMusic();
  setMusics();
  document.getElementById('start-button').disabled = true;
  document.getElementById('result-component').style.display = 'none';
  for (let i = 0; i < waitingTime - 1; i++) {
    timeoutIDs.push(window.setTimeout(function () { drawImage(0, waitingTime - 1 - i); }, 1000 * i));
  }
  timeoutIDs.push(window.setTimeout(async function () {
    while (isLoading) {
      drawImage(0, "LOADING");
      await sleep(100);
    }
    drawImage(0, "START");
    let remainingTime = timeLevel1 + timeLevel2 + timeLevel3;
    timeoutIDs.push(window.setTimeout(function () {
      drawImage(1);
      document.getElementById('start-button').style.display = 'none';
      document.getElementById('answer-button').style.display = 'block';
      document.getElementById('answer-component').style.display = 'block';
      document.getElementById('notice').textContent = `残り時間 ${remainingTime} 秒`;
      let remainingTimer = window.setInterval(function () {
        remainingTime--;
        document.getElementById('notice').textContent = `残り時間 ${remainingTime} 秒`;
      }, 1000);
      timeoutIDs.push(remainingTimer);
      window.setTimeout(function () {
        clearInterval(remainingTimer);
      }, 1000 * remainingTime);
      phaseStartTime = Math.floor(Date.now());
    }, 1000 * startTime));
    timeoutIDs.push(window.setTimeout(function () { drawImage(2); }, 1000 * (startTime + timeLevel1)));
    timeoutIDs.push(window.setTimeout(function () { drawImage(3); }, 1000 * (startTime + timeLevel1 + timeLevel2)));
    timeoutIDs.push(window.setTimeout(function () {
      answer(true);
    }, 1000 * (startTime + timeLevel1 + timeLevel2 + timeLevel3)));
  }, 1000 * (waitingTime - 1)));

};

function answer(retire = false) {
  clearTimeouts();
  if (!retire) {
    var select = document.getElementById('itemSelect');
    var selectedText = select.options[select.selectedIndex].text;
  } else {
    var selectedText = "時間切れ";
  }
  let point = 0;
  if (selectedText == correctTitle) {
    document.getElementById('result-success').style.display = 'block';
    document.getElementById('result-fail').style.display = 'none';
    point = Math.round(((totalAnswerTime - ((Math.floor(Date.now()) - phaseStartTime) / 1000)) / totalAnswerTime) * 100);
  } else {
    document.getElementById('result-success').style.display = 'none';
    document.getElementById('result-fail').style.display = 'block';
  }
  titles.push(correctTitle);
  points.push(point);
  document.getElementById(`point-stage${stage}`).textContent = `${point}点`;
  document.getElementById(`title-stage${stage}`).textContent = correctTitle;
  document.getElementById('yourAnswer').textContent = selectedText;
  document.getElementById('correctAnswer').textContent = correctTitle;
  document.getElementById('answer-component').style.display = 'none';
  document.getElementById('result-component').style.display = 'block';
  drawImage(4);
  document.getElementById('answer-button').style.display = 'none';
  stage++;
  if (stage > totalStage) {
    finish();
  } else {
    for (let i = 0; i < questionInterval; i++) {
      window.setTimeout(function () {
        document.getElementById('notice').textContent = `${questionInterval - i} 秒後に次の問題に移るのだ！`;
      }, 1000 * i);
    };

    window.setTimeout(function () {
      document.getElementById('notice').textContent = '';
      nextQuestion();
    }, 1000 * questionInterval);
  }
}

function finish() {
  document.getElementById('notice').textContent = '';
  let totalPoint = points.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  document.getElementById('final-result').style.display = 'block';
  document.getElementById('final-result-point').textContent = totalPoint;
  addPoint(totalPoint);
  if (totalPoint == 0) {
    document.getElementById('register-name-form').style.display = 'none';
    document.getElementById('retry-form').style.display = 'block';
  } else {
    document.getElementById('register-name-form').style.display = 'block';
    document.getElementById('retry-form').style.display = 'none';
  }
}

function clearTimeouts() {
  for (let i = 0; i < timeoutIDs.length; i++) {
    window.clearTimeout(timeoutIDs[i]);
  }
  timeoutIDs = [];
}

function drawImage(level = 0, text = "") {
  let canvas = document.getElementById('canvas');
  canvas.width = 384;
  canvas.height = 384;
  let context = canvas.getContext('2d');

  context.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  let tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  let tempContext = tempCanvas.getContext('2d');

  drawAllMasks(tempContext, canvas.width, canvas.height, level);

  context.globalCompositeOperation = 'destination-in';
  context.drawImage(tempCanvas, 0, 0);

  context.globalCompositeOperation = 'destination-over';
  context.fillStyle = 'rgba(11, 0, 118, 1)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.globalCompositeOperation = 'source-over';

  if (text != "") {
    context.font = '80px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText(text, canvas.width / 2, canvas.height / 2 + 26);
  }
};

function drawAllMasks(context, canvasX, canvasY, level) {
  if (level == 0) {
    return;
  }

  if (level >= 4) {
    context.beginPath();
    context.fillRect(0, 0, canvasX, canvasY);
    return;
  }

  const centerX = canvasX / 2;
  const centerY = canvasY / 2;

  context.beginPath();
  context.arc(centerX, centerY, 30, 0, 2 * Math.PI);
  context.fill();

  if (level >= 2) {
    context.beginPath();
    context.arc(centerX + 100, centerY + 100, 30, 0, 2 * Math.PI);
    context.fill();

    context.beginPath();
    context.arc(centerX - 100, centerY - 100, 30, 0, 2 * Math.PI);
    context.fill();
  }

  if (level >= 3) {
    context.beginPath();
    context.arc(centerX - 100, centerY + 100, 30, 0, 2 * Math.PI);
    context.fill();

    context.beginPath();
    context.arc(centerX + 100, centerY - 100, 30, 0, 2 * Math.PI);
    context.fill();
  }
}

function setMusics(title = "", artist = "", version = "") {
  var select = document.getElementById('itemSelect');

  // 要素を全部消す
  while (select.firstChild) {
    select.removeChild(select.firstChild);
  }

  let titles = title.split(',');
  let artists = artist.split(",");
  let versions = version.split(",");

  musics.sort((a, b) => a[2].localeCompare(b[2]));
  if (artist != "") {
    musics.sort((a, b) => a[4].localeCompare(b[4]));
  }

  for (var i = 0; i < musics.length; i++) {
    let music = musics[i];
    if (title != "" && !titles.some(title => music[2].startsWith(title))) continue;
    if (artist != "" && !artists.some(artist => music[4].startsWith(artist))) continue;
    if (version != "" && !versions.some(version => music[5].includes(version))) continue;
    var option = document.createElement('option');
    option.text = toViewTitle(music);
    select.appendChild(option);
  }
}

function setRandomMusic() {
  let selectedMusic = "";
  let retryCount = 0;
  do {
    selectedMusic = musics[Math.floor(Math.random() * musics.length)];
    correctTitle = toViewTitle(selectedMusic);
    retryCount++;
  } while (titles.includes(correctTitle) && retryCount < 100);
  const imageName = selectedMusic[0].toString().padStart(5, '0') + ".png";
  isLoading = true;
  let promise = new Promise((resolve, reject) => {
    bgImg.onload = () => resolve("Image loaded");
    bgImg.onerror = () => reject("Error loading image");
    bgImg.src = `images/${imageName}`;
  });
  promise.then((_) => isLoading = false);
};

function resetSelectMusic() {
  document.getElementById('itemSelect').selectedIndex = 0;
  document.getElementById('filter-name').selectedIndex = 0;
  document.getElementById('filter-artist').selectedIndex = 0;
  document.getElementById('filter-version').selectedIndex = 0;
}

function hookFilter() {
  document.getElementById('filter-name').addEventListener('input', function () {
    document.getElementById('filter-artist').selectedIndex = 0;
    document.getElementById('filter-version').selectedIndex = 0;
    setMusics(this.value, "", "");
  });
  document.getElementById('filter-artist').addEventListener('input', function () {
    document.getElementById('filter-name').selectedIndex = 0;
    document.getElementById('filter-version').selectedIndex = 0;
    setMusics("", this.value, "");
  });
  document.getElementById('filter-version').addEventListener('input', function () {
    document.getElementById('filter-name').selectedIndex = 0;
    document.getElementById('filter-artist').selectedIndex = 0;
    setMusics("", "", this.value);
  });
};

function submitName() {
  let name = document.getElementById('input-name').value;
  if (name.length >= 20) {
    alert("名前は20文字以内にしてくれなのだ！");
    return false;
  }
  document.getElementById('submit-name-button').disabled = true;
  changeName(name);

  // すぐランキングを表示すると名前の更新が反映前にデータを取得してしまうことがあるので
  // 少し待ってからランキングに遷移するのだ！
  window.setTimeout(function () {
    window.location.href = 'rankings.html';
  }, 1000);
}

function toViewTitle(music) {
  let title = music[1];
  let artist = music[3];
  if (artist == "") return title;
  return `${title} (${artist})`;
}

window.onload = function () {
  bgImg.src = `images/title.png`;
  bgImg.onload = function () {
    drawImage(4);
  };

  setMusics();
  hookFilter();
};
