import React, { useEffect, useMemo, useRef, useState } from 'react';
import './MaunField.scss';

function MainField() {
  const platformRef = useRef<HTMLDivElement | null>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const ballRef = useRef<HTMLDivElement | null>(null);

  const blockRef = useRef<HTMLDivElement | null>(null);
  const [move, setMove] = useState(false);

  const blockInitState = useMemo(
    () => ({
      x: 0,
      y: 0,
      width: 400,
      height: 100,
      display: 'block',
    }),
    [],
  );
  const [block, setBlock] = useState(blockInitState);
  const [hit, setHit] = useState(false);

  //Координаты и размеры поля - константа

  const fieldCoords = {
    x: 0,
    y: 0,
    width: 1200,
    height: 700, //const
  };

  const initStatePlatform = useMemo(
    () => ({
      x: fieldCoords.width / 2 - 50, // находим середину поля и вычитаем половину длины платформы
      y: 0, // transform задан в стилях (650, поэтому тут 0)
      width: 100,
      height: 20,
    }),
    [fieldCoords.width],
  );

  // Координаты и размеры платформы. Первоначально вычисляются относительно поля
  const [paltformCoords, setPaltformCoords] = useState(initStatePlatform);

  const initStateBall = useMemo(
    () => ({
      x: fieldCoords.width / 2 - 10, // находим середину платформы и вычитаем половину ширины мячика
      y: 630, // 650 (координаты платформы по y - высота шарика)
      width: 20,
      height: 20,
    }),
    [fieldCoords.width],
  );

  // Координаты и размеры шара. Первоначально вычисляются относительно платформы
  const [ballCoords, setBallCoords] = useState(initStateBall);

  const [processingGame, setIsProcessingGame] = useState(false);
  const [gameOver, setIsGameOver] = useState(false);
  const [xDirection, setXDirection] = useState(0); // 1 - вправо, -1 - влево

  // Координаты поля относительно окна. Для корректировки положения
  const fieldRect = fieldRef.current?.getBoundingClientRect();
  const blockRect = blockRef.current?.getBoundingClientRect();
  const ballRightX = ballCoords.x;
  const ballLeftX = ballRightX - ballCoords.width;
  const ballY = ballCoords.y;
  const leftFieldCoord = fieldRect?.x || 0;
  const topFieldCoord = fieldRect?.y || 0;

  const topBlock = blockRect?.y || 0;
  const bottomBlock = topBlock + (blockRect?.height || 0);
  const leftBlock = blockRect?.x || 0;
  const rightBlock = leftBlock + (blockRect?.width || 0);

  const rightFieldCoord = leftFieldCoord + fieldCoords.width;
  const bottomFieldCoord = topFieldCoord + fieldCoords.height;

  const platformLeftX = paltformCoords.x;
  const platformRightX = paltformCoords.x + paltformCoords.width;

  useEffect(() => {
    if (hit) {
      setBlock((p) => ({ ...p, display: 'none' }));
    }
  }, [hit]);

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

  // Мяч должен отскакивать под углом 45 от всего
  // В зависимости от чего мяч меняет угол и реализовать
  // Список логических игр. Играть. Вырабатывать новую привычку
  useEffect(() => {
    if (move) {
      // delta - количество мс, прошедшее с предыдущего кадра
      // const delta = 1000;
      requestAnimationFrame(function ballMoving() {
        const ballRect = ballRef.current?.getBoundingClientRect();
        let deltaY: number = 0;
        let deltaX: number = 0;

        if (
          ballY <= bottomBlock &&
          ballLeftX > leftBlock &&
          ballRightX < rightBlock
        ) {
          deltaY = 1;
          deltaX = 1;
          // setBlock((p) => ({ ...p, display: 'none' }));
        }

        // мяч отскакивает от верхней границы поля
        if (ballY <= topFieldCoord) {
          deltaY = 1;
        }

        // первоначальное движение мяча
        if (
          ballY === initStateBall.y &&
          paltformCoords.x + paltformCoords.width / 2 < fieldCoords.width / 2 &&
          ballRightX < rightFieldCoord &&
          !processingGame
        ) {
          deltaX = 1;
          deltaY = -1;
          setIsProcessingGame(true); //игра пошла
        }
        // первоначальное движение мяча
        if (
          ballY === initStateBall.y &&
          paltformCoords.x + paltformCoords.width / 2 > fieldCoords.width / 2 &&
          ballRightX >= leftFieldCoord &&
          !processingGame
        ) {
          deltaX = -1;
          deltaY = -1;
          setIsProcessingGame(true); //игра пошла
        }

        // не поймали мяч платформой
        if (
          processingGame &&
          ballY === initStateBall.y &&
          (ballLeftX > platformRightX || ballRightX < platformLeftX)
        ) {
          setBallCoords(initStateBall);
          setPaltformCoords(initStatePlatform);
          setMove(false);
          setIsGameOver(true);
          setIsProcessingGame(false);
          console.log(123);
        }

        // поймали мяч платформой
        if (
          processingGame &&
          ballY === initStateBall.y &&
          ballLeftX < platformRightX &&
          ballRightX > platformLeftX
        ) {
          deltaY = -1;
        }

        // мяч отскакивает от левого угла поля
        if (ballRightX <= leftFieldCoord) {
          deltaX = 1;
        }

        // мяч отскакивает от правого угла поля
        if (ballRightX >= rightFieldCoord) {
          deltaX = -1;
        }

        if (ballRect) {
          setBallCoords((p) => ({
            ...p,
            x: p.x + deltaX,
            y: p.y + deltaY,
          }));
        }

        requestAnimationFrame(ballMoving);
      });
    }
  }, [
    ballCoords.width,
    ballCoords.x,
    ballCoords.y,
    ballLeftX,
    ballRightX,
    ballY,
    bottomBlock,
    fieldCoords.height,
    fieldCoords.width,
    fieldRect,
    fieldRect?.x,
    initStateBall,
    initStatePlatform,
    leftBlock,
    leftFieldCoord,
    move,
    paltformCoords.width,
    paltformCoords.x,
    platformLeftX,
    platformRightX,
    processingGame,
    rightBlock,
    rightFieldCoord,
    topFieldCoord,
    xDirection,
  ]);

  const platformWithBall = (
    <>
      <div
        className="block"
        ref={blockRef}
        style={{
          width: block.width,
          height: block.height,
          left: block.x,
          top: block.y,
          display: block.display,
        }}
      ></div>
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
    </>
  );

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
      {gameOver ? <div>GAME OVER</div> : platformWithBall}
    </div>
  );
}

export default MainField;
