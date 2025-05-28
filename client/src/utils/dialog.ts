export const dialogues = () => ({
  home: {
    start: 'Inicio',
    nodes: {
      Inicio: {
        titulo: '¡Bienvenido!',
        personaje: 'Hero',
        text: 'Bienvenido al juego...\n\nCuánta gente tira desechos porque no sabe cómo reciclar los residuos.\n\n¿Aceptas el reto?',
        options: [
          { text: 'No, gracias', next: '' },
          { text: 'Sí, acepto', next: 'Historia' },
        ],
      },
      Historia: {
        text: 'Sabías que mientras más reciclas, mejor es la vida en el planeta! 🌎',
        options: [{ text: 'Continuar', next: '' }],
      },
      Jugar: {
        text: '¡Juguemos!',
        options: [{ text: 'Regresar', next: '' }],
      },
    },
  },

  box: {
    start: 'Inicio',
    nodes: {
      Inicio: {
        titulo: '¡Bienvenido!',
        personaje: 'Hero',
        text: '¡Encontraste una caja misteriosa!',
        options: [
          { text: 'Salir', next: '' },
          { text: 'Abrir', next: 'CutTrashScene', scena: true },
        ],
      },
      Abrir: {
        text: 'Dentro hay un mensaje antiguo...',
        options: [{ text: 'Regresar', next: 'Inicio' }],
      },
      Jugar: {
        text: '¡Juguemos algo nuevo!',
        options: [{ text: 'Regresar', next: 'Inicio' }],
      },
    },
  },

  organico: {
    start: 'Intro',
    nodes: {
      Intro: {
        personaje: 'Hero',
        text: 'Aquí solo van restos de comida y cosas naturales. ¡Nada de plástico!',
        options: [{ text: 'Entendido', next: 'Org2' }],
      },
      Org2: {
        personaje: 'Hero',
        text: '¿Tienes cáscaras de frutas o verduras? ¡Este es su lugar!',
        options: [{ text: 'Ok', next: 'Org3' }],
      },
      Org3: {
        personaje: 'Hero',
        text: 'Todo lo que pueda volverse abono va aquí.',
        options: [{ text: 'Gracias', next: 'Org4' }],
      },
      Org4: {
        personaje: 'Hero',
        text: 'No pongas empaques ni basura plástica aquí, por favor.',
        options: [{ text: 'Lo recordaré', next: '' }],
      },
    },
  },

  reciclable: {
    start: 'Intro',
    nodes: {
      Intro: {
        personaje: 'Hero',
        text: 'Este bote es para papel limpio, botellas, latas y frascos.',
        options: [{ text: 'Entendido', next: 'Rec2' }],
      },
      Rec2: {
        personaje: 'Hero',
        text: 'Recuerda: ¡todo debe estar limpio y seco!',
        options: [{ text: 'Claro', next: 'Rec3' }],
      },
      Rec3: {
        personaje: 'Hero',
        text: 'Si es vidrio, metal, cartón o plástico, y no está sucio, va aquí.',
        options: [{ text: 'Bien', next: 'Rec4' }],
      },
      Rec4: {
        personaje: 'Hero',
        text: 'Evita mezclar basura sucia. Eso daña todo el esfuerzo.',
        options: [{ text: '¡Lo haré bien!', next: '' }],
      },
    },
  },

  noReciclable: {
    start: 'Intro',
    nodes: {
      Intro: {
        personaje: 'Hero',
        text: 'Aquí va lo que no se puede reciclar: pañales, servilletas sucias, envoltorios grasientos.',
        options: [{ text: 'Entendido', next: 'NoRec2' }],
      },
      NoRec2: {
        personaje: 'Hero',
        text: 'Si está muy sucio o es basura contaminada, va aquí.',
        options: [{ text: 'Claro', next: 'NoRec3' }],
      },
      NoRec3: {
        personaje: 'Hero',
        text: 'Este bote ayuda a que no se arruinen los materiales reciclables.',
        options: [{ text: 'Bien pensado', next: 'NoRec4' }],
      },
      NoRec4: {
        personaje: 'Hero',
        text: 'Si dudas y está sucio, mejor tíralo aquí.',
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
  noreciclaje: {
    start: 'Inicio',
    nodes: {
      Inicio: {
        text: '¡Cuidado! Este bote no es para reciclar.',
        options: [{ text: 'Regresar', next: '' }],
      },
    },
  },
  reciclaje: {
    start: 'Inicio',
    nodes: {
      Inicio: {
        text: '¡Bien hecho! Este es el bote correcto para reciclar.',
        options: [{ text: 'Regresar', next: '' }],
      },
    },
  },

  organico: {
    start: 'Inicio',
    nodes: {
      Inicio: {
        text: '¡Genial! Este es el bote para residuos orgánicos.',
        options: [{ text: 'Regresar', next: '' }],
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
