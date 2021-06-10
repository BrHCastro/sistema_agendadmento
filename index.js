const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const AppointmentService = require('./services/AppointmentService');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/sistema_agendadmento', {useNewUrlParser: true, useUnifiedTopology: true});


app.get('/', (req, res) => {
	res.render('index');
});

app.get('/cadastro', (req, res) => {
	res.render('create');
});

app.post('/create', async (req, res) => {
	let {name, email, cpf, description, date, time} = req.body;
	let status = await AppointmentService.Create(name, email, cpf, description, date, time);

	if (status) {
		res.redirect('/');
	} else {
		res.send("Houve uma falha!")
	}
})

app.get('/getcalendar', async (req, res) => {
	let appoitments = await AppointmentService.GetAll(false);
	res.json(appoitments);
});

app.get('/event/:id', async (req, res) => {
	let result = await AppointmentService.GetOne(req.params.id);
	res.render('event', {result});
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Rodando na porta: ${PORT}`);
});
