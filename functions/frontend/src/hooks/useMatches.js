import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import React from "react";

const API_URL = "http://localhost:3002";

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
        console.log("Match créé:", data);
        navigate(`/game/${data._id}`);
        return data._id;
      } else {
        console.error("Erreur lors de la création du match");
        return null;
      }
    } catch (error) {
      console.error("Erreur réseau lors de la création du match:", error);
      return null;
    }
  };

  const joinMatch = async (matchId) => {
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
        console.log(`Match rejoint: ${matchId}`);
        navigate(`/game/${matchId}`);
        return true;
      } else {
        console.error("Erreur en rejoignant la partie");
        return false;
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
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
        console.log("🔍 All Matches received:", allMatches);
        return allMatches;
      } else {
        console.error("Error fetching matches");
        return [];
      }
    } catch (error) {
      console.error("Network error fetching matches:", error);
      return [];
    }
  }, []);

  return { createMatch, joinMatch, getUserMatches };
}
