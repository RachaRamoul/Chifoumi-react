import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const API_URL = "https://chifoumi.kmarques.dev";

function MatchDetails() {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);

  useEffect(() => {
    if (!matchId || matchId === "undefined") {
      console.error("Erreur : matchId est undefined !");
      return;
    }

    const fetchMatchDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/matches/${matchId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMatch(data);
        } else {
          console.error("Erreur lors de la récupération du match.");
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  if (!match) {
    return <h2>Chargement des détails du match...</h2>;
  }

  return (
    <div>
      <h1>Détails du Match</h1>
      <p><strong>Joueur 1 :</strong> {match.user1.username}</p>
      <p><strong>Joueur 2 :</strong> {match.user2.username}</p>
      
      <h2>📜 Historique des Tours</h2>
      <ul>
        {match.turns.map((turn, index) => (
          <li key={index}>
            <p><strong>{turn.username} :</strong> {turn.choice}</p>
          </li>
        ))}
      </ul>
      
      <h2>🏆 Résultat : {match.winner ? match.winner.username : "Match nul"}</h2>
    </div>
  );
}

export default MatchDetails;
