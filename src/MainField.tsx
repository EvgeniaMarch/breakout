import React, { useEffect, useRef, useState } from 'react';
import './MaunField.scss';

function MainField() {
  const platformRef = useRef<HTMLDivElement | null>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const [move, setMove] = useState(false);
  useEffect(() => {
    fieldRef.current?.addEventListener('mousemove', (e) => {
      // console.log(e);
      const targetRect = platformRef.current?.getBoundingClientRect();
      // console.log('targetRect', targetRect);
      if (
        targetRect &&
        e.clientX > targetRect.x &&
        e.clientX < targetRect.x + targetRect.width &&
        e.clientY > targetRect.y &&
        e.clientY < targetRect.y + targetRect.height
      ) {
        // console.log('capture');
        setMove(true);
      }
    });
    return () => {
      fieldRef.current?.removeEventListener('mousemove', () => {
        setMove(false);
      });
    };
  }, [fieldRef, platformRef]);

  useEffect(() => {
    fieldRef.current?.addEventListener('click', (e) => {
      setMove(false);
      console.log('click');
    });
    return () => {
      fieldRef.current?.removeEventListener('click', () => console.log('end'));
    };
  }, [fieldRef]);

  useEffect(() => {
    if (move) {
      const targetRect = platformRef.current?.getBoundingClientRect();
      fieldRef.current?.addEventListener('mousemove', (e) => {
        if (targetRect) {
          // targetRect.x = e.clientX;
          // console.log(targetRect);
          document.body.style.setProperty(
            '--platform-x-position',
            `${e.clientX}px`,
          );
        }
      });
      return () => {
        fieldRef.current?.removeEventListener('mousemove', () => {
          document.body.style.setProperty(
            '--platform-x-position',
            `${targetRect?.x}px`,
          );
        });
      };
    }
  }, [move]);

  return (
    <div className="field" ref={fieldRef}>
      <div className="platform" ref={platformRef}></div>
    </div>
  );
}

export default MainField;
