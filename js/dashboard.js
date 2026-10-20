const data = [
  {
    day: 1,
    title: "TitleTrial",
    journal: "this is a idea how the journal will look.",
    image: "./image.jpg",
    mood: "angry",
  },
  {
    day: 2,
    title: "title2",
    journal: "this is another the journal will look",
    image: "./image2.jpg",
    mood: " excited",
  },
];

const dashboardWrapper = document.querySelector(".dashboard-wrapper");
const main = document.querySelector("main");
const importBtn = document.getElementById("import");
const inputModal = document.querySelector(".input-modal");
const inputForm = document.getElementById("inputForm");

importBtn.addEventListener("click", () => {
  inputModal.classList.toggle("active");
  main.classList.toggle("secondary");
});

inputForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = e.target[0].files[0];
  if (!value) return;
  console.log(value);
  convertImage(value);
  inputForm.reset();
});

async function convertImage(img) {
  const convertedImage = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(img);
  });
  console.log(convertedImage);
  generateImage(convertedImage);
}
function generateImage(data) {
  const preview = document.createElement("img");
  preview.src = data;
  inputModal.append(preview);
}
