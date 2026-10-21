// const data = [
//   {
//     day: 1,
//     title: "TitleTrial",
//     journal: "this is a idea how the journal will look.",
//     image: "./image.jpg",
//     mood: "angry",
//   },
//   {
//     day: 2,
//     title: "title2",
//     journal: "this is another the journal will look",
//     image: "./image2.jpg",
//     mood: " excited",
//   },
// ];

const dashboardWrapper = document.querySelector(".dashboard-wrapper");
const main = document.querySelector("main");
const importBtn = document.getElementById("import");
const inputModal = document.querySelector(".input-modal");
const inputForm = document.getElementById("inputForm");

importBtn.addEventListener("click", () => {
  inputModal.classList.toggle("active");
  main.classList.toggle("secondary");
});

// async function convertImage(img) {
//   const convertedImage = await new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       resolve(reader.result);
//     };
//     reader.onerror = reject;
//     reader.readAsDataURL(img);
//   });
//   console.log(convertedImage);
//   generateImage(convertedImage);
// }
// function generateImage(data) {
//   const preview = document.createElement("img");
//   preview.src = data;
//   inputModal.append(preview);
// }

const quoteAPI = `https://www.drivebird.com/api/quotes/today`;
const quoteContainer = document.getElementById("quoteContainer");
function getQuote() {
  fetch(quoteAPI)
    .then((result) => result.json())
    .then((data) => setQuote(data.data))
    .catch((error) => {
      console.error("Error", error);
    });
}
function setQuote(data) {
  console.log(data);
  quoteContainer.innerHTML = `
    <h4 id="quote">${data.quote}</h4>
    <h5 id="author">${data.author}</h5>
  `;
}
getQuote();

const memoryForm = document.getElementById("memoryForm");

memoryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const memoryData = new FormData(memoryForm);
  const image = memoryData.get("image");
  const entry = {
    id: crypto.randomUUID(),
    title: memoryData.get("title").trim(),
    date: memoryData.get("date"),
    journal: memoryData.get("journal"),
    image: image.size > 0 ? image : null,
  };
  console.log(entry);
  saveData(entry);
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
  getData()
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
  } catch (error) {
    console.error("Error : ", error);
  }
}

