import React from 'react';
import { createWidget } from 'expo-widgets';
import { VStack, HStack, Text, Button, Spacer } from '@expo/ui/swift-ui';
import {
  padding,
  background,
  foregroundStyle,
  font,
  bold,
  cornerRadius,
  widgetURL,
} from '@expo/ui/swift-ui/modifiers';
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
 * Official Home Screen Flashcard Widget for iOS (SwiftUI).
 */
export const FlashcardWidget = createWidget<FlashcardWidgetProps>(
  'FlashcardWidget',
  (props) => {
    'widget';

    const hasCards = props.hasCards && props.totalCards > 0;
    const isRevealed = props.isRevealed;

    return (
      <VStack
        modifiers={[
          padding({
            top: 14,
            bottom: 14,
            leading: 16,
            trailing: 16,
          }),
          background('#FFFFFF'),
          cornerRadius(16),
          widgetURL(props.deepLinkUrl || 'mobile://'),
        ]}
      >
        {/* Top Header: Deck Name & Card Counter */}
        <HStack modifiers={[padding({ bottom: 6 })]}>
          <Text
            modifiers={[
              font({ size: 11, weight: 'bold' }),
              foregroundStyle('#4F46E5'),
            ]}
          >
            {props.deckName ? props.deckName.toUpperCase() : 'FLASHCARDS'}
          </Text>

          <Spacer />

          {hasCards ? (
            <Text
              modifiers={[
                font({ size: 11, weight: 'semibold' }),
                foregroundStyle('#64748B'),
              ]}
            >
              {props.cardIndex + 1} / {props.totalCards}
            </Text>
          ) : null}
        </HStack>

        <Spacer />

        {/* Question & Answer Card Body */}
        {hasCards ? (
          <VStack modifiers={[padding({ top: 4, bottom: 6 })]}>
            <Text
              modifiers={[
                font({ size: 10, weight: 'bold' }),
                foregroundStyle('#6366F1'),
              ]}
            >
              QUESTION
            </Text>

            <Text
              modifiers={[
                font({ size: 15, weight: 'bold' }),
                foregroundStyle('#0F172A'),
                padding({ top: 2, bottom: 4 }),
              ]}
            >
              {props.question || 'No question'}
            </Text>

            {isRevealed ? (
              <VStack modifiers={[padding({ top: 4 })]}>
                <Text
                  modifiers={[
                    font({ size: 10, weight: 'bold' }),
                    foregroundStyle('#10B981'),
                  ]}
                >
                  ANSWER
                </Text>
                <Text
                  modifiers={[
                    font({ size: 13, weight: 'medium' }),
                    foregroundStyle('#334155'),
                    padding({ top: 1 }),
                  ]}
                >
                  {props.answer}
                </Text>
              </VStack>
            ) : (
              <Text
                modifiers={[
                  font({ size: 11, weight: 'medium' }),
                  foregroundStyle('#94A3B8'),
                  padding({ top: 4 }),
                ]}
              >
                Answer hidden • Tap "Reveal" below
              </Text>
            )}
          </VStack>
        ) : (
          /* Empty Deck State */
          <VStack modifiers={[padding({ top: 8, bottom: 8 })]}>
            <Text
              modifiers={[
                font({ size: 15, weight: 'bold' }),
                foregroundStyle('#0F172A'),
              ]}
            >
              No flashcards in deck
            </Text>
            <Text
              modifiers={[
                font({ size: 12 }),
                foregroundStyle('#64748B'),
                padding({ top: 4 }),
              ]}
            >
              Tap to open the app and add flashcards.
            </Text>
          </VStack>
        )}

        <Spacer />

        {/* Interactive Controls Row */}
        {hasCards ? (
          <HStack modifiers={[padding({ top: 6 })]}>
            {/* Reveal Answer Button */}
            <Button
              {...({ target: 'reveal' } as any)}
              label={isRevealed ? 'Hide Answer' : 'Reveal Answer'}
              modifiers={[
                font({ size: 11, weight: 'bold' }),
                foregroundStyle(isRevealed ? '#64748B' : '#4F46E5'),
              ]}
              onPress={() => {
                return {
                  ...props,
                  isRevealed: !props.isRevealed,
                };
              }}
            />

            <Spacer />

            {/* Open App Button */}
            <Button
              {...({ target: 'open_app' } as any)}
              label="Open App →"
              modifiers={[
                font({ size: 11, weight: 'bold' }),
                foregroundStyle('#0F172A'),
                bold(),
              ]}
              onPress={() => {
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
            />
          </HStack>
        ) : (
          <HStack>
            <Text
              modifiers={[
                font({ size: 12, weight: 'bold' }),
                foregroundStyle('#4F46E5'),
              ]}
            >
              Open Flashcard App →
            </Text>
          </HStack>
        )}
      </VStack>
    );
  },
  initialWidgetProps
);
