import React, { useState, useEffect } from "react";
import { useMatches } from "../../hooks/useMatches";
import "../../styles/GameLobby.css";

const API_URL = "http://localhost:3002";

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
      setMatches(openMatches);
      setPastMatches(completedMatches);
    };

    fetchMatches();
  }, [getUserMatches]);

  const handleJoinMatch = async () => {
    if (matches.length > 0) {
      const matchToJoin = matches[0];
      console.log(`Joining match: ${matchToJoin._id}`);
      await joinMatch(matchToJoin._id);
    } else {
      console.log("No open matches found. Creating a new match...");
      await createMatch();
    }
  };

  return (
    <div className="game-lobby">
      <h2 className="title">Bienvenue au Chifoumi</h2>

      <div className="lobby-options">
        <button onClick={() => setViewHistory(true)}>📜 Voir l'Historique</button>
      </div>

      {!viewHistory ? (
        <div className="join-match">
          <button onClick={handleJoinMatch}>🚀 Rejoindre ou Créer une Partie</button>
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
                  <p><strong>🏆 Résultat:</strong> {match.winner ? (typeof match.winner === "object" ? match.winner.username : match.winner) : "Match nul"}</p>
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