import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LocomotiveScroll from "locomotive-scroll";
const Body = () => {
  const frames = {
    currentIndex: 0,
    maxIndex: 882,
  };

  let imagesLoaded = 0;
  const images = [];
  const canvasRef = useRef(null);
  const scrollRef = useRef(null);

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    preloadFirstImage(); 
    preloadRemainingImages();
    const locoScroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      multiplier: 3.5, // Adjust the scrolling speed
    });

    // Synchronize Locomotive Scroll with GSAP ScrollTrigger
    locoScroll.on("scroll", ScrollTrigger.update);
  }, []);


  function preloadFirstImage() {
    const firstImageUrl = `/frames/frame_0001.jpeg`; 
    const img = new Image();
    img.src = firstImageUrl;
    img.onload = () => {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const scaleX = canvas.width / img.width;
      const scaleY = canvas.height / img.height;
      const scale = Math.max(scaleX, scaleY);

      const newWidth = img.width * scale;
      const newHeight = img.height * scale;

      const offsetX = canvas.width - newWidth;
      const offsetY = canvas.height - newHeight;

      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(img, offsetX, offsetY, newWidth, newHeight);

      context.fillStyle = "rgba(0, 0, 0, 0.84)";
      context.fillRect(0, 0, canvas.width, canvas.height);

      startAnimation();
    };
  }

  function preloadRemainingImages() {
    for (var i = 1; i <= frames.maxIndex; i++) {
      const imageUrl = `/frames/frame_${i.toString().padStart(4, "0")}.jpeg`;
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === frames.maxIndex) {
          frames.currentIndex = 1;
        }
      };
      images.push(img);
    }
  }

  function loadImage(index) {
    if (index >= 1 && index < frames.maxIndex) {
      const img = images[index];

      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const scaleX = canvas.width / img.width;
      const scaleY = canvas.height / img.height;
      const scale = Math.max(scaleX, scaleY);

      const newWidth = img.width * scale;
      const newHeight = img.height * scale;

      const offsetX = canvas.width - newWidth;
      const offsetY = canvas.height - newHeight;

      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(img, offsetX, offsetY, newWidth, newHeight);

      context.fillStyle = "rgba(0, 0, 0, 0.84)";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function startAnimation() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".parent",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });

    tl.to(frames, {
      currentIndex: frames.maxIndex,
      ease: "power2.out",
      onUpdate: function () {
        loadImage(Math.floor(frames.currentIndex));
      },
    });
  }

  return (
    <div className="w-full top-0 left-0 bg-zinc-900">
      <div className="parent relative top-0 left-0 w-full h-[700vh]">
        <div ref={scrollRef} className="w-full sticky top-0 left-0 h-screen">
          <canvas
            ref={canvasRef}
            className="w-full h-screen"
            id="frame"
          ></canvas>
        </div>
      </div>
    </div>
  );
};

export default Body;
