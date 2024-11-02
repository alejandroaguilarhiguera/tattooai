import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import rows from '../../../tattoo_combinations.json';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;
type Location =
  'arms'
| 'hands'
| 'neck'
| 'chest'
| 'back'
| 'ribsAndSides'
| 'abdomen'
| 'hips'
| 'legs'
| 'ankles'
| 'feet'
| 'face'
| 'ears'
| 'nape'
| 'lowerBack'
| 'buttocks'
| 'innerThighs'
| 'knees'
| 'armpits'
| 'fingers'
| 'betweenFingers'
| 'calves'
| 'breasts'
| 'scalp'
| 'innerForearm'

type LevelDetail = 'Easy' | 'Medium' | 'Hard';

type StyleTattoo = 
  'realism'
| 'traditionalOldSchool'
| 'neoTraditional'
| 'watercolor'
| 'blackwork'
| 'dotworkOrPointillism'
| 'tribal'
| 'geometric'
| 'minimalist'
| 'japanese'
| 'biomechanical'
| 'surrealism'
| 'newSchool'
| 'fineLine'
| 'chicano'
| 'scriptOrLettering'
| 'ornamental'
| 'negativeOrNegativeSpace'
| 'ignorantStyle'
| 'whiteInkTattoo'
| 'trashPolka'
| 'blackAndGrey'
| 'skeletonsOrSkulls'
| 'microRealism'

const tattooStyles = [
  'Realismo',
'Tradicional o Old School',
'Neotradicional',
'Acuarela',
'Blackwork',
'Dotwork o Puntillismo',
'Tribal',
'Geométrico',
'Minimalista',
'Japoneses (Irezumi)',
'Biomecánico',
'Surrealista',
'New School',
'Fine Line',
'Chicano',
'Escrito o Lettering',
'Ornamental',
'Negativo o Negativo Space',
'Ignorant Style',
'Tatuaje Blanco',
'Trash Polka',
'Gris y Sombra (Black and Grey)',
'Esqueletos o Cráneos',
'Microrealismo',
];

const locations = [
'Brazos',
'Manos',
'Cuello',
'Pecho',
'Espalda',
'Costillas y costados',
'Abdomen',
'Caderas',
'Piernas',
'Tobillos',
'Pies',
'Rostro',
'Orejas',
'Nuca',
'Zona lumbar',
'Glúteos',
'Muslos internos',
'Rodillas',
'Axilas',
'Dedos de las manos',
'Entre los dedos',
'Pantorrillas',
'Senos',
'Cuero cabelludo',
'Área del antebrazo interno',
]


interface Row {
  location: Location,
  levelDetail: LevelDetail,
  styleTattoo: StyleTattoo,
  spacePerHour: number,
  pricePerHour: number,
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // 1.	Realismo: Diseños que buscan imitar la realidad de manera precisa, como retratos, animales o escenas realistas.
	// 2.	Tradicional o Old School: Estilo clásico con líneas gruesas, colores vibrantes y temas como anclas, corazones y rosas.
	// 3.	Neotradicional: Una evolución del estilo tradicional, con más detalles, sombras y una paleta de colores más amplia.
	// 4.	Acuarela: Simula el efecto de pintura en acuarela, con colores difuminados y sin líneas definidas.
	// 5.	Blackwork: Utiliza únicamente tinta negra, con patrones geométricos o diseños grandes y oscuros.
	// 6.	Dotwork o Puntillismo: Compuesto por puntos para crear sombreados y formas, generando texturas interesantes.
	// 7.	Tribal: Inspirado en patrones de diferentes culturas tribales, caracterizado por líneas gruesas y formas geométricas.
	// 8.	Geométrico: Diseños basados en figuras geométricas, patrones y simetría.
	// 9.	Minimalista: Tatuajes simples y pequeños, con líneas finas y sin muchos detalles. Suelen ser símbolos o dibujos pequeños.
	// 10.	Japoneses (Irezumi): Inspirados en el arte japonés tradicional, con motivos como dragones, peces koi, y flores de cerezo.
	// 11.	Biomecánico: Simula piezas mecánicas y robóticas, integrándolas con la anatomía del cuerpo.
	// 12.	Surrealista: Combina elementos realistas con aspectos fantásticos o abstractos, creando escenas imposibles.
	// 13.	New School: Colorido, caricaturesco y exagerado, con inspiración en el arte de cómics y grafiti.
	// 14.	Fine Line: Diseños detallados con líneas muy finas y delicadas, a menudo utilizados en retratos y tatuajes minimalistas.
	// 15.	Chicano: Tatuajes con temas de cultura chicana, a menudo en blanco y negro, con motivos religiosos, retratos y frases.
	// 16.	Escrito o Lettering: Diseños de palabras, frases o letras en diferentes estilos de tipografía.
	// 17.	Ornamental: Inspirado en patrones decorativos, como mandalas, flores y detalles inspirados en el arte de la joyería.
	// 18.	Negativo o Negativo Space: Usa el espacio en blanco de la piel para crear figuras y contrastes.
	// 19.	Ignorant Style: Caracterizado por trazos toscos e intencionalmente imperfectos, similar a dibujos de niños o estilo “naïf”.
	// 20.	Tatuaje Blanco: Hecho solo con tinta blanca, generando un efecto sutil y minimalista en la piel.
	// 21.	Trash Polka: Una mezcla de estilos que utiliza principalmente negro y rojo, combinando elementos abstractos y realistas.
	// 22.	Gris y Sombra (Black and Grey): Usa tinta negra diluida para crear diferentes tonos de gris y un efecto sombreado suave.
	// 23.	Esqueletos o Cráneos: Diseños de calaveras o esqueletos, populares en varios estilos, especialmente en realismo y tradicional.
	// 24.	Microrealismo: Realismo en formato pequeño, con mucho detalle en diseños de tamaño reducido.

  // 1.	Brazos: Incluyendo hombros, bíceps, antebrazos y muñecas.
	// 2.	Manos: Dorso de la mano, dedos y nudillos.
	// 3.	Cuello: Parte frontal, lateral o posterior del cuello.
	// 4.	Pecho: Área pectoral, clavículas y esternón.
	// 5.	Espalda: Completa, alta, baja o en las escápulas.
	// 6.	Costillas y costados: Una de las zonas más sensibles.
	// 7.	Abdomen: Desde el estómago hasta los laterales.
	// 8.	Caderas: A los lados o alrededor de la pelvis.
	// 9.	Piernas: Muslos, pantorrillas y espinillas.
	// 10.	Tobillos: Interior o alrededor del hueso del tobillo.
	// 11.	Pies: Empeine, laterales y dedos de los pies.
	// 12.	Rostro: Incluyendo mejillas, frente, sienes y mandíbula.
	// 13.	Orejas: Lóbulos, parte posterior o interior de la oreja.
	// 14.	Nuca: Base de la cabeza, sobre la columna.
	// 15.	Zona lumbar: Parte baja de la espalda.
	// 16.	Glúteos: Una zona más discreta, en cada lado.
	// 17.	Muslos internos: Parte interior del muslo.
	// 18.	Rodillas: Alrededor o sobre las rodillas.
	// 19.	Axilas: Zona muy sensible y poco común.
	// 20.	Dedos de las manos: En los laterales o nudillos.
	// 21.	Entre los dedos: Zonas entre los dedos de manos y pies.
	// 22.	Pantorrillas: Parte trasera de la pierna.
	// 23.	Senos: En el caso de mujeres, área superior o debajo del seno.
	// 24.	Cuero cabelludo: Bajo el cabello, parcial o totalmente rapado.
	// 25.	Área del antebrazo interno: A lo largo del lado interno del brazo.

  const minPrice = 800; // Precio de los materiales por session/ cada 8 horas
  const maxPricePerHour = 500; // Precio maximo por hora
  const minPricePerHour = 200; // Precio minimo por hora

/**
  [Ya definido]
  1.	Tamaño: El área del tatuaje influye mucho en el precio, ya que los tatuajes más grandes requieren
  más tiempo y detalle.

  [Ya definido]
	2.	Ubicación en el cuerpo: Algunas zonas son más difíciles de tatuar
    (por ejemplo, costillas, manos, cuello), lo cual puede aumentar el precio debido a la complejidad o sensibilidad del área.
	


  [No se como aplicar el nivel de detalle]
  3.	Nivel de detalle: Los diseños más detallados y complejos demandan mayor habilidad y tiempo,
    lo cual se refleja en el costo.
	

  [Ya definido]
  4.	Estilo del tatuaje: Algunos estilos, como el realismo o los tatuajes de acuarela,
    requieren técnicas avanzadas y habilidades específicas, lo que incrementa el precio.
	
  [Pendiente]  
  5.	Tiempo estimado: El tiempo necesario para completar el tatuaje es un factor importante,
    ya que muchos tatuadores cobran por hora.
	
  [Pendiente]
  6.	Color o blanco y negro: Los tatuajes a color suelen ser más caros,
    ya que requieren más tiempo y materiales, y la aplicación del color es más compleja.
	


  [No aplica - no definido aun]
  7.	Experiencia del tatuador: Tatuadores con más experiencia
    o con una reputación establecida pueden cobrar más por su trabajo.
	
  [No aplica porque la IA lo genera]
  8.	Diseño personalizado vs. diseño estándar:
    Si el tatuaje es un diseño personalizado creado especialmente para el cliente,
    el tatuador puede cobrar extra por el tiempo dedicado al diseño y desarrollo de la idea.
	
  [Ya definido]
  9.	Materiales utilizados: La calidad de las tintas,
    agujas y otros materiales también influye en el costo,
      especialmente si el tatuador usa materiales de gama alta o especializados.
	
  [No aplica porque el cotizador es para nuevos tatuajes]
  10.	Correcciones o sesiones adicionales: Si se necesita retocar el tatuaje
    después de la primera sesión, o si se realiza en varias sesiones,
    el costo puede aumentar.
 */


  const system = [
    `Eres un exelente cotizador de tatuaje para posibles clientes\n`,
    ``,
    ``,
    ``,
    ``,
    `Al final cuando el usuario llene todas las variantes para el `,
    `tatuaje muestra el tiempo aproximado que llevara el tatuaje`,
    `con horas completas\n`,
    `Ubicaciones donde se puede tatuar: ${locations.join(', ')}\n`,
    `Estilos de tatuaje que se pueden hacer: ${tattooStyles.join(', ')}\n`,
    // `Data json: ${JSON.stringify(rows)}` // Demaciada informacion vectorizada
  ].join('');

  // Call the language model
  const result = await streamText({
    model: openai('gpt-4o'),
    maxTokens: 256*2, // artificial limit for demo purposes
    maxSteps: 10,
    experimental_continueSteps: true,
    system,
    messages,
  });

  return result.toDataStreamResponse();
}
