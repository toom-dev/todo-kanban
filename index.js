const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const connection = require('./config/db');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const saltRounds = 8;
const jwtSecret = 'AgroFauna';

app.use(cors({origin: '*'}));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public/'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

function verifyJWT(req, res, next){
  const {user_token} = req.cookies;
  if (!user_token) return res.status(401).redirect('/');
  
  jwt.verify(user_token, jwtSecret, function(err, decoded) {
    if (err) return res.status(500).redirect('/');
    
    req.userData = decoded;
    next();
  });
}

app.get('/', (req, res) => {
  res.render('index')
});

app.get('/dashboard', verifyJWT, (req, res) => {
  const roles = 'select id_role, name from roles;'
  const tasks = 'select A.id_todo, A.description, A.id_role, R.name, A.position from todo as A inner join roles as R on A.id_role = R.id_role inner join user as U on A.id_user = U.id_user where A.id_user = ? ORDER BY A.position asc;'
  connection.query(roles, (roles_err, roles_results, roles_fields) => {
    connection.query(tasks, [req.userData.id_user], (err, tasks_results, fields) => {
      res.render('dashboard', {roles: roles_results, tasks: tasks_results})
    })
  })
});
app.get('/cadastrar', (req, res) => {
  res.render('cadastrar')
});

app.post('/api/task/:idTodo/update/:idRole', verifyJWT, (req, res) => {
  const {idTodo, idRole} = req.params;
  const { position } = req.body;
  const update = 'UPDATE todo SET id_role = ?, position = ? WHERE id_todo = ?;'
  connection.query(update, [idRole, position, idTodo], (update_err, update_results, update_fields) => {
    if(update_err) return res.status(500).json(update_err).send();
    return res.status(200).send();
  })
})

app.post('/api/task/create', verifyJWT, (req, res) => {
  const { idRole, taskName } = req.body;
  const update = 'INSERT INTO todo (id_user, description, id_role) values (?, ?, ?);'
  connection.query(update, [req.userData.id_user, taskName, idRole], (update_err, update_results, update_fields) => {
    if(update_err) return res.status(500).json(update_err).send();
    return res.status(200).send();
  })
})

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const login = 'SELECT id_user, email FROM user WHERE email = ?;'
  connection.query(login, [email], (login_err, login_results, login_fields) => {
    if(login_err) return res.status(500).json(login_err).send();

    if(login_results.length <= 0) {
      return res.status(404).send();
    }

    const token = jwt.sign(login_results[0], jwtSecret);
    return res.cookie('user_token', token, { maxAge: 900000 }).status(200).send();
  })
})

app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  const login = 'SELECT id_user, email FROM user WHERE email = ?;'
  
  connection.query(login, [email], (login_err, login_results, login_fields) => {
    if(login_err) return res.json(login_err).status(500).send();
    
    if(login_results.length == 0) {
      bcrypt.hash(password, saltRounds, function(err, hash) {
        if(err) return res.json(err).status(500).send();
        
        const register = 'insert into user (email, password) values (?, ?);'
        connection.query(register, [email, hash], (register_err, register_results, register_fields) => {
          if(register_err) return res.json(register_err).status(500).send();
          
          const token = jwt.sign(login_results[0], jwtSecret, { maxAge: 900000 });
          res.cookie('user_token', token, { maxAge: 900000 }).status(200).send();
        })
      })
    } else {
      return res.status(401).send();
    }
  });
})

app.listen(port, () => {console.log(`http://localhost:${port}`);})