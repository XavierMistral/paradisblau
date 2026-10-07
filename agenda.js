/* Agenda para el bloque "Hoy en Tossa". Solo fechas ya verificadas (agenda oficial de visittossa.com, recogida en la web).
   puntuales: eventos con fecha. semanales: dow 0=domingo ... 6=sábado; meses 1-12.
   Para ampliar: añadir líneas aquí. En producción se puede sustituir por una lectura de la agenda oficial. */
window.AGENDA = {
  puntuales: [
    { t: "VIII La Megalítica de Tossa", d: "2026-10-11", h: "2026-10-11", n: "Carrera de trail de montaña (5K, 10K y 21K)." },
    { t: "XIV Pre San Silvestre", d: "2026-12-13", h: "2026-12-13", n: "Carrera popular de preparación de San Silvestre." }
  ],
  semanales: [
    { t: "Mercadillo semanal", dow: 4, hora: "Por la mañana", n: "Mercadillo de los jueves en el pueblo." },
    { t: "El arte de la guitarra española", dow: 4, meses: [6, 7, 8, 9, 10], lugar: "Iglesia de Sant Vicenç", n: "Concierto de guitarra española. Entrada 15 €." }
  ],
  siempre: [
    { t: "Cinema Montserrat", n: "Estrenos semanales. Carrer Pola 9." },
    { t: "Poliesportiu municipal", n: "Piscinas, sauna y pádel; entrada de un día." }
  ]
,
  /* Planes según el tiempo. Nombres comprobados: Museu Municipal (Vila Vella, mosaicos romanos y obra de Chagall),
     Museu de la Dona (C/ Codolar 4). POR CONFIRMAR antes de publicar: horarios y webs de las galerías (Art Gallery Blanco Grané y Art Michaeli, nombres dados por Javi) y tiendas concretas. Operadores (enlaces dados por Javi, 05/10): Fondo Cristal (barco), Kayaks Nicolau (Mar Menuda), Get Active Tossa (Llorell);
     y nombres concretos de galerías de arte y tiendas. */
  planes: {
    sol: [
      { t: "Platja Gran", img: "/assets/planes/platja-gran.jpg", pos: "50% 62%", n: "La playa del pueblo, a los pies de la Vila Vella." },
      { t: "Mar Menuda", img: "/assets/planes/mar-menuda.jpg", pos: "50% 55%", n: "Playa de Tossa con base de kayaks y paddle surf." },
      { t: "Kayaks Nicolau: kayak y paddle surf", img: "/assets/planes/cala.jpg", pos: "40% 55%", n: "Alquiler por horas y rutas guiadas con snorkel, desde la playa de Mar Menuda y bajo la Vila Vella.", u: "https://www.kayaksnicolau.cat/es/" },
      { t: "Get Active Tossa: aventura con guía", img: "/assets/planes/acantilado.jpg", pos: "50% 50%", n: "Kayak, 4x4 vintage, coasteering y escalada con guías locales.", u: "https://getactivetossa.com/" },
      { t: "Fondo Cristal: paseo en barco", img: "/assets/planes/barcas.jpg", pos: "60% 60%", n: "Empresa familiar de Tossa desde 1985, con barcos de fondo de cristal y recorridos hasta Cala Giverola.", u: "https://fondocristal.com/" },
      { t: "Submarinismo", img: "/assets/genericas/buceo.jpg", pos: "50% 50%", credito: { a: "Ryland.cairns", l: "CC0", u: "https://commons.wikimedia.org/wiki/File:Scuba_Diving_Samaesan_Island.jpg" }, n: "Bautismos, excursiones de inmersión y cursos para sacarse el título, en centros como Super Dive Tossa, Tossa Divers, Dream Dive y L'Àmfora." },
      { t: "Camí de Ronda", img: "/assets/planes/mirador.jpg", pos: "55% 50%", n: "Ruta a pie junto al mar, con vistas a la costa." },
      { t: "Subir al faro", img: "/assets/planes/faro.jpg", pos: "50% 50%", n: "El Far de Tossa, con una de las mejores vistas del pueblo." },
      { t: "Paseando por Tossa", img: "/assets/planes/casco.jpg", pos: "40% 60%", n: "Cuatro paseos: entre las murallas, del pueblo a la playa, para una tarde o una noche y en el trenecito.", u: "paseos.html", interno: true }
    ],
    lluvia: [
      { t: "Museu Municipal de la Vila Vella", img: "/assets/planes/museu-municipal.jpg", pos: "50% 50%", credito: { a: "Kippelboy", l: "CC0", u: "https://commons.wikimedia.org/wiki/File:Museu_Municipal_de_Tossa_de_Mar_interiors_07.jpg" }, n: "Mosaicos de la villa romana y arte ligado a Tossa, con una obra de Chagall. Cerrado por reformas según Tossa Turisme (octubre 2026): comprueba antes de ir." },
      { t: "Museu de la Dona", img: "/assets/patrimonio/can-ganga.jpg", pos: "50% 50%", credito: { a: "Mafoso", l: "CC BY-SA 3.0", u: "https://commons.wikimedia.org/wiki/File:Can_Ganga-Tossa-02.JPG" }, n: "La historia de Tossa contada desde las mujeres, en la masía de Can Ganga. Carrer Codolar 4." },
      { t: "Shopping", img: "/assets/planes/casco.jpg", pos: "40% 60%", n: "Tiendas, pastelerías y bisutería del centro, para pasear y comprar.", u: "paseos.html#pueblo", interno: true },
      { t: "Galerías de arte: Blanco Grané y Art Michaeli", img: "/assets/planes/galeria-kars.jpg", pos: "50% 50%", credito: { a: "Georges Kars (dominio público)", l: "Dominio público", u: "https://commons.wikimedia.org/wiki/File:Georges_Kars,_Pohled_na_Tossu_(Tossa_del_Mar).jpg" }, n: "Tossa fue refugio de artistas en los años treinta y sigue teniendo galerías. Art Michaeli expone dibujo, acuarela y pintura de Rasim Michaeli." },
      { t: "Submarinismo", img: "/assets/genericas/buceo.jpg", pos: "50% 50%", credito: { a: "Ryland.cairns", l: "CC0", u: "https://commons.wikimedia.org/wiki/File:Scuba_Diving_Samaesan_Island.jpg" }, n: "Bautismos, excursiones de inmersión y cursos para sacarse el título, en centros como Super Dive Tossa, Tossa Divers, Dream Dive y L'Àmfora." },
      { t: "Cinema Montserrat", img: "/assets/planes/cine.jpg", pos: "50% 50%", n: "Una sala con estrenos semanales. Carrer Pola 9." },
      { t: "Comer sin prisa", img: "/assets/planes/comer.jpg", pos: "50% 55%", n: "Cocina marinera en Can Pini o marisco en Sa Muralla." },
      { t: "Paseando por Tossa", img: "/assets/planes/casco.jpg", pos: "40% 60%", n: "Cuatro paseos: entre las murallas, del pueblo a la playa, para una tarde o una noche y en el trenecito.", u: "paseos.html", interno: true }
    ]
  },
  /* Portada: selección curada por Javi (sin métricas de huéspedes todavía). */
  recomendados: [
    { t: "Kayaks Nicolau", sub: "Kayak y paddle surf", img: "/assets/planes/cala.jpg", pos: "40% 55%", u: "recomendacion.html?r=kayaks-nicolau", interno: true },
    { t: "Fondo Cristal", sub: "Paseo en barco", img: "/assets/planes/barcas.jpg", pos: "60% 60%", u: "recomendacion.html?r=fondo-cristal", interno: true },
    { t: "Bar La Bolera", sub: "Bolos con ambiente retro", img: "/assets/planes/bolera.jpg", pos: "50% 50%", u: "/bolera/", interno: true },
    { t: "Trenecito turístico", sub: "Con audioguía", img: "/assets/planes/trenecito-azul.jpg", pos: "40% 55%", u: "recomendacion.html?r=trenecito", interno: true },
    { t: "Submarinismo", sub: "Bautismos y cursos", img: "/assets/planes/submarinismo-medes.jpg", u: "recomendacion.html?r=submarinismo", interno: true },
    { t: "Camí de Ronda", sub: "Ruta junto al mar", img: "/assets/planes/mirador.jpg", pos: "55% 50%", u: "recomendacion.html?r=cami-de-ronda", interno: true }
  ],
  /* Secciones de "Planes" (cada una abre planes.html?s=<id>). */
  secciones: {
    sol: { t: "Con sol", intro: "Playas, calas y actividades al aire libre.", listas: [{ de: "sol" }] },
    lluvia: { t: "Con lluvia", intro: "Museos, galerías, cine y planes bajo techo.", listas: [{ de: "lluvia" }] },
    shopping: { t: "Shopping", intro: "Tiendas, galerías y dulces del centro, para pasear y comprar.", listas: [{ items: [
      { t: "Galerías de arte: Blanco Grané y Art Michaeli", img: "/assets/planes/galeria-kars.jpg", pos: "50% 50%", credito: { a: "Georges Kars (dominio público)", l: "Dominio público", u: "https://commons.wikimedia.org/wiki/File:Georges_Kars,_Pohled_na_Tossu_(Tossa_del_Mar).jpg" }, n: "Tossa fue refugio de artistas en los años treinta y sigue teniendo galerías. Art Michaeli expone dibujo, acuarela y pintura de Rasim Michaeli." },
      { t: "Moda y complementos", img: "/assets/genericas/moda-boutique.jpg", pos: "50% 50%", credito: { a: "Imagen generada con IA (Google Gemini)", l: "ilustrativa", u: "/creditos.html" }, n: "Unas 23 tiendas de moda y 5 de bolsos y complementos, en el centro y la Vila Vella.", u: "directorio.html?g=comprar&t=Moda", interno: true },
      { t: "Bisutería y joyería", img: "/assets/genericas/bisuteria-artesanal.jpg", pos: "50% 50%", credito: { a: "Imagen generada con IA (Google Gemini)", l: "ilustrativa", u: "/creditos.html" }, n: "13 tiendas de bisutería y joyería, para llevarte un recuerdo.", u: "directorio.html?g=comprar&t=Bisutería y joyería", interno: true },
      { t: "Souvenirs y cerámica", img: "/assets/genericas/souvenirs-ceramica.jpg", pos: "50% 55%", credito: { a: "Imagen generada con IA (Google Gemini)", l: "ilustrativa", u: "/creditos.html" }, n: "Recuerdos de Tossa, cerámica y artesanía.", u: "directorio.html?g=comprar&t=Souvenirs", interno: true },
      { t: "Alimentación y productos locales", img: "/assets/genericas/bodegon-mediterraneo.jpg", pos: "50% 55%", credito: { a: "Imagen generada con IA (Google Gemini)", l: "ilustrativa", u: "/creditos.html" }, n: "Tiendas de alimentación, carnicerías, pescaderías y productores locales.", u: "directorio.html?g=comprar&t=Alimentación", interno: true },
      { t: "Todas las tiendas de Tossa", img: "/assets/planes/casco.jpg", pos: "50% 40%", n: "El listado completo de comercios, con teléfono y ubicación en el mapa.", u: "directorio.html?g=comprar", interno: true }
    ] }] },
    costa: { t: "La Costa Brava", intro: "Los pueblos de la costa y del Empordà, de Blanes a Roses, para una excursión de un día.", listas: [
      { titulo: "Cerca de Tossa", items: [
        { t: "Lloret de Mar", img: "/assets/planes/costa-lloret.jpg", pos: "50% 55%", credito: { a: "Txllxt TxllxT", l: "CC BY-SA 4.0", u: "https://commons.wikimedia.org/wiki/File:Lloret_de_Mar_-_Carrer_Josep_de_Tarandellas_-_Panorama_View_on_Lloret_de_Mar_Beach,_Pine_Trees_%26_Costa_Brava_Mediterranean_Sea_Coast_02.jpg" }, n: "El pueblo vecino por el sur, con los jardines de Santa Clotilde sobre el mar. Mercado semanal los martes.", u: "http://www.patrimoni.lloret.cat" },
        { t: "Blanes", img: "/assets/planes/costa-blanes.jpg", pos: "50% 50%", credito: { a: "Corradox", l: "CC BY-SA 3.0", u: "https://commons.wikimedia.org/wiki/File:Blanes_Strand.JPG" }, n: "Donde empieza la Costa Brava, con el jardín botánico Marimurtra. Mercado semanal los lunes.", u: "https://www.marimurtra.cat" },
        { t: "Sant Feliu de Guíxols", img: "/assets/planes/costa-santfeliu.jpg", pos: "50% 40%", credito: { a: "Vrac", l: "CC BY-SA 4.0", u: "https://commons.wikimedia.org/wiki/File:Monestir_de_Sant_Feliu_de_Gu%C3%ADxols_de_nit.JPG" }, n: "Paseo marítimo, monasterio y camí de ronda, hacia el norte. Mercado los domingos." },
        { t: "Platja d'Aro", img: "/assets/planes/costa-platjadaro.jpg", pos: "50% 50%", credito: { a: "Lluís Català", l: "CC BY-SA 4.0", u: "https://commons.wikimedia.org/wiki/File:Platja_Gran_Platja_d%27Aro.jpg" }, n: "Una de las playas más largas de la zona y un gran paseo marítimo. Mercado los viernes." }
      ] },
      { titulo: "El Baix Empordà", items: [
        { t: "Begur", img: "/assets/planes/costa-begur.jpg", pos: "50% 50%", credito: { a: "Alan Mattingly", l: "CC BY-SA 4.0", u: "https://commons.wikimedia.org/wiki/File:Begur_from_the_castle.jpg" }, n: "Castillo del siglo XI, casas indianas y las mejores vistas panorámicas de la Costa Brava." },
        { t: "Pals", img: "/assets/planes/costa-pals.jpg", pos: "50% 50%", credito: { a: "MARIA ROSA FERRE ✿", l: "CC BY-SA 2.0", u: "https://commons.wikimedia.org/wiki/File:Carrer_Major_(Pals)_-_2.jpg" }, n: "Recinto gótico en el Puig Aspre, murallas del siglo XII y mirador de Josep Pla." }
      ] },
      { titulo: "Más lejos, en el Alt Empordà", items: [
        { t: "Empúries", img: "/assets/planes/costa-empuries.jpg", pos: "50% 60%", credito: { a: "LeZibou", l: "CC BY-SA 3.0", u: "https://commons.wikimedia.org/wiki/File:Empuries_MaisonduPeristyle.jpg" }, n: "Las ruinas de la ciudad griega y romana, junto al mar, en l'Escala." },
        { t: "Roses y el Cap de Creus", img: "/assets/planes/costa-roses.jpg", pos: "50% 40%", credito: { a: "Gordito1869", l: "CC BY 3.0", u: "https://commons.wikimedia.org/wiki/File:Roses_Zitadelle_3.jpg" }, n: "La ciudadela de Roses y el parque natural del Cap de Creus, el extremo más salvaje de la costa." },
        { t: "Triangle Dalinià", img: "/assets/planes/dali-figueres.jpg", pos: "50% 40%", credito: { a: "Maksim Sokolov", l: "CC BY-SA 4.0", u: "https://commons.wikimedia.org/wiki/File:Teatre-Museu_Dal%C3%AD_(Figueres)_01.jpg" }, n: "Teatro-Museo Dalí en Figueres, casa de Dalí en Portlligat (Cadaqués) y castillo de Púbol.", u: "http://www.salvador-dali.org" }
      ] },
      { titulo: "Un día de mercado", items: [
        { t: "Mercados semanales cerca de Tossa", img: "/assets/genericas/mercadillo-semanal.jpg", pos: "50% 50%", credito: { a: "Imagen generada con IA (Google Gemini)", l: "ilustrativa", u: "/creditos.html" }, n: "Lunes: Blanes. Martes: Lloret. Miércoles: Cassà de la Selva. Jueves: Tossa de Mar. Viernes: Platja d'Aro y La Bisbal. Sábado: Girona. Domingo: Tordera y Sant Feliu de Guíxols." }
      ] }
    ] },
    girona: { t: "Girona", intro: "Girona y las escapadas de un día desde Tossa: la ciudad, la Garrotxa y Barcelona.", listas: [
      { titulo: "Girona", items: [
        { t: "Las casas del Onyar", img: "/assets/planes/girona-onyar.jpg", pos: "50% 45%", credito: { a: "Escarlati", l: "CC BY-SA 3.0", u: "https://commons.wikimedia.org/wiki/File:Gerona,_casas_colgadas_sobre_el_O%C3%B1ar.jpg" }, n: "Las casas de colores colgadas sobre el río Onyar, con el puente de hierro de las Peixateries Velles, del taller de Eiffel, son la imagen más conocida de Girona." },
        { t: "La Catedral y el Barri Jueu", img: "/assets/planes/girona-catedral.jpg", pos: "50% 35%", credito: { a: "Richard Mortel from Riyadh, Saudi Arabia", l: "CC BY 2.0", u: "https://commons.wikimedia.org/wiki/File:Girona_Cathedral,_Baroque_facade_and_stairs)_(30946815990).jpg" }, n: "La catedral, con su gran escalinata barroca, domina la ciudad. Junto a ella, el Barri Jueu (el Call) y el centro monumental, con museos y tiendas.", u: "http://www.girona.cat/turisme/" },
        { t: "El casco antiguo", img: "/assets/planes/girona-passeig.jpg", pos: "50% 50%", credito: { a: "Enric", l: "CC BY-SA 4.0", u: "https://commons.wikimedia.org/wiki/File:131_Passeig_Arqueol%C3%B2gic_(Girona),_font.jpg" }, n: "Passeig Arqueològic, Plaça dels Jurats y el Monestir de Sant Pere de Galligants. Mercado semanal los sábados." }
      ] },
      { titulo: "La Garrotxa, tierra de volcanes", items: [
        { t: "La Garrotxa y Olot", img: "/assets/planes/garrotxa-volca.jpg", pos: "50% 50%", credito: { a: "Carquinyol from Badalona, Catalunya", l: "CC BY-SA 2.0", u: "https://commons.wikimedia.org/wiki/File:Volc%C3%A0_de_Santa_Margarida.jpg" }, n: "Parque natural de la zona volcánica, con unos 40 volcanes inactivos, como el de Santa Margarida, y Castellfollit de la Roca." },
        { t: "La Fageda d'en Jordà", img: "/assets/planes/garrotxa-fageda.jpg", pos: "50% 50%", credito: { a: "Jorge Franganillo", l: "CC BY 3.0", u: "https://commons.wikimedia.org/wiki/File:Fageda_d%27en_Jord%C3%A0_-_panoramio.jpg" }, n: "Un hayedo que crece sobre una antigua colada de lava, cerca de Olot, para pasear a pie entre árboles." },
        { t: "Santa Pau", img: "/assets/planes/garrotxa-santapau.jpg", pos: "50% 50%", credito: { a: "Vassil", l: "CC0", u: "https://commons.wikimedia.org/wiki/File:02_Santa_Pau_26072016_02.jpg" }, n: "Pueblo medieval de la Garrotxa, con calles y soportales de piedra." }
      ] },
      { titulo: "Barcelona", items: [
        { t: "La Sagrada Família", img: "/assets/planes/bcn-sagrada.jpg", pos: "50% 30%", credito: { a: "Jopparn", l: "CC BY-SA 3.0", u: "https://commons.wikimedia.org/wiki/File:Sagrada_Fam%C3%ADlia_2010.JPG" }, n: "La gran obra de Gaudí, a poco más de una hora de Tossa. Conviene reservar la entrada con antelación." },
        { t: "Park Güell", img: "/assets/planes/bcn-parkguell.jpg", pos: "50% 50%", credito: { a: "Danbu14", l: "CC BY-SA 3.0", u: "https://commons.wikimedia.org/wiki/File:Park_Guell_Detail_Terrace.jpg" }, n: "El parque de Gaudí, con sus bancos de mosaico y vistas sobre la ciudad." },
        { t: "El Barri Gòtic y la catedral", img: "/assets/planes/bcn-gotic.jpg", pos: "50% 40%", credito: { a: "Angela Llop", l: "CC BY-SA 2.0", u: "https://commons.wikimedia.org/wiki/File:Catedral_de_Barcelona_-_12.jpg" }, n: "El casco antiguo de Barcelona, con la catedral gótica y calles estrechas para pasear." }
      ] }
    ] },
    deportes: { t: "Deportes", intro: "Mar, senderismo y deporte municipal.", listas: [{ items: [
      { t: "Kayaks Nicolau: kayak y paddle surf", img: "/assets/planes/cala.jpg", pos: "40% 55%", n: "Alquiler por horas y rutas guiadas con snorkel, desde la playa de Mar Menuda.", u: "https://www.kayaksnicolau.cat/es/" },
      { t: "Get Active Tossa: aventura con guía", img: "/assets/planes/acantilado.jpg", pos: "50% 50%", n: "Kayak, coasteering y escalada con guías locales.", u: "https://getactivetossa.com/" },
      { t: "Submarinismo", img: "/assets/genericas/buceo.jpg", pos: "50% 50%", credito: { a: "Ryland.cairns", l: "CC0", u: "https://commons.wikimedia.org/wiki/File:Scuba_Diving_Samaesan_Island.jpg" }, n: "Bautismos, excursiones de inmersión y cursos, en centros como Super Dive Tossa, Tossa Divers, Dream Dive y L'Àmfora." },
      { t: "Camí de Ronda", img: "/assets/planes/mirador.jpg", pos: "55% 50%", n: "Ruta a pie junto al mar, con vistas a la costa." },
      { t: "Itinerarios a pie oficiales", img: "/assets/planes/acantilado.jpg", pos: "50% 60%", n: "Es Codolar, Cala Pola, Ruixons, Sant Grau y el Puig de ses Cadiretes, según el plano de la Oficina de Turisme." },
      { t: "Poliesportiu municipal", img: "/assets/genericas/padel.jpg", pos: "50% 50%", credito: { a: "Sotos", l: "CC BY-SA 4.0", u: "https://commons.wikimedia.org/wiki/File:Court_de_padel_de_Vic-en-Bigorre_(Hautes-Pyr%C3%A9n%C3%A9es)_1.jpg" }, n: "Piscinas, sauna, spinning y pádel; entrada de un día sin ser socio." }
    ] }] }
  },
  /* Paseando por Tossa. Contenido comprobado (Vila Vella: siete torres, estatua de Ava Gardner en un mirador, Museu Municipal, Far, Sa Roqueta).
     El carrilet = trenecito de Dicotren (enlaces de Javi, 05/10). PENDIENTE: nombres de pastelerías, bisutería y tiendas. Sin orden obligatorio ni tiempos (no verificados). */
  paseos: [
    {
      id: "murallas", t: "Entre las murallas",
      intro: "El recinto medieval de la Vila Vella, único pueblo fortificado que queda en la costa catalana. Sin prisa y con calzado cómodo: las calles son empedradas y con cuestas.",
      paradas: [
        { t: "Murallas y torres", n: "Siete torres del recinto, levantado contra los piratas." },
        { t: "Estatua de Ava Gardner", n: "En uno de los miradores, en recuerdo del rodaje de Pandora y el holandés errante (1950)." },
        { t: "Museu Municipal", n: "Mosaicos de la villa romana y una obra de Chagall. Cerrado por reformas según Tossa Turisme (octubre 2026)." },
        { t: "Ruinas de Sant Vicenç", n: "La antigua iglesia, hoy escenario de conciertos en verano." },
        { t: "Sa Roqueta", n: "El antiguo barrio de pescadores." },
        { t: "El faro", n: "Vistas a toda la bahía." }
      ]
    },
    {
      id: "pueblo", t: "Del pueblo a la playa",
      intro: "El centro de Tossa al pie de la Vila Vella: playa, museos, galerías y tiendas.",
      paradas: [
        { t: "Platja Gran", img: "/assets/planes/platja-gran.jpg", pos: "50% 62%", n: "La playa del pueblo, con las murallas de fondo." },
        { t: "Museu de la Dona", img: "/assets/patrimonio/can-ganga.jpg", pos: "50% 50%", credito: { a: "Mafoso", l: "CC BY-SA 3.0", u: "https://commons.wikimedia.org/wiki/File:Can_Ganga-Tossa-02.JPG" }, n: "La historia de Tossa contada desde las mujeres, en la masía de Can Ganga. Carrer Codolar 4." },
        { t: "Galerías de arte", n: "Art Gallery Blanco Grané y Art Michaeli." },
        { t: "Pastelerías y tiendas típicas", n: "Dulces del pueblo, bisutería y artesanía." }
      ]
    },
    {
      id: "tarde", t: "Para una tarde o una noche",
      intro: "Cuando ya has visto lo de siempre y quieres un plan concreto.",
      paradas: [
        { t: "Cinema Montserrat", n: "Estrenos semanales. Carrer Pola 9." },
        { t: "Bar La Bolera", n: "Cuatro pistas de bolos con ambiente retro. Avinguda Costa Brava 7." },
        { t: "Can Pini", n: "Cocina catalana y marinera." },
        { t: "Sa Muralla", n: "Marisco junto a la muralla." }
      ]
    },
    {
      id: "trenecito", t: "En el trenecito",
      intro: "El trenecito turístico de Dicotren, con audioguía, para conocer Tossa sin caminar. Hay dos recorridos: el Tren Azul por el pueblo y el Tren Verde por dentro de la Vila Vella.",
      paradas: [
        { t: "Tren Azul: por el pueblo", n: "Terminal de autobuses, Paseo del Mar, Av. la Palma, Mar Menuda, Av. Joan Maragall y Rambla Pau Casals. Unos 45 minutos. No entra en la Vila Vella.", u: "https://dicotren.com/" },
        { t: "Tren Verde: hasta el faro", n: "Recorrido por el recinto amurallado hasta el faro y vuelta, con billete de ida y vuelta y parada de unos 15 minutos en la plaza del Faro.", u: "https://dicotren.com/" },
        { t: "Información", n: "Tel. 972 340 241. Fuente: Oficina de Turisme de Tossa de Mar y dicotren.com." }
      ]
    }
  ]
};
