export const dialogues = () => ({
  box: {
    start: 'Inicio',
    nodes: {
      Inicio: {
        titulo: '¡Bienvenido!',
        personaje: 'Hero',
        text: '¡Encontraste una caja misteriosa!',
        options: [
          { text: 'Salir', next: '' },
          { text: 'Abrir', next: 'VidasEscena', scena: true },
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
  posion: {
    start: 'Inicio',
    nodes: {
      Inicio: {
        text: 'Parece que esta caja está bloqueada.',
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
