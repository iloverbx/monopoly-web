
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const BOARD_SIZE = 40;
const LOCAL_STORAGE_KEY = "monopoly_game_state";

export default function MonopolyGame() {
  const [players, setPlayers] = useState([
    { name: "Player 1", position: 0, money: 1500 },
    { name: "Player 2", position: 0, money: 1500 },
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceRoll, setDiceRoll] = useState(null);
  const [snakeEyes, setSnakeEyes] = useState(false);
  const [tradeRequest, setTradeRequest] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setPlayers(parsed.players);
      setCurrentPlayerIndex(parsed.currentPlayerIndex);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ players, currentPlayerIndex })
    );
  }, [players, currentPlayerIndex]);

  const rollDice = () => {
    const roll1 = Math.floor(Math.random() * 6) + 1;
    const roll2 = Math.floor(Math.random() * 6) + 1;
    const total = roll1 + roll2;
    setDiceRoll(total);
    setSnakeEyes(roll1 === 1 && roll2 === 1);

    setPlayers(prev => {
      const updated = [...prev];
      updated[currentPlayerIndex].position = (updated[currentPlayerIndex].position + total) % BOARD_SIZE;
      return updated;
    });

    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
  };

  const addPlayer = () => {
    const newName = \`Player \${players.length + 1}\`;
    setPlayers([...players, { name: newName, position: 0, money: 1500 }]);
  };

  const initiateTrade = (fromIndex, toIndex) => {
    setTradeRequest({ from: fromIndex, to: toIndex });
  };

  const confirmTrade = () => {
    alert(\`Trade confirmed between \${players[tradeRequest.from].name} and \${players[tradeRequest.to].name}\`);
    setTradeRequest(null);
  };

  const cancelTrade = () => setTradeRequest(null);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Web Monopoly Game</h1>
      <div className="space-x-2">
        <Button onClick={rollDice}>Roll Dice</Button>
        <Button onClick={addPlayer}>Add Player</Button>
      </div>
      <div className="text-xl">
        {diceRoll && \`Rolled: \${diceRoll}\`} {snakeEyes && "🎲 Snake Eyes!"}
      </div>

      <div className="grid grid-cols-10 gap-1 border p-2 bg-gray-100">
        {Array.from({ length: BOARD_SIZE }, (_, i) => (
          <div
            key={i}
            className="h-16 w-16 border flex items-center justify-center text-xs bg-white"
          >
            {i}
            {players.map((p, idx) => p.position === i && <div key={idx} className="text-[10px]">👤{idx + 1}</div>)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {players.map((player, idx) => (
          <Card key={idx} className={idx === currentPlayerIndex ? "border border-blue-500" : ""}>
            <CardContent className="p-4 space-y-2">
              <h2 className="text-lg font-semibold">{player.name}</h2>
              <p>Position: {player.position}</p>
              <p>Money: ${player.money}</p>
              <Button onClick={() => initiateTrade(currentPlayerIndex, idx)} disabled={idx === currentPlayerIndex}>Trade With</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {tradeRequest && (
        <div className="p-4 bg-yellow-100 border mt-4">
          <p>
            Trade request from {players[tradeRequest.from].name} to {players[tradeRequest.to].name}
          </p>
          <div className="space-x-2 mt-2">
            <Button onClick={confirmTrade}>Confirm</Button>
            <Button onClick={cancelTrade}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}
