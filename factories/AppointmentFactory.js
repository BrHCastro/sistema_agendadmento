class AppointmentFactory{

    Build(simpleAppo) {

        let day = simpleAppo.date.getDate()+1; //Caso o horario do dado é 0 o getDate() retorna - 1
        let month = simpleAppo.date.getMonth();
        let year = simpleAppo.date.getFullYear();

        let hour = Number.parseInt(simpleAppo.time.split(':')[0]);
        let minute = Number.parseInt(simpleAppo.time.split(':')[1]);

        let startDate = new Date(year, month, day, hour, minute,0,0);
        startDate.setHours(startDate.getHours()-3); //Convertendo para horario padão do brasil (GMT-3)

        let appo = {
            id: simpleAppo._id,
            title: simpleAppo.name + " - " + simpleAppo.description,
            start: startDate,
            end: startDate
        }

        return appo;
    }

}

module.exports = new AppointmentFactory;