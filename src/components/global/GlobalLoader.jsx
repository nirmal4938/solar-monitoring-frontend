import { useEffect, useRef } from "react";
import { useLoader } from "../../context/LoadingContext";

export default function GlobalLoader() {

  const { loading } = useLoader();
  const canvasRef = useRef(null);

  useEffect(() => {

    if (!loading) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const gridSize = 60;
    let offset = 0;

    const draw = () => {

      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(30,58,138,0.08)";
      ctx.lineWidth = 1;

      for (let x = -gridSize; x < width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x + offset, 0);
        ctx.lineTo(x + offset, height);
        ctx.stroke();
      }

      for (let y = -gridSize; y < height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y + offset);
        ctx.lineTo(width, y + offset);
        ctx.stroke();
      }

      offset += 0.2;
      if (offset > gridSize) offset = 0;

      requestAnimationFrame(draw);

    };

    draw();

  }, [loading]);

  if (!loading) return null;

  return (

    <div className="global-loader">

      <canvas ref={canvasRef} className="loader-grid"/>

      <div className="loader-center">

        <div className="energy-ring"></div>
        <div className="energy-ring ring2"></div>
        <div className="energy-core"></div>

      </div>

      <style>{`

      .global-loader{
        position:fixed;
        inset:0;
        z-index:9999;
        display:flex;
        align-items:center;
        justify-content:center;
        backdrop-filter:blur(6px);
        background:rgba(248,250,252,0.45);
      }

      .loader-grid{
        position:absolute;
        inset:0;
      }

      .loader-center{
        position:relative;
        width:80px;
        height:80px;
      }

      /* outer rotating ring */

      .energy-ring{
        position:absolute;
        inset:0;
        border-radius:50%;
        border:3px solid rgba(30,58,138,0.2);
        border-top-color:#1e3a8a;
        animation:spin 1.4s linear infinite;
      }

      .energy-ring.ring2{
        inset:8px;
        border-top-color:#2563eb;
        animation-duration:1s;
        animation-direction:reverse;
      }

      /* center pulse */

      .energy-core{
        position:absolute;
        top:50%;
        left:50%;
        width:14px;
        height:14px;
        transform:translate(-50%,-50%);
        background:#1e3a8a;
        border-radius:50%;
        box-shadow:0 0 20px rgba(37,99,235,0.5);
        animation:pulse 1.2s ease-in-out infinite;
      }

      @keyframes spin{
        from{transform:rotate(0deg);}
        to{transform:rotate(360deg);}
      }

      @keyframes pulse{
        0%{transform:translate(-50%,-50%) scale(1);}
        50%{transform:translate(-50%,-50%) scale(1.4);}
        100%{transform:translate(-50%,-50%) scale(1);}
      }

      `}</style>

    </div>

  );

}