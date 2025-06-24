import React, { useState, useEffect } from 'react';
import { Question } from '../../types/yacht';
import { GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

interface OrderingProps {
  question: Question;
  onAnswer: (answer: number[]) => void;
  userAnswer?: number[];
  isInfiniteMode?: boolean;
}

const Ordering: React.FC<OrderingProps> = ({ question, onAnswer, userAnswer, isInfiniteMode }) => {
  const [items, setItems] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  useEffect(() => {
    if (userAnswer && question.orderItems) {
      const orderedItems = userAnswer.map(index => question.orderItems![index]);
      setItems(orderedItems);
    } else {
      setItems([...(question.orderItems || [])]);
    }
  }, [userAnswer, question.orderItems]);

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const newItems = [...items];
    const draggedItemContent = newItems[draggedItem];
    newItems.splice(draggedItem, 1);
    newItems.splice(dropIndex, 0, draggedItemContent);

    setItems(newItems);

    if (!isInfiniteMode) {
      const answerIndices = newItems.map(item =>
        question.orderItems?.indexOf(item) || 0
      );
      onAnswer(answerIndices);
    }
    setDraggedItem(null);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const item = newItems.splice(fromIndex, 1)[0];
    newItems.splice(toIndex, 0, item);
    setItems(newItems);

    if (!isInfiniteMode) {
      const answerIndices = newItems.map(item =>
        question.orderItems?.indexOf(item) || 0
      );
      onAnswer(answerIndices);
    }
  };

  const handleSubmit = () => {
    const answerIndices = items.map(item =>
      question.orderItems?.indexOf(item) || 0
    );
    onAnswer(answerIndices);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 mb-4">Drag and drop to reorder the items:</p>
      {items.map((item, index) => (
        <div
          key={`${item}-${index}`}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          className="flex items-center p-4 bg-white border-2 border-gray-200 rounded-xl cursor-move hover:border-gray-300 hover:shadow-md transition-all duration-200"
        >
          <GripVertical className="w-5 h-5 text-gray-400 mr-3" />
          <span className="flex-1 font-medium">{item.replace(/\s*\(.*\)$/, '')}</span>
          <div className="flex flex-col space-y-1">
            {index > 0 && (
              <button
                onClick={() => moveItem(index, index - 1)}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                aria-label="Move item up"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            )}
            {index < items.length - 1 && (
              <button
                onClick={() => moveItem(index, index + 1)}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                aria-label="Move item down"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ))}
      {isInfiniteMode && (
        <div className="text-center pt-4">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Submit Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Ordering;