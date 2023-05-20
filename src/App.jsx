/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

const strColor = {
    green: "strColor-green",
    yellow: "strColor-yellow",
    grey: "strColor-grey",
    null: "strColor-null",
};

export const App = () => {
    const [roundGame, setRoundGame] = useState(0);
    const [indexLetterValue, setIndexLetterValue] = useState(0);
    const [word, setWord] = useState("perro");
    const [board, setBoard] = useState(() => {
        return [0, 1, 2, 3, 4].map(() => {
            return word.split("").map((col, indexCol) => {
                return {
                    id: indexCol,
                    strCorrect: col,
                    strGuess: "",
                    strState: "null",
                };
            });
        });
    });

    useEffect(() => {
        const handleKey = (e) => {
            const key = e.key;

            if (indexLetterValue === 5) return;

            if (!key.match(/^[a-zA-ZñÑ]$/)) return;

            const newBoard = board.map((row, indexRow) => {
                if (roundGame === indexRow) {
                    return row.map((col) => {
                        if (col.id === indexLetterValue) {
                            return {
                                ...col,
                                strGuess: key,
                            };
                        }
                        return col;
                    });
                }
                return row;
            });

            setBoard(newBoard);
            setIndexLetterValue(indexLetterValue + 1);
        };

        window.addEventListener("keydown", handleKey);

        return () => window.removeEventListener("keydown", handleKey);
    });

    useEffect(() => {
        const handleKey = (e) => {
            const code = e.code;

            if (code === "Backspace") {
                if (!indexLetterValue) return;
                const newBoard = board.map((row, indexRow) => {
                    if (roundGame === indexRow) {
                        return row.map((col) => {
                            if (col.id === indexLetterValue - 1) {
                                return {
                                    ...col,
                                    strGuess: "",
                                };
                            }
                            return col;
                        });
                    }
                    return row;
                });

                setBoard(newBoard);
                setIndexLetterValue(indexLetterValue - 1);
            }

            if (code === "Enter") {
                verifyBoard();
            }
        };

        window.addEventListener("keydown", handleKey);

        return () => window.removeEventListener("keydown", handleKey);
    });

    const verifyBoard = () => {
        if (indexLetterValue < 5)
            return alert("Hacen falta letras en esta palabra");

        const newBoard = board.map((row, rowIndex) =>
            rowIndex === roundGame
                ? row.map((col) => {
                      return {
                          ...col,
                          strState:
                              col.strGuess === col.strCorrect
                                  ? "green"
                                  : word.includes(col.strGuess)
                                  ? "yellow"
                                  : "grey",
                      };
                  })
                : row
        );
        setBoard(newBoard);
        setRoundGame((prevState) => prevState + 1);
        setIndexLetterValue(0);
    };

    return (
        <>
            <div className="board">
                {board.map((row, indexRow) => (
                    <div key={indexRow} className="board-row">
                        {row.map((col, indexCol) => (
                            <p
                                key={col.id}
                                className={`board-col ${
                                    strColor[col.strState]
                                } ${
                                    indexRow === roundGame &&
                                    indexLetterValue === indexCol &&
                                    "strColor-active"
                                }`}
                            >
                                {col.strGuess}
                            </p>
                        ))}
                    </div>
                ))}
            </div>
            <button
                disabled={!(indexLetterValue === 5)}
                className={`btn ${indexLetterValue === 5 && "btn__active"}`}
                onClick={verifyBoard}
            >
                Verificar
            </button>
        </>
    );
};
