const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const connection = require('./config/db');
const cors = require('cors');

app.use(cors({origin: '*'}));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(__dirname + '/public/'))
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.get('/', (req, res) => {
  const roles = 'select id_role, name from roles;'
  const tasks = 'select A.id_todo, A.description, A.id_role, R.name, A.position from todo as A inner join roles as R on A.id_role = R.id_role inner join user as U on A.id_user = U.id_user where A.id_user = ? ORDER BY A.position asc;'
  connection.query(roles, (roles_err, roles_results, roles_fields) => {
    connection.query(tasks, [1], (err, tasks_results, fields) => {
      res.render('index', {roles: roles_results, tasks: tasks_results})
    })
  })
});

app.post('/api/task/:idTodo/update/:idRole', (req, res) => {
  const {idTodo, idRole} = req.params;
  const { position } = req.body;
  const update = 'UPDATE todo SET id_role = ?, position = ? WHERE id_todo = ?;'
  connection.query(update, [idRole, position, idTodo], (update_err, update_results, update_fields) => {
    if(update_err) return res.status(500).json(update_err).send();
    return res.status(200).send();
  })
})

app.post('/api/task/create', (req, res) => {
  const { idRole, taskName } = req.body;
  const update = 'INSERT INTO todo (id_user, description, id_role) values (?, ?, ?);'
  connection.query(update, [1, taskName, idRole], (update_err, update_results, update_fields) => {
    if(update_err) return res.status(500).json(update_err).send();
    return res.status(200).send();
  })
})

app.listen(port, () => {console.log(`http://localhost:${port}`);})