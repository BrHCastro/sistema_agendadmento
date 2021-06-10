const appointment = require('../models/Appointment');
const mongoose = require('mongoose');
const AppointmentFactory = require('../factories/AppointmentFactory');
const mailer = require('nodemailer');

const Appo = mongoose.model('Appointment', appointment)

class AppointmentService {
    async Create(name, email, cpf, description, date, time) {
        var newAppo = new Appo({
            name,
            email,
            cpf,
            description,
            date,
            time,
            finished: false,
            notified: false
        });

        try {
            await newAppo.save();
            return true;
        } catch (err) {
            console.log(err);
            return false
        }
    }

    async GetAll(showFinished) {

        if (showFinished) {
            return await Appo.find();
        } else {
            let appos = await Appo.find({ 'finished': false});
            let appointments = [];

            appos.forEach(appo => {
                appointments.push(AppointmentFactory.Build(appo))
            });

            return appointments;
        }

    }

    async GetOne(id) {
        try {
            return await Appo.findOne({'_id': id});
        } catch (err) {
            console.log(err);
        }
    }

    async Finish(id) {
        try {
            await Appo.findByIdAndUpdate(id, {'finished':true});
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async Search(query) {
        try {
            return await Appo.find().or([{email: query}, {cpf: query}]);
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    async SendNotification() {

        let transporter = mailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 587,
            auth: {
                user: "8c564769514999",
                pass: "3ef82fc545a0ad"
            }
        });

        let appos = await this.GetAll(false);
        appos.forEach(async r => {
            let date = r.start.getTime();
            let hour = 1000 * 60 * 60;
            let gep = date - Date.now();

            if (gep <= hour) {
                if (!r.notified) {

                    transporter.sendMail({
                        from: "Henrique de Castro <henrique.castro@brhcastro.com.br>",
                        to: r.email,
                        subject: "Alerta Consulta!",
                        text: `Olá!! Passando para te lembrar sobre sua consulta. ${r.title}`
                    }).then(async () => {
                        await Appo.findByIdAndUpdate(r.id, {notified: true});
                    }).catch(err => {
                        console.log(err);
                    })

                }
            }
        });
    }
}

module.exports = new AppointmentService;