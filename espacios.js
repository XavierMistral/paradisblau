/* Espacios de Paradis Blau.
   raiz: la guía general (abierta a buscadores).
   letsholidays: la misma guía vista por los huéspedes de Lets Holidays (a la que se llega con el QR; no se indexa).
   Para crear un espacio nuevo: añadir una entrada aquí y una línea en construir_espacios.py. */
window.PB_ESPACIOS = {
  raiz: { nombre: "Paradis Blau" },
  letsholidays: {
    nombre: "Lets Holidays",
    web: "https://letsholidays.com",
    logo: "/assets/letsholidays-logo.png",
    /* Interruptor de la nota «busca la red Lets Holidays» (Servicios > Wifi gratuito). Ponerlo en true SOLO cuando la red de invitados exista de verdad en el piloto. */
    wifi_invitados: false,
    /* Datos de ejemplo. Las claves reales de cada vivienda se cargarán cuando Lets Holidays las facilite
       (llegan con el parámetro ?v=<id> del QR de la vivienda). NO guardar aquí contraseñas reales sin decidir cómo protegerlas. */
    viviendas: {
      ejemplo: { nombre: "Vivienda de ejemplo", wifi_red: "(nombre de la red)", wifi_clave: "(contraseña)" }
    }
  }
};
