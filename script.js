import mood from "./js/mood.js";

const importBtn = document.getElementById("import");
const main = document.querySelector("main");
const reset = document.getElementById("reset");

importBtn.addEventListener("click", () => {
  inputModal.classList.toggle("active");
  main.classList.toggle("secondary");
});

const memoryForm = document.getElementById("inputForm");
const memoryContainer = document.getElementById("memoryContainer");

memoryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const memoryData = new FormData(memoryForm);
  const image = memoryData.get("image");
  const entry = {
    id: crypto.randomUUID(),
    title: memoryData.get("title").trim(),
    date: memoryData.get("date"),
    mood: memoryData.get("mood"),
    journal: memoryData.get("memory"),
    image: image instanceof File && image.size > 0 ? image : null,
  };
  saveData(entry);
  memoryForm.reset();
  getData();
  inputModal.remove("active");
});

let keptData;
const request = indexedDB.open("keptDB", 2);
request.onupgradeneeded = (e) => {
  keptData = e.target.result;
  keptData.createObjectStore("entries", {
    keyPath: "id",
  });
};
request.onsuccess = (e) => {
  keptData = e.target.result;
  getData();
};
request.onerror = () => {
  console.error("Database failed to open");
};

function saveData(entry) {
  const transaction = keptData.transaction("entries", "readwrite");
  transaction.objectStore("entries").add(entry);
  transaction.oncomplete = () => {
    console.log("Memory Saved");
  };
  transaction.onerror = () => {
    console.error("Failed to save Memory");
  };
}
function loadData() {
  return new Promise((resolve, reject) => {
    const transaction = keptData.transaction("entries", "readonly");
    const store = transaction.objectStore("entries");
    const request = store.getAll();
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
}

async function getData() {
  try {
    const entries = await loadData();
    console.log(entries);
    createMemoryCard(entries);
  } catch (error) {
    console.error("Error : ", error);
  }
}

function createMemoryCard(data) {
  memoryContainer.innerHTML = "";
  data.forEach((memory) => {
    const memoryCard = document.createElement("div");
    memoryCard.classList.add("memory-card");
    const memoryImageSrc = URL.createObjectURL(memory.image);
    const memoryImageAlt = memory.title;

    memoryCard.innerHTML = `
        <div class="memory-header">
          <div class="date">${memory.date}</div>
        </div>
        <div class="memory-content">
          <h3>${memory.title}</h3>
        <div class="memory-image">
          <img src=${memoryImageSrc} alt=${memoryImageAlt}>
        </div>
        </div>
    `;
    memoryContainer.appendChild(memoryCard);
  });
}

reset.addEventListener("click", () => {
  const request = indexedDB.deleteDatabase("keptDB");
  request.onsuccess = () => {
    alert("Database Resetted");
  };
  request.onerror = () => {
    alert("Error deleting database");
  };
  memoryContainer.innerHTML = "";
});

mood();
