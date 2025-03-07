const { google } = require('googleapis');
const calendar = google.calendar('v3');

const obtenerEventos = async (auth) => {
  const res = await calendar.events.list({
    calendarId: 'primary',
    auth: auth,
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  return res.data.items;
};

const crearEvento = async (auth, resumen, descripcion, inicio, fin) => {
  const evento = {
    summary: resumen,
    description: descripcion,
    start: {
      dateTime: inicio,
      timeZone: 'America/Argentina/Buenos_Aires',
    },
    end: {
      dateTime: fin,
      timeZone: 'America/Argentina/Buenos_Aires',
    },
  };

  const res = await calendar.events.insert({
    calendarId: 'primary',
    auth: auth,
    resource: evento,
  });
  return res.data;
};

module.exports = {
  obtenerEventos,
  crearEvento
};
