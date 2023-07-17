const columns = document.querySelectorAll(".items");

document.addEventListener("dragstart", (e) => {
  e.target.classList.add("dragging");
});

document.addEventListener("dragend", (e) => {
  e.target.classList.remove("dragging");
  const { idTodo } = e.target.dataset;
  const { idRole } = e.target.parentElement.dataset;

  const updateTask = async (idRole, idTodo) => {
    const response = await fetch(`/api/task/${idTodo}/update/${idRole}`, {
      method: 'POST',
      headers: new Headers({
        "Content-Type": 'application/json'
      }),
      body: JSON.stringify({
        position: Array.from(e.target.parentElement.children).indexOf(e.target)
      })
    })
  }

  updateTask(idRole, idTodo)
});

columns.forEach((item) => {
  item.addEventListener("dragover", (e) => {
    const dragging = document.querySelector(".dragging");
    const applyAfter = getNewPosition(item, e.clientY);

    if (applyAfter) {
      applyAfter.insertAdjacentElement("afterend", dragging);
    } else {
      item.prepend(dragging);
    }
  });
});

function getNewPosition(column, posY) {
  const cards = column.querySelectorAll(".item:not(.dragging)");
  let result;

  for (let refer_card of cards) {
    const box = refer_card.getBoundingClientRect();
    const boxCenterY = box.y + box.height / 2;

    if (posY >= boxCenterY) result = refer_card;
  }

  return result;
}