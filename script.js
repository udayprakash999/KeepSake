const appContainer = document.getElementById("container");
const importBtn = document.getElementById("import");
const mainApp = document.querySelector(".app");
const reset = document.getElementById("reset");
const closeMemory = document.getElementById("closeMemory");
const closeInput = document.getElementById("closeInput");
const memoryIdx = document.getElementById("idx");
const memoryForm = document.getElementById("inputForm");
const memoryContainer = document.getElementById("memoryContainer");
const inputModal = document.getElementById("inputModal")
const moodInputs = document.querySelectorAll(".inputTag");
const moodInput = document.getElementById("moodInput");

moodInputs.forEach((mood) => {
  mood.addEventListener("click", () => {
    moodInputs.forEach((e) => e.classList.remove("moodActive"));
    console.log(mood.dataset.mood);
    mood.classList.add("moodActive");
    moodInput.value = mood.dataset.mood;
  });
});

memoryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const memoryData = new FormData(memoryForm);
  const image = memoryData.get("image");
  const entry = {
    id: crypto.randomUUID(),
    title: memoryData.get("title").trim(),
    date: memoryData.get("date"),
    mood: memoryData.get("moodInput"),
    journal: memoryData.get("memory"),
    image: image instanceof File && image.size > 0 ? image : null,
  };
  saveData(entry);
  memoryForm.reset();
  getData();
  inputModal.classList.remove("active");
  mainApp.classList.remove("secondary")
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
    memoryIdx.innerHTML = `${entries.length}`;
    createMemoryCard(entries);
  } catch (error) {
    console.error("Error : ", error);
  }
}
async function getDataId(id) {
  return new Promise((resolve, reject) => {
    const transaction = keptData.transaction("entries", "readonly");
    const store = transaction.objectStore("entries");
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(request.error);
  });
}
function createMemoryCard(data) {
  memoryContainer.innerHTML = "";
  data.forEach((memory) => {
    const memoryCard = document.createElement("div");
    memoryCard.classList.add("memory-card");
    const memoryImageSrc = URL.createObjectURL(memory.image);
    const memoryImageAlt = memory.title;
    const Id = memory.id;
    memoryCard.innerHTML = `
        <div class="memory-header">
          <div class="mood">${memory.mood}</div>
          <div class="date">${memory.date}</div>
        </div>
        <div class="memory-content">
          <h3>${memory.title}</h3>
        <div class="memory-image">
          <img src=${memoryImageSrc} alt=${memoryImageAlt}>
        </div>
        </div>
    `;
    memoryCard.addEventListener("click", async () => {
      createMemoryModal(Id);
    });
    memoryContainer.appendChild(memoryCard);
  });
}
async function createMemoryModal(id) {
  const memory = await getDataId(id);
  const memoryModal = document.getElementById("memoryModal");
  const memoryImageSrc = URL.createObjectURL(memory.image);
  const memoryImageAlt = memory.title;

  memoryModal.classList.add("active");
  mainApp.classList.add("secondary");

  memoryModal.querySelector(".memoryModalMain").innerHTML = `
      <div class="memory-header">
          <div class="mood">${memory.mood}</div>
          <div class="date">${memory.date}</div>
        </div>
        <div class="memory-content">
          <h3>${memory.title}</h3>
          <p>${memory.journal}</p>
        <div class="memory-image">
          <img src=${memoryImageSrc} alt=${memoryImageAlt}>
        </div>
        </div>
        `;
}

importBtn.addEventListener("click", () => {
  inputModal.classList.add("active");
  mainApp.classList.add("secondary");
});
closeMemory.addEventListener("click", () => {
  memoryModal.classList.remove("active");
  mainApp.classList.remove("secondary");
});
closeInput.addEventListener("click", () => {
  inputModal.classList.remove("active");
  mainApp.classList.remove("secondary");
});
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
