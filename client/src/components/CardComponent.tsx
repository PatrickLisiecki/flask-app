import React from "react";

interface Card {
  id: number;
  name: string;
  email: string;
}

const CardComponent: React.FC<{ card: Card }> = ({ card }) => {
  return (
    <div className="w-full bg-gray-200 flex flex-col items-start justify-center p-2">
      <span className="text-md font-bold">{card.id}</span>
      <span className="text-md font-bold">{card.name}</span>
      <span className="text-md font-bold">{card.email}</span>
    </div>
  );
};

export default CardComponent;
