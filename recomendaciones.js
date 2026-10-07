/* Fichas de «Nuestras recomendaciones». Cada una tiene su página propia (recomendacion.html?r=<id>).
   Campos: t, sub, foto, que (qué es), dir (id en el directorio, de donde salen teléfono, web y dirección), mapa (id del punto del mapa),
   opciones (subtipo del directorio para listar varios centros), nivel («recomendado» | «colaborador» | ""), porque («Nuestra valoración», solo si la hay).
   REGLA: «porque» y «nivel» solo se rellenan con lo que Fibra Pagès conoce o ha probado; mientras tanto no se muestran. */
window.RECOMENDACIONES = {
  "kayaks-nicolau": { t: "Kayaks Nicolau", sub: "Kayak y paddle surf", foto: "/assets/planes/cala.jpg", pos: "40% 55%",
    que: "Alquiler por horas y rutas guiadas con snorkel, desde la playa de Mar Menuda.", dir: "kayaks-nicolau", mapa: "mar-menuda", nivel: "", porque: "" },
  "fondo-cristal": { t: "Fondo Cristal", sub: "Paseo en barco", foto: "/assets/planes/barcas.jpg", pos: "60% 60%",
    que: "Paseo en barco con fondo de cristal para ver el fondo marino de la costa de Tossa. Sale de la Platja Gran.", dir: "fondo-de-cristal-subvision-2", mapa: "fondo-cristal", nivel: "", porque: "" },
  "trenecito": { t: "Trenecito turístico", sub: "Con audioguía", foto: "/assets/planes/trenecito-azul.jpg", pos: "40% 55%", foto2: "/assets/planes/trenecito-verde.jpg", pie: "Fotos: Dicotren (pendiente de su autorización).",
    que: "Dicotren, con audioguía: el Tren Azul recorre el pueblo y el Tren Verde sube hasta el faro (de marzo a octubre).", dir: "carrilet", mapa: "tren1", nivel: "", porque: "" },
  "submarinismo": { t: "Submarinismo", sub: "Bautismos y cursos", foto: "/assets/planes/acantilado.jpg", pos: "50% 50%",
    que: "Bautismos, excursiones de inmersión y cursos en los centros de buceo de Tossa.", opciones: "Submarinismo", nivel: "", porque: "" },
  "cami-de-ronda": { t: "Camí de Ronda", sub: "Ruta junto al mar", foto: "/assets/planes/mirador.jpg", pos: "55% 50%",
    que: "Ruta a pie junto al mar, con vistas a la costa.", nivel: "", porque: "" }
};
