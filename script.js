let currentIndex = 0;
const infoBox = document.getElementById("info-box");
const slots = document.querySelectorAll(".slot");
const parts = document.querySelectorAll(".part");

parts.forEach(part => {
  part.draggable = true;

  part.addEventListener("dragstart", e => {
    e.dataTransfer.setData("name", part.dataset.name);
  });
});

slots.forEach(slot => {
  slot.addEventListener("dragover", e => e.preventDefault());

  slot.addEventListener("drop", e => {
    e.preventDefault();
    const name = e.dataTransfer.getData("name");
    const slotName = slot.dataset.slot;

    const expectedPart = engineParts[currentIndex];

    // сборка
    if (name === expectedPart.name && name === slotName) {
      const partImg = document.querySelector(`.part[data-name="${name}"]`);
      const placedImg = partImg.cloneNode();
      placedImg.classList.remove("part");
      placedImg.style.position = "absolute";
      placedImg.style.left = "0";
      placedImg.style.top = "0";
      placedImg.draggable = false;

      slot.appendChild(placedImg);
      partImg.style.opacity = "0.3";
      partImg.draggable = false;

      infoBox.innerHTML = `<strong>${expectedPart.label}</strong>: ${expectedPart.info}`;

      currentIndex++;
      if (currentIndex === engineParts.length) {
        infoBox.innerHTML += "<br><br><strong>Мотор полностью собран!</strong><br>Нажми на детали, чтобы разобрать.";
      }
    }
  });

  // разборка
  slot.addEventListener("click", () => {
    const placedImg = slot.querySelector("img");
    if (placedImg && currentIndex > 0) {
      const lastPlaced = engineParts[currentIndex - 1];
      if (slot.dataset.slot === lastPlaced.name) {
        slot.innerHTML = "";
        const originalPart = document.querySelector(`.part[data-name="${lastPlaced.name}"]`);
        originalPart.style.opacity = "1";
        originalPart.draggable = true;
        currentIndex--;

        infoBox.innerHTML = `Удалена деталь: <strong>${lastPlaced.label}</strong><br>Следующая для установки: <strong>${lastPlaced.label}</strong>`;
      } else {
        infoBox.innerHTML = `❌ Можно разбирать только последнюю установленную деталь: <strong>${engineParts[currentIndex - 1].label}</strong>`;
      }
    }
  });
});

// Показ инструкции при клике на "Подсказка"
const hintBtn = document.getElementById("hint-btn");
const hintText = document.getElementById("hint-text");

hintBtn.addEventListener("click", () => {
  hintText.innerHTML = `
    <strong>Инструкция по сборке мотора:</strong><br>
    1. Начни с цилиндр двигателя — это основа.<br>
    2. Установи коленвал — он размещается в центре.<br>
    3. Поршень вставляется в блок, соединяется с коленвалом.<br>
    4. Установи распределительный вал, соединив с коленчатым.<br>
    5. Генератор устанавливается в верхней части двигателя.<br>
    6. Свеча зажигания вставляется сверху.<br>
    7. Поддон картера устанавливается в нижней части двигателя.<br>
    Собирай строго по порядку! Чтобы разобрать — кликай по последней детали.
  `;
  hintText.style.display = "block";
});

// Вывод описания детали при клике на неё
parts.forEach(part => {
  part.addEventListener("click", () => {
    const partData = engineParts.find(p => p.name === part.dataset.name);
    if (partData) {
      infoBox.innerHTML = `<strong>${partData.label}</strong>: ${partData.info}`;
    }
  });
});
