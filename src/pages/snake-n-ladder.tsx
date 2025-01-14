import React, { useState, useEffect } from "react";
import styles from "@/styles/snake-n-ladder.module.css";
import Xarrow from "react-xarrows";
import Dice from 'react-dice-roll';

const snakes: {
  [key: number]: number;
} = {
  99: 9,
  93: 51,
  90: 11,
  87: 37,
  77: 17,
  65: 22,
  60: 19,
  52: 27,
  46: 6,
  32: 5
};

const ladders: {
  [key: number]: number;
} = {
  7: 26,
  13: 55,
  21: 78,
  36: 64,
  44: 75,
  47: 68,
  50: 92,
  61: 96,
  66: 83,
  67: 86
};

type playerTurn = {
  player_id: number;
  dicenumber: number;
  last_position: number;
}


function Arrows(startId: string, endId: string, type: "snake" | "ladder") {
  const [arrowParams, setArrowParams] = useState({
    tailSize: 4,
    strokeWidth: type === "snake" ? 4 : 30,
    headSize: 4,
    dashness:
      type === "snake"
        ? { strokeLen: 5, nonStrokeLen: 5, animation: 1 }
        : { strokeLen: 5, nonStrokeLen: 15, animation: 0.3 },
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setArrowParams({
          tailSize: 2,
          strokeWidth: 4,
          headSize: 5,
          dashness: { strokeLen: 4, nonStrokeLen: 1, animation: 1 },
        });
      } else {
        setArrowParams({
          tailSize: 4,
          strokeWidth: type === "snake" ? 4 : 30,
          headSize: 4,
          dashness:
            type === "snake"
              ? { strokeLen: 5, nonStrokeLen: 5, animation: 1 }
              : { strokeLen: 5, nonStrokeLen: 15, animation: 0.3 },
        });
      }
    };

    handleResize(); // Set initial values based on the current window size
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [type]);

  return (
    <div className={styles.arrow}>
      <Xarrow
        color={type === "snake" ? "darkred" : "darkgreen"}
        curveness={type === "snake" ? 0.5 : 0}
        tailSize={arrowParams.tailSize}
        strokeWidth={arrowParams.strokeWidth}
        headSize={arrowParams.headSize}
        showTail={type === "snake"}
        tailShape={"circle"}
        showHead={type === "snake"}
        start={startId}
        end={endId}
        dashness={arrowParams.dashness}
        startAnchor={"middle"}
        endAnchor={"middle"}
      />
    </div>
  );
}

function lastArrow(lastTwoTurn: playerTurn[], currentPostition: number[]) {
  return (
    <div >
      <Xarrow
        color="#0000e0"
        curveness={0}
        strokeWidth={3}
        headSize={4}
        start={lastTwoTurn[1].last_position + ''}
        end={currentPostition[lastTwoTurn[1].player_id] + ''}
        startAnchor={"middle"}
        endAnchor={"middle"}
      />
    </div>
  );
}

function fillArrow() {
  const arrows = [];
  for (const [key, value] of Object.entries(snakes)) {
    arrows.push(Arrows(`${key}`, `${value}`, "snake"));
  }
  for (const [key, value] of Object.entries(ladders)) {
    arrows.push(Arrows(`${key}`, `${value}`, "ladder"));
  }
  return arrows;
}

const homeStart = (step: number, playerPosition: number[]) => {
  const result = [];
  for (let i = 0; i < playerPosition.length; i++) {
    if (step === playerPosition[i]) {
      result.push(
        <div
          className={`${styles.circle} ${styles["player" + (i + 1)]} ${styles["circle-show"]}`}
        ></div>
      )
    } else {
      result.push(
        <div
          className={`${styles.circle} ${styles["playerq" + (i + 1)]} ${styles["circle-show"]}`}
        ></div>
      )
    }
  }
  return (
    <>
      {result}
    </>
  );
};

const Cell = ({ step, playerId }: { step: number; playerId: number[] }) => {
  let color = "";
  if (step in snakes || Object.values(snakes).includes(step)) {
    color = styles["snake-cell"];
  } else if (step in ladders || Object.values(ladders).includes(step)) {
    color = styles["ladder-cell"];
  }


  return (
    <div key={step} id={`${step}`} className={styles.cell + " " + color}>
      <div
        className={`${styles["cell-content"]} 
      ${playerId[0] === step ? styles.player1 : ""}
      ${playerId[1] === step ? styles.player2 : ""}
      ${playerId[2] === step ? styles.player3 : ""}
      ${playerId[3] === step ? styles.player4 : ""}
      `}
      >
        {step}
      </div>
    </div>
  );
};

function getCellNumber(i: number, j: number) {
  if (i % 2 === 0) {
    j = 9 - j;
  }
  return i * 10 + j;
}

function Board({
  chaal,
}: Readonly<{
  chaal: Array<number>;
}>) {
  const board = [];
  for (let i = 9; i >= 0; i--) {
    for (let j = 9; j >= 0; j--) {
      const cellNumber = getCellNumber(i, j) + 1;
      if ([1, 100].includes(cellNumber)) {
        board.push((
          <div
            key={cellNumber}
            id={`${cellNumber}`}
            className={styles.cell + ' ' + styles[cellNumber === 1 ? 'start' : 'home']}>
            {homeStart(cellNumber, chaal)}
          </div>
        ));
      } else {
        board.push(<Cell step={cellNumber} playerId={chaal}></Cell>);
      }
    }
  }

  //   return (
  //     <div className={styles.container}>
  //       <div className={styles["image-board"]} />
  //     </div>
  //   );

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board}
        {fillArrow()}
      </div>
      {/* <div className={styles["image-board"]} /> */}
    </div>
  );
}

function getNextPlayerTurn(
  playerPosition: Array<number>,
  currentPlayer: number
) {
  let nextPlayer = (currentPlayer + 1) % 4;
  const count = playerPosition.reduce((acc, e) => e === 100 ? 1 + acc : acc, 0);
  if (count > 3) {
    return nextPlayer;
  }
  while (playerPosition[nextPlayer] === 100) {
    nextPlayer = (nextPlayer + 1) % 4;
  }
  return nextPlayer;
}


const Table = ({ data }: { data: number[]; }) => {
  return (
    <table className={`${styles.table} ${styles['game-info']}`}>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Player Name</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{'Player-' + (index + 1)}</td>
          </tr>
        ))}
      </tbody>
    </table >
  );
};

function checkPlayerCapture(playerPosition: number[], currentPostition: number) {
  for (let i = 0; i < playerPosition.length; i++) {
    if (playerPosition[i] === currentPostition && ![100, 1].includes(currentPostition)) {
      return i;
    }
  }
  return -1;
}




export default function Game() {
  const [playerPosition, setPlayerPosition] = useState<number[]>(Array(4).fill(1));
  const [playerTurn, setPlayerTurn] = useState<number>(0);
  const [status, setStatus] = useState("");
  const [ranking, setRanking] = useState<number[]>([]);
  const [lastTwoTurn, setLastTwoTurn] = useState<playerTurn[]>([
    { player_id: 0, dicenumber: 0, last_position: 1 },
    { player_id: 0, dicenumber: 0, last_position: 1 }
  ]);

  function rollDice(diceNumber: number) {
    const count = playerPosition.reduce((acc, e) => e === 100 ? 1 + acc : acc, 0);
    if (count >= 3) {
      return;
    }

    setLastTwoTurn([lastTwoTurn[1], { player_id: playerTurn, dicenumber: diceNumber, last_position: playerPosition[playerTurn] }]);
    let nextPlayer = getNextPlayerTurn(playerPosition, playerTurn);

    const nextPlayerPositions = playerPosition.slice();
    nextPlayerPositions[playerTurn] += diceNumber;

    let newStatus = '';

    if (lastTwoTurn[0].player_id === lastTwoTurn[1].player_id && lastTwoTurn[0].dicenumber && lastTwoTurn[1].dicenumber &&
      lastTwoTurn[0].player_id === playerTurn && diceNumber === lastTwoTurn[0].dicenumber
    ) {
      setStatus(
        `Player-${playerTurn + 1} void move, 3 consecutive 6.`
      );
      setPlayerTurn(nextPlayer);
      return;
    }
    if (playerPosition[playerTurn] === 1 && ![1, 6].includes(diceNumber)) {
      setStatus(
        `Player-${playerTurn + 1} needs to roll 1 or 6 to start.`
      );
      setPlayerTurn(nextPlayer);
      return;
    }
    if (playerPosition[playerTurn] + diceNumber > 100) {
      setStatus(
        `Player-${playerTurn + 1} couldn't move, needs to roll ${100 - playerPosition[playerTurn]} or lower`
      );
      setPlayerTurn(nextPlayer);
      return;
    }
    if (playerPosition[playerTurn] + diceNumber === 100) {
      newStatus = `Last Move: Player-${playerTurn + 1} took ${diceNumber} steps and reached Home!`;
      setRanking([...ranking, playerTurn + 1]);
    } else if (playerPosition[playerTurn] + diceNumber in ladders) {
      if (diceNumber === 6) {
        nextPlayer = playerTurn;
      }
      newStatus = `Last Move: Player-${playerTurn + 1} took ${diceNumber} steps and climbs ladder!`;
      nextPlayerPositions[playerTurn] = ladders[playerPosition[playerTurn] + diceNumber];
    } else if (playerPosition[playerTurn] + diceNumber in snakes) {
      if (diceNumber === 6) {
        nextPlayer = playerTurn;
      }
      newStatus = `Last Move: Player-${playerTurn + 1} took ${diceNumber} steps and got bit by snake!`;
      nextPlayerPositions[playerTurn] = snakes[playerPosition[playerTurn] + diceNumber];
    } else {
      if (diceNumber === 6) {
        nextPlayer = playerTurn;
      }
      newStatus = `Last Move: Player-${playerTurn + 1} took ${diceNumber} steps`;
    }


    const capturedPlayer = checkPlayerCapture(playerPosition, nextPlayerPositions[playerTurn]);
    if (capturedPlayer >= 0) {
      newStatus += ` and captured Player-${capturedPlayer + 1}`;
      nextPlayerPositions[capturedPlayer] = 1;
      nextPlayer = playerTurn;
    }
    setStatus(newStatus);
    setPlayerPosition(nextPlayerPositions);
    setPlayerTurn(nextPlayer);
  }

  return (
    <>
      <Board
        chaal={playerPosition}
      ></Board>
      <div className={styles["game-row1"]}>
        {status.length > 0 ? <div className={`${styles["player" + (lastTwoTurn[1].player_id + 1)]} ${styles['player-turn']}`}>
          {status}
        </div> : ''}
      </div>
      <div className={styles["game-row1"]}>
        <div className={`${styles["player" + (playerTurn + 1)]} ${styles['player-turn']}`}>
          {`Turn of Player-${playerTurn + 1}`}
        </div>
        <Dice onRoll={(value) => rollDice(value)} size={33}
          faces={['/dice1.png', '/dice2.png', '/dice3.png', '/dice4.png', '/dice5.png', '/dice6.png']}
        />
      </div>
      {lastArrow(lastTwoTurn, playerPosition)}
      {
        ranking.length > 0
          ? (<div className={styles["game-row"]}>
            <Table data={ranking} />
          </div>)
          : ''
      }
    </>
  );
}
