export default function handler(req, res) {
  const { id } = req.body;

  fetch(`${process.env.SERVER_IP}/api/noticias/contar/${id}`, {
    headers: {
      Authorization: process.env.AUTH_CONTAR_VISITA,
    },
  }).then((res) => {
    if (res.status === 200) {
      return;
    }
  });

  res.send("Visita recibida");
}
