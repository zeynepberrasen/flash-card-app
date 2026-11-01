import React from 'react';
import { createWidget } from 'expo-widgets';
import { Column, Row, Text, Button, Spacer } from '@expo/ui/jetpack-compose';
import {
  paddingAll,
  padding,
  background,
  cornerRadius,
  fillMaxWidth,
  weight,
} from '@expo/ui/jetpack-compose/modifiers';
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

/**
 * Official Home Screen Flashcard Widget for Android (Jetpack Compose / Glance).
 */
export const FlashcardWidget = createWidget<FlashcardWidgetProps>(
  'FlashcardWidget',
  (props) => {
    'widget';

    const hasCards = props.hasCards && props.totalCards > 0;
    const isRevealed = props.isRevealed;

    return (
      <Column
        modifiers={[
          fillMaxWidth(),
          paddingAll(14),
          background('#FFFFFF'),
          cornerRadius(16),
        ]}
      >
        {/* Top Header: Deck Name & Card Counter */}
        <Row modifiers={[fillMaxWidth(), padding(0, 0, 0, 6)]}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: 'bold',
              color: '#4F46E5',
            }}
          >
            {props.deckName ? props.deckName.toUpperCase() : 'FLASHCARDS'}
          </Text>

          <Spacer modifiers={[weight(1)]} />

          {hasCards ? (
            <Text
              style={{
                fontSize: 11,
                fontWeight: '600',
                color: '#64748B',
              }}
            >
              {props.cardIndex + 1} / {props.totalCards}
            </Text>
          ) : null}
        </Row>

        {/* Question & Answer Card Body */}
        {hasCards ? (
          <Column modifiers={[fillMaxWidth(), padding(0, 4, 0, 6)]}>
            <Text
              style={{
                fontSize: 10,
                fontWeight: 'bold',
                color: '#6366F1',
              }}
            >
              QUESTION
            </Text>

            <Text
              style={{
                fontSize: 15,
                fontWeight: 'bold',
                color: '#0F172A',
              }}
            >
              {props.question || 'No question'}
            </Text>

            {isRevealed ? (
              <Column modifiers={[fillMaxWidth(), padding(0, 4, 0, 0)]}>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: 'bold',
                    color: '#10B981',
                  }}
                >
                  ANSWER
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '500',
                    color: '#334155',
                  }}
                >
                  {props.answer}
                </Text>
              </Column>
            ) : (
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '500',
                  color: '#94A3B8',
                }}
              >
                Answer hidden • Tap "Reveal" below
              </Text>
            )}
          </Column>
        ) : (
          /* Empty Deck State */
          <Column modifiers={[fillMaxWidth(), padding(0, 8, 0, 8)]}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: 'bold',
                color: '#0F172A',
              }}
            >
              No flashcards in deck
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: '#64748B',
              }}
            >
              Tap to open the app and add flashcards.
            </Text>
          </Column>
        )}

        {/* Interactive Controls Row */}
        {hasCards ? (
          <Row modifiers={[fillMaxWidth(), padding(0, 6, 0, 0)]}>
            {/* Reveal Answer Button */}
            <Button
              {...({ target: 'reveal' } as any)}
              onClick={() => {
                return {
                  ...props,
                  isRevealed: !props.isRevealed,
                };
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: isRevealed ? '#64748B' : '#4F46E5' }}>
                {isRevealed ? 'Hide Answer' : 'Reveal Answer'}
              </Text>
            </Button>

            <Spacer modifiers={[weight(1)]} />

            {/* Open App Button */}
            <Button
              {...({ target: 'open_app' } as any)}
              onClick={() => {
                const cardList = props.cards && props.cards.length > 0 ? props.cards : [];
                const total = cardList.length > 0 ? cardList.length : props.totalCards;
                const nextIdx = total > 0 ? (props.cardIndex + 1) % total : 0;
                const nextCard = cardList[nextIdx];

                return {
                  ...props,
                  cardIndex: nextIdx,
                  cardId: nextCard ? nextCard.id : props.cardId,
                  question: nextCard ? nextCard.question : props.question,
                  answer: nextCard ? nextCard.answer : props.answer,
                  isRevealed: false,
                };
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#0F172A' }}>
                Open App →
              </Text>
            </Button>
          </Row>
        ) : (
          <Row modifiers={[fillMaxWidth()]}>
            <Button
              {...({ target: 'open_app' } as any)}
              onClick={() => {
                return props;
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: '#4F46E5',
                }}
              >
                Open Flashcard App →
              </Text>
            </Button>
          </Row>
        )}
      </Column>
    );
  },
  initialWidgetProps
);
