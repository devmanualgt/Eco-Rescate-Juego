export const dialogues = () => ({
  home: {
    start: 'Inicio',
    nodes: {
      Inicio: {
        titulo: '🌍 ¡Bienvenido a la gran aventura verde! 🌿',
        personaje: 'Hero',
        text: 'El planeta está en peligro… ¡la Basuraleza, un monstruo hecho de desechos tóxicos, está cubriendo el mundo de basura! 🗑️👹 Los bosques, ríos, playas y ciudades están tristes y sucios',
        options: [
          { text: 'Salir', next: 'StartScene', scena: true },
          { text: 'Continuar', next: 'Historia' },
        ],
      },
      Historia: {
        titulo: '🌍 ¡Bienvenido a la gran aventura verde! 🌿',
        text: '¡Joven héroe! Te necesito. Solo tú puedes limpiar el \n mundo y devolverle la vida. \n ¿Estás listo para salvar el mundo, uno a uno, contenedor a contenedor? ',
        options: [
          { text: 'Salir', next: 'StartScene', scena: true },
          { text: 'Si, acepto', next: 'Jugar' },
        ],
      },
      Jugar: {
        titulo: '🌍 ¡Bienvenido a la gran aventura verde! 🌿',
        text: 'Usa las flechas del teclado para poder moverte',
        img: 'flechas',
        options: [{ text: 'Jugar', next: '' }],
      },
    },
  },

  box: {
    start: 'Inicio',
    nodes: {
      Inicio: {
        titulo: '🌳 El Bosque de las Mil Semillas 🌱',
        personaje: 'Hero',
        text: '¡Has llegado al mágico *Bosque de las Mil Semillas*! 🌱✨ Pero algo anda mal... 😟 ¡Está lleno de basura! 🗑️ Los árboles están tristes y los animalitos piden ayuda 🐿️💧. ¡Solo tú puedes salvarlo!',
        options: [
          { text: 'Salir', next: '' },
          { text: '¡Vamos a ayudar!', next: 'Abrir' },
        ],
      },
      Abrir: {
        titulo: '🌳 El Bosque de las Mil Semillas 🌱',
        text: '🌟 ¿Estás listo para convertirte en un verdadero héroe verde? 🌿 Usa tus habilidades para limpiar, reciclar y devolverle la vida al bosque. ¡La naturaleza cuenta contigo! 💪💚',
        options: [
          { text: 'En otro momento', next: '' },
          {
            text: '¡Sí, acepto!',
            next: 'CutTrashScene',
            scena: true,
          },
        ],
      },
      Jugar: {
        text: '🎲 ¡Hora de divertirse! 🌟 Elige tu misión y ayuda al planeta mientras juegas. 🌎💫',
        options: [{ text: 'Volver al bosque', next: 'Inicio' }],
      },
    },
  },

  organico: {
    start: 'Intro',
    nodes: {
      Intro: {
        titulo: '🌿 Bote de color 🟢, !Organico!',
        personaje: 'Hero',
        text: 'Aquí solo van restos de comida y cosas naturales.\n¡Nada de plástico!',
        img: 'manzana',
        options: [{ text: 'Entendido', next: 'Org2' }],
      },
      Org2: {
        titulo: '🌿 Bote de color 🟢, !Organico!',
        personaje: 'Hero',
        text: '¿Tienes cáscaras de frutas o verduras? ¡Este es su lugar!',
        img: 'manzana',
        options: [{ text: 'Ok', next: 'Org3' }],
      },
      Org3: {
        titulo: '🌿 Bote de color 🟢, !Organico!',
        personaje: 'Hero',
        text: 'Todo lo que pueda volverse abono va aquí.',
        img: 'manzana',
        options: [{ text: 'Gracias', next: 'Org4' }],
      },
      Org4: {
        titulo: '🌿 Bote de color 🟢, !Organico!',
        personaje: 'Hero',
        text: 'No pongas empaques ni basura plástica aquí, por favor.',
        img: 'manzana',
        options: [{ text: 'Lo recordaré', next: '' }],
      },
    },
  },

  reciclaje: {
    start: 'Intro',
    nodes: {
      Intro: {
        titulo: '♻ Bote de color 🔵, !Reciclar!',
        personaje: 'Hero',
        text: 'Este bote es para papel limpio, botellas, latas y frascos.',
        img: 'pepsi',
        options: [{ text: 'Entendido', next: 'Rec2' }],
      },
      Rec2: {
        titulo: '♻ Bote de color 🔵, !Reciclar!',
        personaje: 'Hero',
        text: 'Recuerda: ¡todo debe estar limpio y seco!',
        img: 'pepsi',
        options: [{ text: 'Claro', next: 'Rec3' }],
      },
      Rec3: {
        titulo: '♻ Bote de color 🔵, !Reciclar!',
        personaje: 'Hero',
        text: 'Si es vidrio, metal, cartón o plástico, y no está sucio, va aquí.',
        img: 'papel',
        options: [{ text: 'Bien', next: 'Rec4' }],
      },
      Rec4: {
        titulo: '♻ Bote de color 🔵, !Reciclar!',
        personaje: 'Hero',
        text: 'Evita mezclar basura sucia. Eso daña todo el esfuerzo.',
        img: 'papel',
        options: [{ text: '¡Lo haré bien!', next: '' }],
      },
    },
  },

  noreciclaje: {
    start: 'Intro',
    nodes: {
      Intro: {
        titulo: '🗑️ Bote de color ⚫️, !NO-Reciclar!',
        personaje: 'Hero',
        text: 'Aquí va lo que no se puede reciclar: pañales, servilletas sucias, envoltorios grasientos.',
        img: 'lata',
        options: [{ text: 'Entendido', next: 'NoRec2' }],
      },
      NoRec2: {
        titulo: '🗑️ Bote de color ⚫️, !NO-Reciclar!',
        personaje: 'Hero',
        text: 'Si está muy sucio o es basura contaminada, va aquí.',
        img: 'lata',
        options: [{ text: 'Claro', next: 'NoRec3' }],
      },
      NoRec3: {
        titulo: '🗑️ Bote de color ⚫️, !NO-Reciclar!',
        personaje: 'Hero',
        text: 'Este bote ayuda a que no se arruinen los materiales reciclables.',
        img: 'lata',
        options: [{ text: 'Bien pensado', next: 'NoRec4' }],
      },
      NoRec4: {
        titulo: '🗑️ Bote de color ⚫️, !NO-Reciclar!',
        personaje: 'Hero',
        text: 'Si dudas y está sucio, mejor tíralo aquí.',
        img: 'lata',
        options: [{ text: 'Lo recordaré', next: '' }],
      },
    },
  },

  posion: {
    start: 'Inicio',
    nodes: {
      Inicio: {
        text: 'Parece que esta caja está bloqueada.',
        options: [{ text: 'Regresar', next: '' }],
      },
    },
  },

  game1: {
    start: 'Inicio',
    nodes: {
      Inicio: {
        titulo: '🌳 El Bosque de las Mil Semillas 🌱',
        personaje: 'Hero',
        text: 'Tu misión es mover el bote de basura correcto y atrapar los objetos según su tipo',
        options: [
          { text: 'Salir', next: 'BosqueEscena', scena: true },
          { text: '¡Como jugar!', next: 'Abrir' },
        ],
      },
      Abrir: {
        titulo: '🎮 ¿Cómo jugar?',
        text: '👆 Usa las flechas del teclado para mover el bote. \n🟩 Bote Verde = 🍎 Orgánico (comida, hojas, cáscaras)\n🔵 Bote Azul = 🔄 Reciclaje (plástico, papel, cartón)\n⚫ Bote Negro = 🚫 No reciclable (pañales, papel sucio)',
        img: 'flechas',
        options: [
          { text: 'Regresar', next: 'Inicio' },
          {
            text: 'Jugemos!',
            next: '',
          },
        ],
      },
    },
  },
});

export const getIntroDialogue = () => ({
  dialogueData: {
    start: 'Inicio',
    nodes: {
      Inicio: {
        text: '¡Hola aventurero! ¿Listo para comenzar?',
        options: [
          { text: 'Sí', next: 'Iniciar' },
          { text: 'No', next: 'Salir' },
        ],
      },
      Iniciar: {
        text: '¡Prepárate para la misión!',
        options: [],
      },
      Salir: {
        text: 'Vuelve cuando estés listo.',
        options: [],
      },
    },
  },
  startNode: 'Inicio',
});

export const getHelpDialogue = () => ({
  dialogueData: {
    start: 'Ayuda',
    nodes: {
      Ayuda: {
        text: '¡Aquí aprenderás cómo jugar!',
        options: [{ text: 'Regresar', next: 'Inicio' }],
      },
      Inicio: {
        text: '¡Hola aventurero! ¿Listo para comenzar?',
        options: [
          { text: 'Sí', next: 'Iniciar' },
          { text: 'No', next: 'Salir' },
        ],
      },
    },
  },
  startNode: 'Ayuda',
});

export const historyInit = () => ({
  home: {
    start: 'Inicio',
    nodes: {
      Inicio: {
        titulo: '¡Bienvenido!',
        personaje: 'Hero',
        text: 'Bienvenido al juego...\n\nCuánta gente tira desechos porque no sabe cómo reciclar los residuos.\n\n¿Aceptas el reto?',
        options: [
          { text: 'No, gracias', next: '' },
          { text: 'Sí, acepto', next: 'CutTrashScene', scena: true },
        ],
      },
      Historia: {
        text: 'Sabías que mientras más reciclas, mejor es la vida en el planeta! 🌎',
        options: [
          { text: '', next: '' },
          { text: 'Continuar', next: 'Inicio' },
        ],
      },
      Jugar: {
        text: '¡Juguemos algo nuevo!',
        options: [{ text: 'Regresar', next: 'Inicio' }],
      },
    },
  },

  storySteps: [
    {
      text: '',
      options: ['Sí, acepto', ''],
    },
    {
      text: '¡Sabías que mientras más reciclas, mejor es la vida en el planeta! 🌎',
      options: ['Continuar'],
    },
    {
      text: 'Caminas por las calles de la ciudad.\nNotas que los botes de basura están llenos y todo está mezclado: plásticos, comida, papel…',
      options: [
        'Separar los residuos correctamente',
        'Ignorar y seguir caminando',
      ],
    },
    {
      text: 'Separas los residuos correctamente.\n¡Muy bien! Así ayudas a reducir la contaminación del aire, suelo y agua.',
      options: ['Seguir explorando'],
    },
    {
      text: 'Ignoras la basura y sigues caminando.\nLa basura sigue acumulándose y un mal olor invade el ambiente.\n¿Sabías que ignorar el reciclaje puede causar enfermedades y contaminar fuentes de agua? 💧',
      options: ['Volver a intentarlo'],
    },
  ],
});
