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
