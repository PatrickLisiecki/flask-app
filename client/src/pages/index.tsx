import React from "react";
import UserInterface from "@/components/UserInterface";

const Home: React.FC = () => {
  return (
    <div className="bg-white text-black min-h-full w-full">
      <UserInterface serverName="flask" />
    </div>
  );
};

export default Home;
