import React, { useEffect, useRef, useState } from 'react';
import './MaunField.scss';

function MainField() {
  const platformRef = useRef<HTMLDivElement | null>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const ballRef = useRef<HTMLDivElement | null>(null);
  const [move, setMove] = useState(false);
  // console.log('🚀 ~ MainField ~ move:', move);

  //Координаты и размеры поля - константа
  const [fieldCoords, setFieldCoords] = useState({
    x: 0,
    y: 0,
    width: 1200,
    height: 700, //const
  });

  // Координаты и размеры платформы. Первоначально вычисляются относительно поля
  const [paltformCoords, setPaltformCoords] = useState({
    x: fieldCoords.width / 2 - 50,
    y: 0,
    width: 100,
    height: 20,
  });

  // Координаты и размеры шара. Первоначально вычисляются относительно платформы
  const [ballCoords, setBallCoords] = useState({
    x: fieldCoords.width / 2 - 10,
    y: 630,
    width: 20,
    height: 20,
  });
  // console.log('🚀 ~ MainField ~ ballCoords:', ballCoords);

  // Координаты поля относительно окна. Для корректировки положения
  const fieldRect = fieldRef.current?.getBoundingClientRect();

  // console.log('🚀 ~ MainField ~ fieldRect:', fieldRect);

  // useEffect, который следит за движением мыши и при выходе курсора за пределы поля устанавливает флаг движения в false
  useEffect(() => {
    if (fieldRect) {
      const listener = (e) => {
        // console.log('🚀 ~ listener ~ e:', e);
        if (
          e.clientX < fieldRect.x ||
          e.clientX > fieldRect.x + fieldRect.width
        ) {
          setMove(false);
        }
      };
      fieldRef.current?.addEventListener('mousemove', listener);
      return () => {
        fieldRef.current?.removeEventListener('mousemove', listener);
      };
    }
  });

  // useEffect, который следит за движением мыши и при попадании курсора на платформу устанавливает флаг движения в true
  useEffect(() => {
    const fieldRect = fieldRef.current?.getBoundingClientRect();

    const listener = (e: MouseEvent) => {
      if (fieldRect) {
        // console.log(22);

        if (
          e.clientX > paltformCoords.x + fieldRect?.x &&
          e.clientX < paltformCoords.x + fieldRect?.x + paltformCoords.width &&
          e.clientY > paltformCoords.y + fieldRect?.y &&
          e.clientY <
            paltformCoords.y + paltformCoords.height + fieldCoords.height &&
          paltformCoords.x + paltformCoords.width <
            fieldCoords.x + fieldCoords.width
        ) {
          setMove(true);
          // console.log(1);
        }
      }
    };
    fieldRef.current?.addEventListener('mousemove', listener);
    return () => {
      fieldRef.current?.removeEventListener('mousemove', listener);
    };
  }, [
    fieldCoords.height,
    fieldCoords.width,
    fieldCoords.x,
    fieldRef,
    paltformCoords.height,
    paltformCoords.width,
    paltformCoords.x,
    paltformCoords.y,
    platformRef,
  ]);
  // console.log(paltformCoords.x + paltformCoords.width / 2);
  // console.log(fieldCoords.width / 2);

  // useEffect для остановки платформы при клике мышью
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      setMove(false);
    };
    fieldRef.current?.addEventListener('click', listener);
    return () => {
      fieldRef.current?.removeEventListener('click', listener);
    };
  }, [fieldRef]);

  // useEffect для движения платформы за мышью
  useEffect(() => {
    const listener = (e) => {
      if (targetRect && fieldRect) {
        // 50 - половина ширины платформы
        // 10 - паддинг~
        if (e.clientX >= fieldCoords.width - fieldRect?.x - 50) {
          setPaltformCoords((p) => ({
            ...p,
            x: 1100,
          }));
        } else if (e.clientX <= fieldRect?.x + 50 - 10) {
          setPaltformCoords((p) => ({
            ...p,
            x: fieldRect?.x - 50 + 10,
          }));
        } else {
          setPaltformCoords((p) => ({
            ...p,
            x: e.clientX - 50 - fieldRect?.x,
          }));
        }
      }
    };
    const targetRect = platformRef.current?.getBoundingClientRect();
    if (move) {
      fieldRef.current?.addEventListener('mousemove', listener);
    }
    return () => {
      fieldRef.current?.removeEventListener('mousemove', listener);
    };
  }, [fieldCoords.width, fieldRect, move, paltformCoords.x]);
  // console.log({
  //   ballX: ballCoords.x,
  //   fieldX: fieldRect?.x + fieldCoords.width,
  // });

  // Мяч должен отскакивать под углом 45 от всего
  // В зависимости от чего мяч меняет угол и реализовать
  // Список логических игр. Играть. Вырабатывать новую привычку
  useEffect(() => {
    const ballX = ballCoords.x;
    // console.log('🚀 ~ MainField ~ ballX:', ballX);
    const ballY = ballCoords.y;
    // console.log('🚀 ~ MainField ~ ballY:', ballY);
    const leftFieldCoord = fieldRect?.x;
    // console.log('🚀 ~ MainField ~ fieldRect:', fieldRect);
    // console.log('🚀 ~ MainField ~ leftFieldCoord:', leftFieldCoord);
    const rightFieldCoord = leftFieldCoord + fieldCoords.width;
    // console.log('🚀 ~ MainField ~ rightFieldCoord:', rightFieldCoord);
    if (move) {
      // delta - количество мс, прошедшее с предыдущего кадра
      // const delta = 1000;
      requestAnimationFrame(function ballMoving() {
        const ballRect = ballRef.current?.getBoundingClientRect();
        let deltaY: number = 0;
        let deltaX: number = 0;
        // if (ballX > rightFieldCoord) {
        //   deltaX = 0;
        //   deltaY = 0;
        //   setMove(false);
        //   console.log('ballX > rightFieldCoord');
        if (ballY <= fieldRect?.y) {
          deltaY = 1;
        }
        if (ballY >= fieldRect?.y + fieldCoords.height) {
          deltaY = -1;
        }
        // }
        // console.log('🚀 ~ ballMoving ~ paltformCoords:', paltformCoords);
        if (
          ballY === 630 &&
          paltformCoords.x + paltformCoords.width / 2 < fieldCoords.width / 2 &&
          ballX < rightFieldCoord
        ) {
          // console.log('1');

          deltaX = 1;
          deltaY = -1;
        }
        if (
          ballY === 630 &&
          paltformCoords.x + paltformCoords.width / 2 > fieldCoords.width / 2 &&
          ballX >= leftFieldCoord
        ) {
          // console.log('2');

          deltaX = -1;
          deltaY = -1;
        }
        // if (
        //   ballY === 630 &&
        //   ballX > paltformCoords.x &&
        //   ballX < paltformCoords.x + paltformCoords.width
        // ) {
        //   // console.log('Мяч попал в платформу');

        //   deltaY = -1;
        // }

        if (ballX <= leftFieldCoord) {
          console.log({ leftFieldCoord, ballX });
          deltaX = 1;
          // deltaY = 1;
        }
        if (ballX >= rightFieldCoord) {
          // console.log('4');

          deltaX = -1;
          // deltaY = -1;
        }

        if (ballRect) {
          // console.log(ballX, fieldRect?.x);
          // console.log('🚀 ~ ballMoving ~ deltaX:', deltaX);
          setBallCoords((p) => ({
            ...p,
            x: p.x + deltaX,
            y: p.y + deltaY,
          }));
        }
        // if (ballCoords.x < fieldRect?.x + fieldCoords.width) {
        // if (ballCoords.x === fieldRect?.x) {
        //   console.log(1);

        //   setBallCoords((p) => ({
        //     ...p,
        //     x: p.x + 4,
        //     y: p.y,
        //   }));
        // }
        requestAnimationFrame(ballMoving);
        // console.log('END');
        // }
      });
    }
  }, [
    ballCoords.x,
    ballCoords.y,
    fieldCoords.width,
    fieldRect,
    fieldRect?.x,
    move,
    paltformCoords.width,
    paltformCoords.x,
  ]);

  // useEffect(() => {
  //   // console.log('🚀 ~ useEffect ~ fieldRect?.x:', fieldRect?.x);
  //   if (ballCoords.x === fieldRect?.x) {
  //     // console.log(1);

  //     setBallCoords((p) => ({
  //       ...p,
  //       x: p.x + 1,
  //       y: p.y,
  //     }));
  //   }
  // }, [ballCoords.x, fieldRect?.x]);

  return (
    <div
      className="field"
      ref={fieldRef}
      style={{
        width: fieldCoords.width,
        height: fieldCoords.height,
        top: fieldCoords.y,
        left: fieldCoords.x,
      }}
    >
      <div
        className="ball"
        ref={ballRef}
        style={{
          width: ballCoords.width,
          height: ballCoords.height,
          left: ballCoords.x,
          top: ballCoords.y,
        }}
      ></div>
      <div
        className="platform"
        ref={platformRef}
        style={{
          width: paltformCoords.width,
          height: paltformCoords.height,
          left: paltformCoords.x,
          top: paltformCoords.y,
        }}
      ></div>
    </div>
  );
}

export default MainField;
