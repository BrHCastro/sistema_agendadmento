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
mongoose.set('useFindAndModify', false);

app.get('/', (req, res) => {
	res.render('index', {title: 'Início', link: 'inicio'});
});

app.get('/cadastro', (req, res) => {
	res.render('create', {title: 'Cadastro', link: 'cadastro'});
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
	res.render('event', {result: result, title: 'Visualizar', link: 'visualizar'});
});

app.post('/finish', async (req, res) => {
	let id = req.body.id;

	let result = await AppointmentService.Finish(id);

	if (result) {
		res.redirect('/');
	} else {
		console.log(result);
	}

});

app.get('/list', async (req, res) => {
	let appos = await AppointmentService.GetAll(true);
	res.render('list', {appos: appos, title: 'Lista', link: 'lista'});
});

app.get('/search', async (req, res) => {
	let query = req.query.search;
	let appos = await AppointmentService.Search(query);
	res.render('list', {appos: appos, title: 'Lista', link: 'lista'});
});

var pollTime = 1000 * 60 * 5;
setInterval(async () => {

	await AppointmentService.SendNotification();

}, pollTime);

//Servidor------------------------------------------------------------------------------

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Rodando na porta: ${PORT}`);
});
