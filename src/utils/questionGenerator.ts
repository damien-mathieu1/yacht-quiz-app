import { Question } from '../types/yacht';
import { YachtData } from './csvParser';

export function generateQuestions(yachts: YachtData[]): Question[] {
  const questions: Question[] = [];
  let questionId = 1;

  // Filter out yachts with missing data
  const validYachts = yachts.filter(yacht =>
    yacht.name && yacht.builder && yacht.owner && yacht.top_speed && yacht.length
  );


  if (validYachts.length === 0) return questions;

  // 1. Multiple Choice - Builder questions
  const builderQuestions = generateBuilderQuestions(validYachts, questionId);
  questions.push(...builderQuestions);
  questionId += builderQuestions.length;

  // 2. Matching - Yacht to Owner
  const matchingQuestions = generateMatchingQuestions(validYachts, questionId);
  questions.push(...matchingQuestions);
  questionId += matchingQuestions.length;

  // 3. True/False - Year delivered
  const trueFalseQuestions = generateTrueFalseQuestions(validYachts, questionId);
  questions.push(...trueFalseQuestions);
  questionId += trueFalseQuestions.length;

  // 4. Image Identification
  const imageQuestions = generateImageQuestions(validYachts, questionId);
  questions.push(...imageQuestions);
  questionId += imageQuestions.length;

  // 5. Ordering - By length
  const orderingQuestions = generateOrderingQuestions(validYachts, questionId);
  questions.push(...orderingQuestions);
  questionId += orderingQuestions.length;

  // 6. Comparison - Speed comparison
  const comparisonQuestions = generateComparisonQuestions(validYachts, questionId);
  questions.push(...comparisonQuestions);
  questionId += comparisonQuestions.length;

  // 7. Cloze - Fill in the blanks
  const clozeQuestions = generateClozeQuestions(validYachts, questionId);
  questions.push(...clozeQuestions);
  questionId += clozeQuestions.length;

  // 8. Find Error
  const errorQuestions = generateErrorQuestions(validYachts, questionId);
  questions.push(...errorQuestions);

  return questions;
}

function generateBuilderQuestions(yachts: YachtData[], startId: number): Question[] {
  const questions: Question[] = [];
  const usedYachts = new Set<string>();

  for (const yacht of yachts) {
    if (usedYachts.has(yacht.name)) continue;
    usedYachts.add(yacht.name);

    const otherBuilders = yachts
      .filter(y => y.builder !== yacht.builder && y.builder)
      .map(y => y.builder)
      .slice(0, 3);

    if (otherBuilders.length >= 3) {
      const options = [yacht.builder, ...otherBuilders].sort(() => Math.random() - 0.5);

      questions.push({
        id: (startId + questions.length).toString(),
        type: 'multiple-choice',
        question: `Who is the builder of ${yacht.name}?`,
        options,
        correctAnswer: yacht.builder,
        explanation: `${yacht.name} was built by ${yacht.builder}.`
      });
    }
  }

  return questions;
}

function generateMatchingQuestions(yachts: YachtData[], startId: number): Question[] {
  const questions: Question[] = [];
  const validYachts = yachts.filter(y => y.name && y.owner);
  const chunkSize = 4;

  for (let i = 0; i < validYachts.length; i += chunkSize) {
    const chunk = validYachts.slice(i, i + chunkSize);
    if (chunk.length === chunkSize) {
      const matchingPairs = chunk.map(yacht => ({
        left: yacht.name,
        right: yacht.owner
      }));

      questions.push({
        id: (startId + questions.length).toString(),
        type: 'matching',
        question: 'Match the yacht to its owner:',
        matchingPairs,
        correctAnswer: matchingPairs.map(pair => pair.right)
      });
    }
  }

  return questions;
}

function generateTrueFalseQuestions(yachts: YachtData[], startId: number): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < yachts.length; i++) {
    const yacht = yachts[i];
    if (!yacht.year_delivered) continue;

    const isTrue = Math.random() > 0.5;
    const actualYear = parseInt(yacht.year_delivered);
    const wrongYear = actualYear + (Math.random() > 0.5 ? 3 : -3);

    questions.push({
      id: (startId + i).toString(),
      type: 'true-false',
      question: `${yacht.name} was delivered in ${isTrue ? actualYear : wrongYear}.`,
      correctAnswer: isTrue ? 'True' : 'False',
      explanation: `${yacht.name} was delivered in ${actualYear}.`
    });
  }

  return questions;
}

function generateImageQuestions(yachts: YachtData[], startId: number): Question[] {
  const questions: Question[] = [];
  const yachtsWithImages = yachts.filter(y => y.profile_picture && y.name);

  for (let i = 0; i < yachtsWithImages.length; i++) {
    const yacht = yachtsWithImages[i];
    const otherYachts = yachtsWithImages
      .filter(y => y.name !== yacht.name)
      .slice(0, 3)
      .map(y => y.name);

    if (otherYachts.length >= 3) {
      const options = [yacht.name, ...otherYachts].sort(() => Math.random() - 0.5);

      questions.push({
        id: (startId + i).toString(),
        type: 'image-identification',
        question: 'Which yacht is shown in this picture?',
        image: yacht.profile_picture,
        options,
        correctAnswer: yacht.name,
        explanation: `This is ${yacht.name}.`
      });
    }
  }

  return questions;
}

function generateOrderingQuestions(yachts: YachtData[], startId: number): Question[] {
  const questions: Question[] = [];
  const yachtsWithLength = yachts.filter(y => y.length && y.name);
  const chunkSize = 4;

  for (let i = 0; i < yachtsWithLength.length; i += chunkSize) {
    const chunk = yachtsWithLength.slice(i, i + chunkSize);
    if (chunk.length === chunkSize) {
      const sortedChunk = [...chunk].sort((a, b) => parseFloat(a.length) - parseFloat(b.length));
      const orderItems = sortedChunk.map(yacht => `${yacht.name} (${yacht.length}m)`);
      const shuffledItems = [...orderItems].sort(() => Math.random() - 0.5);

      questions.push({
        id: (startId + questions.length).toString(),
        type: 'ordering',
        question: 'Order these yachts by length (shortest to longest):',
        orderItems: shuffledItems,
        correctAnswer: orderItems.map(item => shuffledItems.indexOf(item))
      });
    }
  }

  return questions;
}

function generateComparisonQuestions(yachts: YachtData[], startId: number): Question[] {
  const questions: Question[] = [];
  const yachtsWithSpeed = yachts.filter(y => y.top_speed && y.name && parseFloat(y.top_speed) > 0);

  for (let i = 0; i < yachtsWithSpeed.length - 1; i++) {
    const yacht1 = yachtsWithSpeed[i];
    const yacht2 = yachtsWithSpeed[i + 1];

    const speed1 = parseFloat(yacht1.top_speed);
    const speed2 = parseFloat(yacht2.top_speed);

    questions.push({
      id: (startId + i).toString(),
      type: 'comparison',
      question: 'Which yacht is faster?',
      comparisonItems: [
        { name: yacht1.name, value: yacht1.top_speed, unit: 'knots' },
        { name: yacht2.name, value: yacht2.top_speed, unit: 'knots' }
      ],
      correctAnswer: speed1 > speed2 ? yacht1.name : yacht2.name,
      explanation: `${yacht1.name} has a top speed of ${speed1} knots, while ${yacht2.name} has a top speed of ${speed2} knots. ${speed1 > speed2 ? yacht1.name : yacht2.name} is faster.`
    });
  }

  return questions;
}

function generateClozeQuestions(yachts: YachtData[], startId: number): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < yachts.length; i++) {
    const yacht = yachts[i];
    if (!yacht.name || !yacht.year_delivered || !yacht.top_speed) continue;

    const otherYachts = yachts.filter(y => y.name !== yacht.name).slice(0, 2).map(y => y.name);
    const otherYears = yachts.filter(y => y.year_delivered !== yacht.year_delivered).slice(0, 2).map(y => y.year_delivered);
    const otherSpeeds = yachts.filter(y => y.top_speed !== yacht.top_speed).slice(0, 2).map(y => y.top_speed);

    if (otherYachts.length >= 2 && otherYears.length >= 2 && otherSpeeds.length >= 2) {
      questions.push({
        id: (startId + i).toString(),
        type: 'cloze',
        question: 'Fill in the blanks about this yacht:',
        clozeText: 'The yacht [BLANK] was delivered in [BLANK] and has a top speed of [BLANK] knots.',
        clozeOptions: [
          [yacht.name, ...otherYachts],
          [yacht.year_delivered, ...otherYears],
          [yacht.top_speed, ...otherSpeeds]
        ],
        correctAnswer: [yacht.name, yacht.year_delivered, yacht.top_speed]
      });
    }
  }

  return questions;
}

function generateErrorQuestions(yachts: YachtData[], startId: number): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < yachts.length; i++) {
    const yacht = yachts[i];
    if (!yacht.name || !yacht.builder || !yacht.year_delivered) continue;

    const wrongBuilder = yachts.find(y => y.builder !== yacht.builder)?.builder;
    const wrongYear = (parseInt(yacht.year_delivered) + 5).toString();

    if (wrongBuilder) {
      questions.push({
        id: (startId + i).toString(),
        type: 'find-error',
        question: 'Find the error in this statement:',
        errorText: `${yacht.name} was built by ${wrongBuilder} and delivered in ${wrongYear}.`,
        errorOptions: ['Builder', 'Year delivered', 'Both', 'None'],
        correctAnswer: 'Both',
        explanation: `${yacht.name} was built by ${yacht.builder} and delivered in ${yacht.year_delivered}.`
      });
    }
  }

  return questions;
}