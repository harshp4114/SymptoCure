import React, { useEffect, useRef, useState } from "react";

const ScrollingMarquee = ({ text = "Keep Scrolling", logoSrc, speed = 100 }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [items, setItems] = useState([]);

  // SVG logo for the marquee
  const defaultLogo = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 110 21"
      className="h-6 mb-1 ml-4"
    >
      <path
        fill="#4846BF"
        fillRule="evenodd"
        d="M51.329 3.484 52.035 0l.705 3.463 3.163 15.812h2.275l4.509-6.071 4.074 5.735 2.434-2.018 2.23 2.354h34.357c.397 0 .718.31.718.695a.706.706 0 0 1-.718.694H70.793l-1.718-1.814L66.483 21l-3.822-5.38-3.747 5.044h-4.186L52.097 7.397 49.64 20.664h-5.455l-2.72-3.562-3.04 3.562H1.218A.707.707 0 0 1 .5 19.97c0-.383.321-.694.718-.694h36.53l3.78-4.428 3.382 4.428h3.518l2.9-15.79Z"
        clipRule="evenodd"
      />
    </svg>
  );

  useEffect(() => {
    if (!containerRef.current) return;
    
    const calculateItemsNeeded = () => {
      const containerWidth = containerRef.current.offsetWidth;
      setContainerWidth(containerWidth);
      return Math.ceil((containerWidth * 2) / 200) + 2;
    };

    setItems(Array(calculateItemsNeeded()).fill(null));

    const handleResize = () => {
      setItems(Array(calculateItemsNeeded()).fill(null));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="overflow-hidden rounded-l-full shadow-xl shadow-black/20 rounded-r-full w-full flex items-center pb-2 h-full bg-indigo-50 border-t border-b border-indigo-100"
      ref={containerRef}
    >
      <div
        className="flex whitespace-nowrap animate-scroll"
        style={{ animationDuration: `${containerWidth / speed}s` }}
      >
        {[...items, ...items].map((_, index) => (
          <div key={index} className="inline-flex items-center mx-2">
            <span className="text-indigo-600 text-xl mt-1 font-medium">
              {text}
            </span>
            {logoSrc ? (
              <img src={logoSrc} alt="Logo" className="h-12" />
            ) : (
              defaultLogo
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingMarquee;
