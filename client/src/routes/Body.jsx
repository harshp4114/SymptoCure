import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import gsap from "gsap";

const Body = () => {
  const words = ["manageable", "easy", "personalized"];
  const [firstWord, setFirstWord] = useState(words[0]);
  const [secondWord, setSecondWord] = useState(words[1]);
  const setNewWord = (Word) => {
    const currentIndex = words.indexOf(Word);
    const nextIndex = (currentIndex + 1) % words.length;
    return words[nextIndex];
  };
  //manage 640px
  //easy 276px
  // person 628px
  useEffect(() => {
    setTimeout(() => {
      const tl1 = gsap.timeline({ repeat: -1 });
      const tl2 = gsap.timeline({ repeat: -1 });
      const tl3 = gsap.timeline({ repeat: -1 });

      tl1.fromTo(
        ".heroHeading1",
        { y: 0 },
        {
          y: -220,
          duration: 1,
          onComplete: () => {
            setFirstWord((prevWord) =>
              prevWord === "manageable" ? "personalized" : "manageable"
            );
          },
        }
      );

      tl3.fromTo(
        ".container",
        { width: "640px" },
        { width: "276px", duration: 1 }
      );

      tl2.fromTo(
        ".heroHeading2",
        { y: 0 },
        {
          y: -120,
          duration: 1,
        }
      );
      tl3.to(".container", { duration: 2 });
      tl2.to(".heroHeading2", { duration: 2 });
      tl1.set(".heroHeading1", { y: 220 });

      tl2.fromTo(".heroHeading2", { y: -120 }, { y: -250, duration: 1 });
      tl2.to(".heroHeading2", { duration: 2 });
      tl1.to(".heroHeading2", { duration: 2 });

      tl3.fromTo(
        ".container",
        { width: "276px" },
        { width: "640px", duration: 1 }
      );
      tl1.fromTo(".heroHeading1", { y: 220 }, { y: 0, duration: 1 });
      tl3.to(".container", { duration: 2 });

      tl1.to(".heroHeading1", { duration: 2 });
      tl2.set(".heroHeading2", { y: 0 });
    }, 1000);
  }, []);

  useAuth();

  return (
    <div className="w-full h-full bg-[#403CD5] absolute">
      <div className="w-full h-full flex">
        <div className="w-5/12 h-full"></div>
        <div className="w-7/12 h-full mt-20">
          <h2 className="text-[#FFFFFF] text-8xl font-Gilroy font-extrabold">
            Making at home
          </h2>
          <h2 className="text-[#FFFFFF] text-8xl font-Gilroy font-extrabold">
            healthcare
          </h2>
          <div className="container w-[640px] h-40 overflow-hidden border-dotted items-start p-8 pt-5 mt-4 border-[3px] border-opacity-50 rounded-2xl border-white">
            {/* The animated element */}
            <h2 className="heroHeading1 text-[#2EE9FF] text-8xl font-Gilroy font-extrabold mb-6">
              {firstWord}
            </h2>
            <h2 className="heroHeading2 text-[#2EE9FF] text-8xl font-Gilroy font-extrabold mb-6">
              {secondWord}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;

// one master timeline idea for the animation
// useEffect(() => {
//   setTimeout(() => {
//     const tl1 = gsap.timeline({ repeat: -1 });
//     // const tl1 = gsap.timeline({ repeat: -1 });
//     // const tl1 = gsap.timeline({ repeat: -1 });

//     tl1
//       .fromTo(
//         ".heroHeading1",
//         { y: 0 },
//         {
//           y: -220,
//           duration: 1,
//         }
//       )

//       .fromTo(
//         ".container",
//         { width: "640px" },
//         { width: "276px", duration: 1 },
//         "<"
//       )

//       .fromTo(
//         ".heroHeading2",
//         { y: 0 },
//         {
//           y: -120,
//           duration: 1,
//         },
//         "<"
//       )
//       .to(".container", { duration: 2 })
//       .to(".heroHeading2", { duration: 2 }, "<")
//       .set(".heroHeading1", { y: 220 }, "<")

//       .fromTo(".heroHeading2", { y: -120 }, { y: -250, duration: 1 })
//       .to(".heroHeading2", { duration: 2 }, "<")
//       .to(".heroHeading2", { duration: 2 }, "<")
//       .fromTo(
//         ".container",
//         { width: "276px" },
//         { width: "640px", duration: 1 },
//         "<"
//       )
//       .fromTo(".heroHeading1", { y: 220 }, { y: 0, duration: 1 }, "<")
//       .to(".container", { duration: 2 }, "<")

//       .to(".heroHeading1", { duration: 2 })
//       .set(".heroHeading2", { y: 0 }, "<");
//   }, 1000);
// }, []);
