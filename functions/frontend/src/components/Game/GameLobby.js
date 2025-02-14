import React, { useState, useEffect } from "react";
import { useMatches } from "../../hooks/useMatches";
import "../../styles/GameLobby.css";

const API_URL = "https://chifoumi.kmarques.dev";

function GameLobby() {
  const { createMatch, joinMatch, getUserMatches } = useMatches();
  const [matches, setMatches] = useState([]);
  const [pastMatches, setPastMatches] = useState([]);
  const [viewHistory, setViewHistory] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      const allMatches = await getUserMatches();
      const openMatches = allMatches.filter((match) => match.user2 === null);
      const completedMatches = allMatches.filter((match) => match.user2 !== null);

      console.log("🎮 Open Matches:", openMatches);
      console.log("📜 Past Matches:", completedMatches);

      setMatches(openMatches);
      setPastMatches(completedMatches);
    };

    fetchMatches();
  }, [getUserMatches]);

  const handleJoinMatch = async () => {
    if (matches.length > 0) {
      // There is an open match, join the first available one
      const matchToJoin = matches[0];
      console.log(`Joining match: ${matchToJoin._id}`);
      await joinMatch(matchToJoin._id);
    } else {
      // No open matches, create a new one
      console.log("No open matches found. Creating a new match...");
      await createMatch();
    }
  };

  return (
    <div className="game-lobby">
      <h2 className="title">Bienvenue au Chifoumi</h2>

      <div className="lobby-options">
        <button onClick={() => setViewHistory(false)}>🔄 Rejoindre une Partie</button>
        <button onClick={() => setViewHistory(true)}>📜 Voir l'Historique</button>
      </div>

      {!viewHistory ? (
        <div className="join-match">
          <h3>🎮 Parties en attente 🎮</h3>
          {matches.length === 0 ? <p>Aucune partie en attente.</p> : <p>{matches.length} parties disponibles.</p>}
          <button onClick={handleJoinMatch}>🚀 Rejoindre une Partie</button>
        </div>
      ) : (
        <div className="match-history">
          <h3>📜 Historique des Parties 📜</h3>
          {pastMatches.length === 0 ? (
            <p>Aucune partie jouée.</p>
          ) : (
            <ul>
              {pastMatches.map((match) => (
                <li key={match._id}>
                  <p><strong>👤 Joueur 1:</strong> {match.user1.username}</p>
                  <p><strong>👤 Joueur 2:</strong> {match.user2?.username || "En attente"}</p>
                  <p><strong>🏆 Résultat:</strong> {match.winner ? match.winner.username : "Match nul"}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default GameLobby;