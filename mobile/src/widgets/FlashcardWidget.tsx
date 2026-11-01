import { Platform } from 'react-native';
import { FlashcardWidgetProps } from '../types';

export const initialWidgetProps: FlashcardWidgetProps = {
  deckId: 'deck-vocab',
  deckName: 'English Vocabulary',
  cardId: 'card-v1',
  question: 'What does "Abundant" mean?',
  answer: 'Existing or available in large quantities; plentiful.',
  isRevealed: false,
  cardIndex: 0,
  totalCards: 4,
  hasCards: true,
  deepLinkUrl: 'mobile://deck/deck-vocab',
  cards: [
    {
      id: 'card-v1',
      question: 'What does "Abundant" mean?',
      answer: 'Existing or available in large quantities; plentiful.',
    },
    {
      id: 'card-v2',
      question: 'What does "Reluctant" mean?',
      answer: 'Unwilling and hesitant; disinclined.',
    },
  ],
};

// Platform-specific widget loader
let widgetModule: { FlashcardWidget: any; initialWidgetProps: FlashcardWidgetProps };

if (Platform.OS === 'android') {
  widgetModule = require('./FlashcardWidget.android');
} else if (Platform.OS === 'ios') {
  widgetModule = require('./FlashcardWidget.ios');
} else {
  // Web / fallback mock
  widgetModule = {
    FlashcardWidget: {
      reload: () => {},
      updateSnapshot: () => {},
      updateTimeline: () => {},
      getTimeline: async () => [],
    },
    initialWidgetProps,
  };
}

export const FlashcardWidget = widgetModule.FlashcardWidget;
