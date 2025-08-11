import { useState, useEffect } from "react";

const useMouseSpeed = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0, speed: 0 });

  useEffect(() => {
    let lastX = 0, lastY = 0, lastTime = Date.now();

    const handleMouseMove = (e) => {
      const now = Date.now();
      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      const deltaTime = now - lastTime;

      const speed = Math.sqrt(deltaX ** 2 + deltaY ** 2) / (deltaTime || 1);
      setMouse({ x: e.clientX, y: e.clientY, speed });

      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mouse;
};

export default useMouseSpeed;
