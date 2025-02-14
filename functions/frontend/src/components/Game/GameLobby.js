import React, { useState, useEffect } from "react";
import { useMatches } from "../../hooks/useMatches";
import "../../styles/GameLobby.css";

const API_URL = "https://chifoumi.kmarques.dev/";

function GameLobby() {
  const { createMatch, joinMatch, getUserMatches } = useMatches();
  const [matchId, setMatchId] = useState("");
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      const userMatches = await getUserMatches();
      const completedMatches = userMatches.filter(
        (match) => match.user2 !== null
      );
      setMatches(completedMatches);
    };
    fetchMatches();
  }, [getUserMatches]);

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser).username : null;

  const handleCreateMatch = async () => {
    const id = await createMatch();
    if (id) {
      console.log("🚀 Redirection vers /game/" + id);
    }
  };

  const handleJoinMatch = async () => {
    if (!matchId) {
      alert("Veuillez entrer un ID de match !");
      return;
    }
    const success = await joinMatch(matchId);
    if (success) {
      console.log("Match rejoint avec succès !");
    } else {
      alert("Impossible de rejoindre la partie. Vérifiez l'ID.");
    }
  };

  const openMatchDetails = async (matchId) => {
    try {
      const response = await fetch(`${API_URL}/matches/${matchId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedMatch(data);
        setIsModalOpen(true);
      } else {
        console.error("Erreur lors de la récupération du match.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMatch(null);
  };

  return (
    <div className="game-lobby">
      <h2 className="title">Créer ou Rejoindre une Partie</h2>
      <h1>🕹️</h1>

      <div className="create-match">
        <button onClick={handleCreateMatch}>Créer une nouvelle partie</button>
      </div>

      <div className="join-match">
        <input
          type="text"
          placeholder="Entrez l'ID du match"
          value={matchId}
          onChange={(e) => setMatchId(e.target.value)}
        />
        <button className="rejoindre" onClick={handleJoinMatch}>
          Rejoindre
        </button>
      </div>

      <div className="match-history">
        <h3>🕹️ Matchs joués 🕹️ </h3>
        {matches.length === 0 ? (
          <p>Aucun match trouvé.</p>
        ) : (
          <ul>
            {matches.map((match) => {
              const opponent =
                match.user1.username === currentUser
                  ? match.user2.username
                  : match.user1.username;

              return (
                <li key={match._id}>
                  <div className="match-info">
                    <p>
                      <strong>👤 Adversaire:</strong> {opponent}
                    </p>
                    <p>
                      <strong>🏆 Résultat:</strong>{" "}
                      {match.winner
                        ? match.winner.username === currentUser
                          ? "✅ Victoire"
                          : "❌ Défaite"
                        : "🤝 Match nul"}
                    </p>
                  </div>
                  <button onClick={() => openMatchDetails(match._id)}>
                    Détails
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {isModalOpen && selectedMatch && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <h2>🎮 Détails du Match</h2>
            <p>
              <strong>Joueur 1 :</strong> {selectedMatch.user1.username}
            </p>
            <p>
              <strong>Joueur 2 :</strong> {selectedMatch.user2.username}
            </p>

            <h2>📜 Historique des Tours</h2>
            <ul>
              {selectedMatch.turns.map((turn, index) => (
                <li key={index}>
                  <p>
                    <strong>{turn.username} :</strong> {turn.choice}
                  </p>
                </li>
              ))}
            </ul>

            <h2>
              🏆 Gagnant :{" "}
              {selectedMatch.winner
                ? selectedMatch.winner === "draw"
                  ? " Les deux - Égalité"
                  : typeof selectedMatch.winner === "string"
                  ? selectedMatch.winner
                  : selectedMatch.winner.username
                : "Aucun"}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameLobby;
