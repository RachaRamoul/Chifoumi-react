import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../../styles/MultiPlayerGame.css";

const API_URL = "https://chifoumi.kmarques.dev";

function MultiplayerGame() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [match, setMatch] = useState(null);
  const [turns, setTurns] = useState([]); 
  const [winner, setWinner] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);

  const fetchMatchData = async () => {
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
        console.log("Mise à jour des données du match:", data);

        setMatch(data);
        setTurns(data.turns || []);

        if (data.winner) {
          console.log(`Gagnant: ${data.winner.username || "Égalité"}`);
          setWinner(data.winner.username || "Égalité");
          return;
        }

        if (data.user1 && data.user2) {
          const latestTurn = data.turns[data.turns.length - 1];

          if (!latestTurn || (latestTurn.user1 && latestTurn.user2)) {
            setIsMyTurn(data.user1._id === user._id);
          } else {
            setIsMyTurn(data.user2._id === user._id);
          }
        }
      } else {
        console.error("Erreur lors de la récupération du match.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  useEffect(() => {
    if (!matchId) {
      console.error("Erreur : matchId est NULL");
      return;
    }

    const intervalId = setInterval(fetchMatchData, 3000);
    return () => clearInterval(intervalId);
  }, [matchId, user._id]);

  const playTurn = async (choice) => {
    if (!isMyTurn) {
      alert("Ce n'est pas votre tour !");
      return;
    }

    if (turns.length >= 6) {
      alert("La partie est terminée !");
      return;
    }

    try {
      let turnId;
      if (turns.length === 0 || (turns[turns.length - 1].user1 && turns[turns.length - 1].user2)) {
        turnId = turns.length + 1;
      } else {
        turnId = turns.length;
      }

      console.log(`🎯 Joueur: ${user.username} | Tour: ${turnId} | Choix: ${choice}`);

      const response = await fetch(`${API_URL}/matches/${matchId}/turns/${turnId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ move: choice }),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log("Coup envoyé avec succès !");
        console.log("Réponse backend :", responseData);
        setIsMyTurn(false);

        fetchMatchData();
      } else {
        console.error("Erreur lors de l'envoi du coup :", responseData);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  return (
    <div className="multiplayer-game">
      <h1 className="game-title">
        🎮 Partie en cours : <span className="match-id">{matchId}</span>
      </h1>

      {!match ? (
        <h2 className="loading">🔍 Chargement du match...</h2>
      ) : winner ? (
        <div className="winner-section">
          <h2 className="winner">
            🏆 Le gagnant est : {winner === "draw" ? "Égalité" : winner}
          </h2>
          <button className="back-to-lobby" onClick={() => navigate("/matches")}>
            Retour au lobby
          </button>
        </div>
      ) : (
        <>
          <h2 className={`turn-status ${isMyTurn ? "your-turn" : "waiting"}`}>
            {isMyTurn ? "🟢 C'est votre tour !" : "🔴 Tour de votre adversaire..."}
          </h2>

          <div className="choices">
            <button className={`choice-btn ${!isMyTurn && "disabled"}`} onClick={() => playTurn("rock")} disabled={!isMyTurn}>✊ Pierre</button>
            <button className={`choice-btn ${!isMyTurn && "disabled"}`} onClick={() => playTurn("paper")} disabled={!isMyTurn}>📄 Papier</button>
            <button className={`choice-btn ${!isMyTurn && "disabled"}`} onClick={() => playTurn("scissors")} disabled={!isMyTurn}>✂️ Ciseaux</button>
          </div>

          <div className="game-info">
            <h2>Historique des manches :</h2>
            {turns.length === 0 ? (
              <p className="no-turns-message">⚠️ Aucune manche terminée !</p>
            ) : (
              <ul>
                {turns.map((turn, index) => {
                  let winnerName = "En cours";
                  if (turn.winner === "user1") {
                    winnerName = match.user1.username;
                  } else if (turn.winner === "user2") {
                    winnerName = match.user2.username;
                  }

                  return (
                    <li key={index}>
                      <p>
                        <strong>Tour {index + 1} :</strong> {match.user1.username} vs {match.user2.username} 
                        - 🏆 {winnerName}
                      </p>
                    </li>
                  );
                })}
              </ul>

            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MultiplayerGame;
