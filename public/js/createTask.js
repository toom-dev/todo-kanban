document.querySelector('#pop-up').addEventListener('click', (e) => {
  e.target.classList.remove('active')
})
document.body.addEventListener('keydown', (e) => {
  if(e.key == 'Escape' && document.querySelector('#pop-up').classList.contains('active')) {
    document.querySelector('#pop-up').classList.remove('active')
  }
})

const createTask = async () => {
  const role = JSON.parse(localStorage.getItem('role'));
  const taskName = document.getElementById('task-name').value;
  const response = await fetch('/api/task/create', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      idRole: role.id_role,
      taskName
    })
  })
  
  if(response.status == 200) {
    location.reload();
  }
}