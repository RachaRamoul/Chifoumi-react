import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import React from "react";

const API_URL = "https://chifoumi.kmarques.dev";

export function useMatches() {
  const navigate = useNavigate();

  const createMatch = async () => {
    try {
      const response = await fetch(`${API_URL}/matches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const matchId = data._id;

        if (!matchId) {
          alert("Erreur lors de la création du match. Réessayez.");
          return null;
        }

        console.log("Match créé :", data.matchId);
        navigate(`/game/${matchId}`);
        return matchId;
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de la création du match :", errorData);
        return null;
      }
    } catch (error) {
      console.error("Erreur réseau lors de la création du match :", error);
      return null;
    }
  };

  const joinMatch = async (matchId) => {
    if (!matchId) {
      alert("Veuillez entrer un ID de match valide !");
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/matches/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ matchId }),
      });

      if (response.ok) {
        navigate(`/game/${matchId}`);
        return true;
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de la tentative de rejoindre le match :", errorData);
        return false;
      }
    } catch (error) {
      console.error("Erreur réseau lors de la tentative de rejoindre le match :", error);
      return false;
    }
  };

  const getUserMatches = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/matches`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const allMatches = await response.json();
        console.log("🔍 Données brutes reçues :", allMatches);

        const storedUser = localStorage.getItem("user");
        const currentUser = storedUser ? JSON.parse(storedUser).username : null;
        console.log("Utilisateur actuel :", currentUser);

        if (!currentUser) {
          console.error("Aucun utilisateur trouvé, aucun match ne peut être filtré.");
          return [];
        }

        const userMatches = allMatches.filter((match) => {
          console.log("Vérification match:", match);
          console.log("user1:", match.user1?.username, " | user2:", match.user2?.username);
          return match.user1?.username === currentUser || match.user2?.username === currentUser;
        });

        console.log("Matchs filtrés :", userMatches);
        return userMatches;
      } else {
        console.error("Erreur lors de la récupération des matchs");
        return [];
      }
    } catch (error) {
      console.error("Erreur réseau lors de la récupération des matchs :", error);
      return [];
    }
  }, []);

  return { createMatch, joinMatch, getUserMatches };
}