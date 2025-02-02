"use client";
import React, { useState } from "react";

const Ripple = () => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const addRipple = (event: React.MouseEvent<HTMLSpanElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now();

    setRipples((prevRipples) => [...prevRipples, { x, y, id }]);

    setTimeout(() => {
      setRipples((prevRipples) => prevRipples.filter((ripple) => ripple.id !== id));
    }, 600);
  };

  return (
    <span data-testid="ripple-container" className="absolute inset-0" onClick={addRipple}>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white opacity-50 rounded-full animate-ripple"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}
    </span>
  );
};

export default Ripple;