import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import React from 'react';

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;