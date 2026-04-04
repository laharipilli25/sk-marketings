export default function ServiceCube() {
  return (
    <div className="flex justify-center py-10">
      <div style={{ width: 220, height: 220, perspective: '600px' }}>
        <style>{`
          .sk-cube {
            width: 220px; height: 220px;
            position: relative;
            transform-style: preserve-3d;
            animation: skRotate 12s linear infinite;
          }
          .sk-face {
            position: absolute; width: 220px; height: 220px;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            border: 1.5px solid rgba(212,160,23,0.55);
            background: rgba(8,8,15,0.85);
            text-align: center; padding: 18px; box-sizing: border-box;
            backface-visibility: hidden;
          }
          .sk-icon { font-size: 26px; color: #d4a017; margin-bottom: 8px; }
          .sk-name { font-family: 'Cormorant Garamond', serif; font-size: 15px;
            font-weight: 500; color: #faf8f3; line-height: 1.35; margin-bottom: 5px; }
          .sk-tag  { font-family: 'DM Sans', sans-serif; font-size: 10px;
            letter-spacing: 0.18em; text-transform: uppercase; color: rgba(212,160,23,0.75); }
          .sk-line { width: 30px; height: 1px; background: rgba(212,160,23,0.4); margin: 6px auto; }
          .sk-face:nth-child(1) { transform: rotateY(  0deg) translateZ(110px); }
          .sk-face:nth-child(2) { transform: rotateY(180deg) translateZ(110px); }
          .sk-face:nth-child(3) { transform: rotateY( 90deg) translateZ(110px); }
          .sk-face:nth-child(4) { transform: rotateY(-90deg) translateZ(110px); }
          .sk-face:nth-child(5) { transform: rotateX( 90deg) translateZ(110px); }
          .sk-face:nth-child(6) { transform: rotateX(-90deg) translateZ(110px); }
          @keyframes skRotate {
            from { transform: rotateX(10deg) rotateY(0deg); }
            to   { transform: rotateX(10deg) rotateY(360deg); }
          }
          .sk-cube:hover { animation-play-state: paused; }
        `}</style>
        <div className="sk-cube">
          {[
            { icon: '🏛️', name: 'MSME Services',       tag: 'Register · Fund · Comply' },
            { icon: '📣', name: 'Business Promotions',  tag: 'Brand · Expand · Lead' },
            { icon: '📈', name: 'Financial Services',   tag: 'Plan · Optimise · Grow' },
            { icon: '🌐', name: 'Digital Marketing',    tag: 'Rank · Convert · Scale' },
            { icon: '🇮🇳', name: 'SK Marketings',       tag: 'Tirupati · India' },
            { icon: '⭐', name: '500+ Clients',         tag: '10+ Years · 5 Countries' },
          ].map((f) => (
            <div key={f.name} className="sk-face">
              <div className="sk-icon">{f.icon}</div>
              <div className="sk-line" />
              <div className="sk-name">{f.name}</div>
              <div className="sk-tag">{f.tag}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}