# Caricaturas de Tossa con Gemini: prompts y reglas

Uso previsto: portadas de los puzzles de los peques, ilustraciones de firma (p. ej. el trenecito junto a las murallas) y, más adelante, fondos suaves. No para sustituir fotos reales de lugares.

## Cómo trabajar con Gemini
1. Usa **un solo chat** para todas las imágenes. Genera primero la escena 1, elige la que más guste y **súbela como ancla de estilo** en cada petición siguiente ("mantén exactamente este estilo").
2. Adjunta siempre **1-2 fotos reales de referencia** de tus carpetas (muralla, torres, playa) para que respete la forma de los lugares. Revisa a mano que no cambie el número de torres ni el trazado de la muralla.
3. Cuadradas (1:1), para los puzzles. Guárdalas como JPG de unos 640 px en `assets/juegos/puzzle/` y avísame para añadirlas a la lista.
4. Descarta cualquier imagen con **letras**, logotipos o personas reconocibles.

## Prompt de estilo (pégalo la primera vez)
> Ilustración tipo caricatura para una guía turística infantil y familiar de Tossa de Mar (Costa Brava). Estilo de acuarela y tinta con contornos suaves y formas redondeadas, inspirado en la paleta de Marc Chagall: azul ultramar, ocre cálido, blanco crema y pequeños toques de rojo bermellón. Colores planos y luminosos, sin degradados fotográficos, mucho espacio de cielo y de mar. Composición clara, con elementos grandes y fáciles de reconocer, pensada para hacer un puzzle. Formato cuadrado 1:1. Sin texto, sin letras, sin logotipos y sin personas con rasgos reconocibles (si hay personas, siluetas simples).

## Escenas (añade cada una al prompt de estilo)
1. **El trenecito junto a las murallas:** "Un trenecito turístico azul y alegre con vagones abiertos, circulando junto a la muralla medieval de la Vila Vella con sus torres redondas, el mar detrás y barcas de colores."
2. **La bahía:** "La Platja Gran de Tossa con la Vila Vella amurallada al fondo, torres y faro, sombrillas de colores y barcas varadas en la arena."
3. **Barco de fondo de cristal:** "Un barco turístico con el casco transparente en el fondo, navegando por una cala de agua turquesa; bajo el agua se ven peces y rocas."
4. **Kayaks en la cala:** "Dos kayaks de colores remando junto a unas rocas y pinos en una cala de la Costa Brava, con las murallas de Tossa a lo lejos."
5. **El faro:** "El faro de Tossa en lo alto del promontorio, rodeado de murallas, con gaviotas y el mar azul intenso."
6. **Buceo:** "Un buceador simple y simpático nadando entre peces, estrellas de mar y un pequeño pulpo; el fondo marino de Tossa con rocas y algas."

## Antes de publicar
- Revisar condiciones de uso de las imágenes generadas en la cuenta de Gemini que uses.
- Si la ilustración del trenecito se parece reconociblemente al de Dicotren, valorar avisarles.

## Dorso de las cartas de Parejas (añadido 05/10/2026)
Usa el mismo chat y el mismo estilo que las escenas anteriores. Es una imagen **cuadrada 1:1**, la que se ve al tener la carta boca abajo, así que debe leerse bien muy pequeña (unos 100 px).
> Mantén exactamente el estilo. Dibuja el dorso de una carta de memoria para niños: el trenecito turístico azul y alegre pasando por delante de las murallas y torres redondas de la Vila Vella de Tossa, con el mar turquesa detrás, un sol sonriente y un par de gaviotas. Composición muy sencilla y centrada, colores vivos y contornos gruesos, con un marco o borde decorativo fino alrededor y un poco de margen para recortar esquinas redondeadas. Sin letras ni números.

Guárdala como **`assets/juegos/dorso.png`** (unos 512 × 512 px). Si el archivo existe, la web lo usa como dorso de las cartas automáticamente; si no, sigue mostrando el dorso actual con el monograma «PB».

## Casillas de la oca (por si quieres sustituir mis pictogramas)
El tablero que generó Gemini (05/10/2026) es muy bonito, pero **no sirve tal cual**: los números están mal (18, 15, 36 y 45 salen repetidos, aparece un 99, falta el 22 y varias casillas), la cárcel sale en la 52 y en la 53, los dados en la 24 y en la 26, la posada en la 17 en vez de la 19, y trae personajes que recuerdan a dibujos animados conocidos. Para un tablero funcional, las casillas deben estar bien numeradas.
Lo que sí funciona es pedirle **las ilustraciones por separado**, en el mismo estilo, para colocarlas yo en el tablero con los números correctos. Una imagen cuadrada (1:1) por cada una, **sin números ni letras**, fondo de color liso:
> Mantén el estilo de dibujo animado colorido de las caricaturas de Tossa. Dibuja SOLO el motivo, centrado, sin texto ni números, sobre fondo de color liso: 1) una oca blanca simpática de pie, 2) un puente de piedra sobre un riachuelo, 3) dos dados grandes de colores, 4) una posada con cama y farolillo, 5) un pozo de piedra con cubo, 6) un laberinto rojo visto desde arriba, 7) una celda con barrotes y una oca asomada, 8) una calavera divertida y nada terrorífica con sombrero, 9) el jardín de la oca: un estanque con tres ocas y una copa dorada.
Guárdalas como `assets/juegos/oca/oca.png`, `puente.png`, `dados.png`, `posada.png`, `pozo.png`, `laberinto.png`, `carcel.png`, `calavera.png` y `jardin.png` (unos 256 px) y las sustituyo por los pictogramas.
