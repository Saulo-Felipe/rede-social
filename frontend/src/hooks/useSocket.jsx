import React, { createContext, useContext, useEffect, useState } from "react";

export const SocketContext = createContext({});


export function SocketProvider({ children }) {
  const [allUsers, setAllUser] = useState([]);

  useEffect(() => {
    console.log("Renderizou contexto");
  }, []);

  return (
    <SocketContext.Provider value={{ 
      allUsers, 
      setAllUser 
    }}>
      <div>{ children }</div>
      
    </SocketContext.Provider>
  );
}


export function useSocket() {
  const context = useContext(SocketContext);

  return { ...context }
}
