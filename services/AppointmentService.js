const appointment = require('../models/Appointment');
const mongoose = require('mongoose');
const AppointmentFactory = require('../factories/AppointmentFactory');

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
            finished: false
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
}

module.exports = new AppointmentService;