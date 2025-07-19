import { Question } from '../types/yacht';
import { YachtData } from './csvParser';

// Utility function to get random unique items from an array
function getRandomUniqueItems<T>(array: T[], count: number, exclude?: T): T[] {
  const filtered = exclude ? array.filter(item => item !== exclude) : array;
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateQuestions(yachts: YachtData[]): Question[] {
  const questions: Question[] = [];
  let questionId = 1;

  // Filter out yachts with missing essential data
  const validYachts = yachts.filter(yacht =>
    yacht.name && yacht.builder && yacht.length
  );

  if (validYachts.length === 0) return questions;

  // 1. Multiple Choice - Builder questions (improved randomization)
  const builderQuestions = generateBuilderQuestions(validYachts, questionId);
  questions.push(...builderQuestions);
  questionId += builderQuestions.length;

  // 2. Image Identification (improved randomization)
  const imageQuestions = generateImageQuestions(validYachts, questionId);
  questions.push(...imageQuestions);
  questionId += imageQuestions.length;

  // 3. Ordering - By length (keep as is, it's already good)
  const orderingQuestions = generateOrderingQuestions(validYachts, questionId);
  questions.push(...orderingQuestions);

  return questions;
}

// Generate builder questions with improved randomization
function generateBuilderQuestions(yachts: YachtData[], startId: number): Question[] {
  const questions: Question[] = [];
  const usedYachts = new Set<string>();
  
  // Get all unique builders for better randomization
  const allBuilders = [...new Set(yachts.filter(y => y.builder).map(y => y.builder))];
  
  for (const yacht of yachts) {
    if (usedYachts.has(yacht.name) || !yacht.builder) continue;
    usedYachts.add(yacht.name);

    // Get 3 random different builders (excluding the correct one)
    const wrongBuilders = getRandomUniqueItems(allBuilders, 3, yacht.builder);
    
    if (wrongBuilders.length >= 3) {
      // Shuffle all options including the correct answer
      const options = [yacht.builder, ...wrongBuilders].sort(() => Math.random() - 0.5);

      questions.push({
        id: (startId + questions.length).toString(),
        type: 'multiple-choice',
        question: `Qui est le constructeur du ${yacht.name} ?`,
        options,
        correctAnswer: yacht.builder,
        explanation: `Le ${yacht.name} a été construit par ${yacht.builder}.`
      });
    }
  }

  return questions;
}

// Generate image identification questions with improved randomization
function generateImageQuestions(yachts: YachtData[], startId: number): Question[] {
  const questions: Question[] = [];
  const yachtsWithImages = yachts.filter(y => y.profile_picture && y.name);
  
  // Get all yacht names for better randomization
  const allYachtNames = yachtsWithImages.map(y => y.name);

  for (let i = 0; i < yachtsWithImages.length; i++) {
    const yacht = yachtsWithImages[i];
    
    // Get 3 random different yacht names (excluding the correct one)
    const wrongNames = getRandomUniqueItems(allYachtNames, 3, yacht.name);

    if (wrongNames.length >= 3) {
      // Shuffle all options including the correct answer
      const options = [yacht.name, ...wrongNames].sort(() => Math.random() - 0.5);

      questions.push({
        id: (startId + i).toString(),
        type: 'image-identification',
        question: 'Quel yacht est montré sur cette image ?',
        image: yacht.profile_picture,
        options,
        correctAnswer: yacht.name,
        explanation: `Il s'agit du ${yacht.name}.`
      });
    }
  }

  return questions;
}

// Generate ordering questions by yacht length
function generateOrderingQuestions(yachts: YachtData[], startId: number): Question[] {
  const questions: Question[] = [];
  const yachtsWithLength = yachts.filter(y => y.length && y.name && parseFloat(y.length) > 0);
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
        question: 'Classez ces yachts par taille (du plus petit au plus grand) :',
        orderItems: shuffledItems,
        correctAnswer: orderItems.map(item => shuffledItems.indexOf(item))
      });
    }
  }

  return questions;
}
