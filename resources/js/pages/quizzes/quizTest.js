export const quizTestData = {
    title: 'Test Quiz sur les 3AC pour les élèves de niveau 3',
    questions: [
        {
            question_text: "Quelle est la valeur de x dans l'équation 3x + 5 = 14 ?",
            question_type: 'multiple_choice',
            options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'],
            correct_answer: 'x = 3',
            explanation: 'Pour trouver x, soustrayez 5 des deux côtés : 3x = 9. Ensuite, divisez par 3 : x = 3.',
            points: 1,
        },
        {
            question_text: "Calculez l'aire d'un rectangle avec une longueur de 5 cm et une largeur de 3 cm.",
            question_type: 'problem_solving',
            options: [],
            correct_answer: '15 cm²',
            explanation: "L'aire d'un rectangle se calcule en multipliant la longueur par la largeur : 5 cm * 3 cm = 15 cm².",
            points: 1,
        },
        {
            question_text: 'Quel est le résultat de 7 * 8 ?',
            question_type: 'multiple_choice',
            options: ['48', '56', '64', '72'],
            correct_answer: '56',
            explanation: '7 multiplié par 8 donne 56.',
            points: 1,
        },
        {
            question_text: "Simplifiez l'expression 2x + 3x - x.",
            question_type: 'problem_solving',
            options: [],
            correct_answer: '4x',
            explanation: 'Combinez les termes similaires : 2x + 3x - x = (2 + 3 - 1)x = 4x.',
            points: 1,
        },
        {
            question_text: 'Quelle est la moitié de 18 ?',
            question_type: 'multiple_choice',
            options: ['8', '9', '10', '12'],
            correct_answer: '9',
            explanation: 'La moitié de 18 est 9, car 18 / 2 = 9.',
            points: 1,
        },
    ],
};

const userResponses = [
    { quiz_id: '8', question_id: 31, user_answer: 'x = 3', is_correct: true },
    { quiz_id: '8', question_id: 32, user_answer: 'x', is_correct: false },
    { quiz_id: '8', question_id: 33, user_answer: '56', is_correct: true },
    { quiz_id: '8', question_id: 34, user_answer: 'x', is_correct: false },
    { quiz_id: '8', question_id: 35, user_answer: '10', is_correct: false },
];
