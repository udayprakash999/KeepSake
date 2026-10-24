export default function mood() {
  const moodItems = document.querySelectorAll(".mood");
  const body = document.body;

  moodItems.forEach((mood) => {
    mood.addEventListener("click", () => {
      body.classList.remove("angry","happy","sad","excited");

      body.classList.add(`${mood.dataset.name}`);

      console.log(mood.dataset.name);
    });
  });
}

mood();