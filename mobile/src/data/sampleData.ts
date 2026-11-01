import { Deck } from '../types';

export const sampleDecks: Deck[] = [
  {
    id: 'deck-vocab',
    name: 'English Vocabulary',
    description: 'Common English words and their definitions for everyday communication.',
    createdAt: 1710000000000,
    cards: [
      {
        id: 'card-v1',
        question: 'What does "Abundant" mean?',
        answer: 'Existing or available in large quantities; plentiful.',
        createdAt: 1710000000000,
        correctCount: 0,
        incorrectCount: 0,
      },
      {
        id: 'card-v2',
        question: 'What does "Reluctant" mean?',
        answer: 'Unwilling and hesitant; disinclined.',
        createdAt: 1710000000000,
        correctCount: 0,
        incorrectCount: 0,
      },
      {
        id: 'card-v3',
        question: 'What does "Resilient" mean?',
        answer: 'Able to withstand or recover quickly from difficult conditions.',
        createdAt: 1710000000000,
        correctCount: 0,
        incorrectCount: 0,
      },
      {
        id: 'card-v4',
        question: 'What does "Candid" mean?',
        answer: 'Truthful and straightforward; frank.',
        createdAt: 1710000000000,
        correctCount: 0,
        incorrectCount: 0,
      },
    ],
  },
  {
    id: 'deck-prog',
    name: 'Programming Basics',
    description: 'Core concepts and terminology for software development.',
    createdAt: 1710000100000,
    cards: [
      {
        id: 'card-p1',
        question: 'What is a variable?',
        answer: 'A named container used to store data values in a program.',
        createdAt: 1710000100000,
        correctCount: 0,
        incorrectCount: 0,
      },
      {
        id: 'card-p2',
        question: 'What is a function?',
        answer: 'A reusable block of code designed to perform a particular task.',
        createdAt: 1710000100000,
        correctCount: 0,
        incorrectCount: 0,
      },
      {
        id: 'card-p3',
        question: 'What is an array?',
        answer: 'An ordered list or collection of elements, typically indexed by numbers.',
        createdAt: 1710000100000,
        correctCount: 0,
        incorrectCount: 0,
      },
      {
        id: 'card-p4',
        question: 'What is a loop?',
        answer: 'A control structure that repeats a block of code while a condition is met.',
        createdAt: 1710000100000,
        correctCount: 0,
        incorrectCount: 0,
      },
    ],
  },
];
