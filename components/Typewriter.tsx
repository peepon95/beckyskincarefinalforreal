import React, { useEffect, useState } from 'react';
import { Text, TextStyle } from 'react-native';

interface TypewriterProps {
  text: string | string[];
  speed?: number;
  initialDelay?: number;
  waitTime?: number;
  loop?: boolean;
  style?: TextStyle;
  onComplete?: () => void;
}

export const Typewriter = ({
  text,
  speed = 50,
  initialDelay = 0,
  waitTime = 1000,
  loop = false,
  style,
  onComplete,
}: TypewriterProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const texts = Array.isArray(text) ? text : [text];

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const currentText = texts[currentTextIndex];

    const startTyping = () => {
      if (currentIndex < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText((prev) => prev + currentText[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        }, speed);
      } else {
        if (currentTextIndex < texts.length - 1) {
          timeout = setTimeout(() => {
            setDisplayText('');
            setCurrentIndex(0);
            setCurrentTextIndex((prev) => prev + 1);
          }, waitTime);
        } else if (loop) {
          timeout = setTimeout(() => {
            setDisplayText('');
            setCurrentIndex(0);
            setCurrentTextIndex(0);
          }, waitTime);
        } else if (!isComplete) {
          setIsComplete(true);
          if (onComplete) {
            onComplete();
          }
        }
      }
    };

    if (currentIndex === 0 && displayText === '') {
      timeout = setTimeout(startTyping, initialDelay);
    } else {
      startTyping();
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, displayText, currentTextIndex, texts, speed, waitTime, loop, initialDelay, isComplete, onComplete]);

  return <Text style={style}>{displayText}</Text>;
};
