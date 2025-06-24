import { Question } from '../types/yacht';
import { generateQuestions } from '../utils/questionGenerator';
import { parseCSV } from '../utils/csvParser';

// This will be populated from CSV data
let generatedQuestions: Question[] = [];

// Load CSV data and generate questions
export async function loadQuestionsFromCSV(): Promise<Question[]> {
  try {
    const response = await fetch('/data.csv');
    const csvText = await response.text();
    const yachts = parseCSV(csvText);
    generatedQuestions = generateQuestions(yachts);
    return generatedQuestions;
  } catch (error) {
    console.error('Error loading CSV data:', error);
    // Fallback to sample questions if CSV fails
    return getSampleQuestions();
  }
}

export function getQuestions(): Question[] {
  return generatedQuestions;
}

// Sample questions as fallback
export function getSampleQuestions(): Question[] {
  return [
    {
      id: '1',
      type: 'multiple-choice',
      question: 'Who is the builder of Azzam?',
      options: ['Feadship', 'Benetti', 'Lürssen', 'Oceanco'],
      correctAnswer: 'Lürssen',
      explanation: 'Azzam was built by Lürssen Yachts in Germany and delivered in 2013.'
    },
    {
      id: '2',
      type: 'matching',
      question: 'Match the yacht to its owner:',
      matchingPairs: [
        { left: 'Eclipse', right: 'Roman Abramovich' },
        { left: 'Flying Fox', right: 'Dmitry Kamenshchik' },
        { left: 'Dilbar', right: 'Alisher Umanov' },
        { left: 'Koru', right: 'Jeff Bezos' }
      ],
      correctAnswer: ['Roman Abramovich', 'Dmitry Kamenshchik', 'Alisher Umanov', 'Jeff Bezos']
    },
    {
      id: '3',
      type: 'true-false',
      question: 'Azzam was delivered in 2013.',
      correctAnswer: 'True',
      explanation: 'Azzam was indeed delivered in 2013 by Lürssen Yachts.'
    },
    {
      id: '4',
      type: 'comparison',
      question: 'Which yacht is faster?',
      comparisonItems: [
        { name: 'Azzam', value: '33', unit: 'knots' },
        { name: 'Eclipse', value: '21', unit: 'knots' }
      ],
      correctAnswer: 'Azzam',
      explanation: 'Azzam has a top speed of 33 knots compared to Eclipse\'s 21 knots.'
    }
  ];
}