import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import gsap from "gsap";
import { helix } from "ldrs";
import ScrollingMarquee from "../components/ScrollingMarquee";
import { Link, useNavigate } from "react-router-dom";
import { ScrollTrigger } from "gsap/all";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { windowRefresh } from "../utils/constants";
import { faker } from "@faker-js/faker";
import {
  doctorQualifications,
  doctorSpecializations,
} from "../utils/constants";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Body = () => {
  const words = ["manageable.", "easy.", "personalized."];
  const [firstWord, setFirstWord] = useState(words[0]);
  const [secondWord, setSecondWord] = useState(words[1]);
  const navigate = useNavigate();
  helix.register();
  useAuth();
  windowRefresh();
  gsap.registerPlugin(ScrollTrigger);

  const generateDoctors = async () => {
    try {
      for (const sp of doctorSpecializations) {
        const numberOfDoctors = faker.number.int({ min: 10, max: 15 });
        for (let i = 0; i < numberOfDoctors; i++) {
          const gender=faker.person.sexType();
          const firstName=faker.person.firstName(gender);
          const lastName=faker.person.lastName(gender);
          const email=firstName+lastName+"@gmail.com";
          const values = {
            gender: gender,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: '9'+faker.string.numeric(9),
            specialization: sp,
            password: "12345678",
            qualifications: faker.helpers.arrayElements(
              doctorQualifications,
              faker.number.int({ min: 1, max: 4 })
            ),
            experience: faker.number.int({ min: 1, max: 40 }),
            hospital: faker.company.name()+" Hospital",
            city: faker.location.city(),
            state: faker.location.state(),
            country: faker.location.country(),
            zipCode: faker.location.zipCode(),
          };
          const response=await axios.post(`${BASE_URL}/api/doctor/`,values);
          console.log("result of doctor ",response?.data);
        }
      }
    } catch (err) {
      console.log("error in generating doctor",err);
    }
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
              prevWord === "manageable." ? "personalized." : "manageable."
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
    gsap.from(".detect-img", {
      scrollTrigger: {
        trigger: ".f-trigger",
        start: "top 50%", // Start animating earlier
        end: "top 20%", // Smoothly stop animation
        // scrub: 1, // Smooth scrolling effect
        // markers: true, // Keep for debugging, remove later
      },
      x: 200, // Start from right and move to default position
      opacity: 0, // Start hidden and fade in
      duration: 2, // Needed if scrub is removed
      display: "none", // Needed if scrub is removed
    });

    gsap.from(".consult", {
      scrollTrigger: {
        trigger: ".c-trigger",
        start: "top 50%", // Start animating earlier
        end: "top 20%", // Smoothly stop animation
        // scrub: 1, // Smooth scrolling effect
        // markers: true, // Keep for debugging, remove later
      },
      x: 200, // Start from right and move to default position
      opacity: 0, // Start hidden and fade in
      duration: 2, // Needed if scrub is removed
      display: "none", // Needed if scrub is removed
    });

    gsap.to(".second-1", {
      scrollTrigger: {
        trigger: ".second-trigger",
        start: "top 40%",
        end: "top 0%",
        scrub: 1,
        // markers: true,
      },
      duration: 1,
      color: "#1E1B4B",
    });

    gsap.to(".second-2", {
      scrollTrigger: {
        trigger: ".second-trigger",
        start: "top 40%",
        end: "top 0%",
        scrub: 1,
        // markers: true,
      },
      duration: 1,
      color: "#1E1B4B",
    });

    // generateDoctors();
    // console.log("DONEEEEEEEEEE!!!!!");
  }, []);

  return (
    <div className="w-full h-[500vh] bg-[#403CD5] absolute">
      <div className="w-full h-[100vh]">
        <div className="absolute z-0 top-[13.9rem] left-[6rem]">
          <l-helix size="380" speed="2.5" color="#16165C"></l-helix>
        </div>
        <div className="absolute z-0 top-8 left-[6rem]">
          <l-helix size="380" speed="2.5" color="#16165C"></l-helix>
        </div>
        <div className="absolute z-0 top-[13.9rem] left-[3.5rem]">
          <l-helix size="380" speed="2.5" color="white"></l-helix>
        </div>
        <div className="absolute z-0 top-8 left-[3.5rem]">
          <l-helix size="380" speed="2.5" color="white"></l-helix>
        </div>

        <div className="z-50 w-full h-full flex">
          <div className="w-5/12 h-full"></div>
          <div className="w-7/12 h-full mt-20">
            <h2 className="text-[#FFFFFF] text-8xl font-Gilroy font-extrabold">
              Making at home
            </h2>
            <h2 className="text-[#FFFFFF] text-8xl font-Gilroy font-extrabold">
              healthcare
            </h2>
            <div className="container w-[640px] h-32 overflow-hidden justify-end border-dotted items-start p-4 pt-2 mt-4  border-[3px] border-opacity-50 rounded-2xl border-white">
              {/* The animated element */}
              <h2 className="heroHeading1 text-[#2EE9FF] text-8xl ml-2 font-Gilroy font-extrabold mb-6">
                {firstWord}
              </h2>
              <h2 className="heroHeading2 text-[#2EE9FF] text-8xl ml-2 font-Gilroy font-extrabold mb-6">
                {secondWord}
              </h2>
            </div>
            <div className="mt-16 font-Gilroy text-3xl text-white font-semibold">
              <h2>Revolutionizing healthcare with disease detection,</h2>
              <h2>remote care logistics, and patient support.</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Second section */}
      <div className="second-trigger w-full h-[100vh] bg- flex flex-wrap content-center items-center justify-center">
        <h2 className="second-1 w-full text-center font-Gilroy text-white font-semibold text-8xl ">
          Focused on health,
        </h2>
        <h2 className="second-2 w-full text-center font-Gilroy text-white font-semibold text-8xl ">
          so you can focus on life.
        </h2>
        <div className="h-16 w-96 mt-14">
          <ScrollingMarquee text="KEEP SCROLLING" speed={10} />
        </div>
      </div>

      {/* Third section */}
      {/* <div className="third h-[100vh] px-10 bg-white flex items-center rounded-t-3xl">
        <div className="flex items-center w-full h-40">
          <h2 className="font-Gilroy font-bold text-[#232269] text-8xl mr-6">
            Let's show you{" "}
          </h2>
          <div className="relative button-trigger button-move top-2 w-48 h-16 mt-2">
            <button
              onClick={() => navigate("/consultancy")}
              type="submit"
              className="bg-[#ffffff] p-2 text-[#232269] text-md border-8 border-[#403CD5] font-Gilroy hover:border-[#8366E5] transition-all duration-500 h-full font-bold py-2 px-4 rounded-full w-full relative overflow-hidden group" */}
      {/* > */}
      {/* Default Text */}
      {/* <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                Consult a Doctor
              </span> */}

      {/* Hover Text */}
      {/* <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                Consult a Doctor
              </span>
            </button>
          </div>
          <h2 className="font-Gilroy font-bold text-[#232269] ml-6 text-8xl">
            how we do it
          </h2>
        </div>
      </div> */}

      {/* Fourth section */}
      <div className="f-trigger bg-indigo-950 h-[100vh] flex">
        {/* Left side content */}
        <div className="w-1/2 p-16 pt-0 flex justify-center flex-col">
          {/* Top section with user icon */}
          <div className="mb-6 flex justify-between items-end">
            <div className="bg-[#16165C] shadow-xl  w-12 h-12 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3a3 3 0 00-3 3v1a3 3 0 00-3 3v3a3 3 0 003 3v1a3 3 0 003 3M15 3a3 3 0 013 3v1a3 3 0 013 3v3a3 3 0 01-3 3v1a3 3 0 01-3 3M9 3h6M9 21h6M12 3v18"
                />
              </svg>
            </div>
            <div className="text-cyan-400 font-Gilroy text-lg">01.</div>
          </div>
          <div className="border-b-[1px] border-blue-400 border-opacity-20 mb-12"></div>

          {/* Numbered indicator */}

          {/* Main heading */}
          <div className="mb-6">
            <h1 className="text-5xl font-Gilroy font-bold text-white">
              First, SymptoCure{" "}
              <span className=" font-Gilroy text-cyan-400">analyzes</span>{" "}
              user-reported symptoms to <br />
              <span className="text-cyan-400 font-Gilroy">detect</span>{" "}
              potential diseases. <br />
            </h1>
          </div>

          {/* Description text */}
          <div className="mt-4 max-w-xl">
            <p className="text-white font-Gilroy text-lg">
              SymptoCure leverages its advanced Machine Learning model to
              analyze symptoms and identify potential diseases, guiding users
              toward appropriate healthcare solutions.
            </p>
          </div>
          <div className="relative button-trigger button-move top-2 w-40 h-12 mt-4">
            <button
              onClick={() => navigate("/disease-detection")}
              type="submit"
              className="bg-[#ffffff] p-2 text-[#232269] text-sm border-[7px] border-[#403CD5] font-Gilroy hover:border-[#8366E5] transition-all duration-500 h-full font-bold py-2 px-4 rounded-full w-full relative overflow-hidden group"
            >
              {/* Default Text */}
              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                Detect Disease
              </span>

              {/* Hover Text */}
              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                Detect Disease
              </span>
            </button>
          </div>
        </div>

        {/* Right side content */}
        <div className="w-1/2 bg-[#232269] p-12 flex flex-col items-end justify-center">
          {/* Request Demo button */}

          <div className="detect-img w-full h-8/12 mt-14 rounded-xl">
            <img
              src="./images/p1.jpg"
              className="rounded-3xl shadow-2xl shadow-black/40 w-full h-full"
            ></img>
          </div>
        </div>
      </div>

      {/* Fifth section */}
      <div className="c-trigger bg-indigo-950 h-[100vh] flex">
        {/* Left side content */}
        <div className="w-1/2 p-16 pt-0 flex justify-center flex-col">
          {/* Top section with user icon */}
          <div className="mb-6 flex justify-between items-end">
            <div className="bg-[#16165C] shadow-xl  w-12 h-12 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#00FFAA]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="text-[#00FFAA] font-Gilroy text-lg">02.</div>
          </div>
          <div className="border-b-[1px] border-blue-400 border-opacity-20 mb-12"></div>

          {/* Numbered indicator */}

          {/* Main heading */}
          <div className="mb-6">
            <h1 className="text-5xl font-Gilroy font-bold text-white">
              SymptoCure{" "}
              <span className=" font-Gilroy text-[#00FFAA]">
                connects users
              </span>{" "}
              with specialized doctors based on the detected disease for <br />
              <span className="text-[#00FFAA] font-Gilroy">
                expert consultation
              </span>{" "}
              and treatment guidance. <br />
            </h1>
          </div>

          {/* Description text */}
          <div className="mt-2 max-w-xl">
            <p className="text-white font-Gilroy text-lg">
              SymptoCure enables remote doctor consultations, connecting users
              with specialists for expert diagnosis and tailored treatment
              plans.
            </p>
          </div>
          <div className="relative button-trigger button-move top-2 w-40 h-14 mt-4">
            <button
              onClick={() => navigate("/consultancy")}
              type="submit"
              className="bg-[#ffffff] p-2 text-[#232269] text-sm border-[7px] border-[#403CD5] font-Gilroy hover:border-[#8366E5] transition-all duration-500 h-full font-bold py-2 px-4 rounded-full w-full relative overflow-hidden group"
            >
              {/* Default Text */}
              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                Get Consultancy
              </span>

              {/* Hover Text */}
              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                Get Consultancy
              </span>
            </button>
          </div>
        </div>

        {/* Right side content */}
        <div className="w-1/2 bg-[#232269] p-12 flex flex-col items-end justify-start">
          {/* Request Demo button */}

          <div className="w-full h-8/12 mt-14 rounded-xl">
            <img
              src="./images/p2.jpg"
              className="consult rounded-3xl shadow-2xl shadow-black/40 w-full h-full"
            ></img>
          </div>
        </div>
      </div>

      {/* {sixth section} */}
      <div className="w-full h-[100vh] flex justify-center items-center bg-white">
        <footer className="w-9/12 h-9/12 rounded-3xl flex items-center justify-center bg-[#232269] text-white px-6 py-12">
          <div className="max-w-8xl mx-auto px-4 lg:px-8">
            {/* Footer top section with main heading */}
            <div className="text-center mb-10">
              <h2 className="text-white font-Gilroy text-5xl font-semibold leading-tight">
                Making at-home healthcare
                <span className="text-[#2EE9FF]"> accessible</span>
              </h2>
              <p className="mt-4 text-white text-xl max-w-2xl mx-auto">
                Revolutionizing healthcare with disease detection, remote care
                logistics, and patient support.
              </p>
            </div>

            {/* Divider */}
            <div className="border-b border-indigo-700 border-opacity-40 mb-10"></div>

            {/* Main footer content */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Company info */}
              <div className="md:col-span-4">
                <div className="mb-4">
                  <h3 className="font-Gilroy font-bold text-3xl mb-4">
                    SymptoCure
                  </h3>
                  <p className="text-gray-300">
                    Focused on health, so you can focus on life. Trusted by
                    medical professionals nationwide for healthcare solutions.
                  </p>
                </div>

                <div className="relative button-trigger button-move top-2 w-36 h-12 mt-2">
                  <a
                    href="mailto:harshpatadia4114@gmail.com"
                    className="w-full h-full"
                  >
                    <button
                      type="submit"
                      className="bg-[#ffffff] p-2 text-[#232269] text-sm border-[7px] border-[#403CD5] font-Gilroy hover:border-[#8366E5] transition-all duration-500 h-full font-bold py-2 px-4 rounded-full w-full relative overflow-hidden group"
                    >
                      {/* Default Text */}
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                        Contact Us
                      </span>

                      {/* Hover Text */}
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                        Contact Us
                      </span>
                    </button>
                  </a>
                </div>
              </div>

              {/* Quick links */}
              <div className="md:col-span-3">
                <h3 className="font-Gilroy font-bold text-3xl mb-6">
                  Services
                </h3>
                <ul className="space-y-3">
                  <li className=" text-md">
                    <Link to="/disease-detection" className="hover:text-[#2EE9FF]  transition-colors duration-300">Disease Detection</Link>
                  </li>
                  <li className="text-md ">
                    <Link to="/consultancy" className="hover:text-[#2EE9FF]  transition-colors duration-300">Doctor Consultations</Link>
                  </li>
                 
                </ul>
              </div>

              {/* Trusted by section */}
              <div className="md:col-span-5">
                <h3 className="font-Gilroy font-bold text-center text-3xl mb-6">
                  Trusted By
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-indigo-700 rounded-lg flex items-center justify-center p-4 h-16">
                    <div className="text-white text-lg font-bold">
                      br
                      <span className="relative">
                        oo
                        <span className="absolute -top-1 left-0 right-0 w-full h-6 border-t-2 border-white"></span>
                      </span>
                      k
                    </div>
                  </div>

                  <div className="border border-indigo-700 rounded-lg flex items-center justify-center p-4 h-16">
                    <div className="text-white">
                      <span className="font-bold">firefly</span>
                      <span>health</span>
                    </div>
                  </div>

                  <div className="border border-indigo-700 rounded-lg flex items-center justify-center p-4 h-16">
                    <div className="text-white font-serif">
                      <span>Penn Medicine</span>
                    </div>
                  </div>

                  <div className="border border-indigo-700 rounded-lg flex items-center justify-center p-4 h-16">
                    <div className="text-white">
                      <span className="font-bold">dreem</span>health
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer bottom section */}
            <div className="border-t border-indigo-700 border-opacity-40 mt-10 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-md text-gray-400 mb-4 md:mb-0">
                  © 2025 SymptoCure. All rights reserved.
                </div>

                <div className="flex space-x-6 mb-4 md:mb-0">
                  <p className="text-md text-gray-400 cursor-default hover:text-white transition-colors duration-300">
                    Privacy Policy
                  </p>
                  <p className="text-md text-gray-400 cursor-default hover:text-white transition-colors duration-300">
                    Terms of Service
                  </p>
                  <p className="text-md text-gray-400 cursor-default hover:text-white transition-colors duration-300">
                    FAQ
                  </p>
                </div>

                <div className="flex space-x-4">
                  <a
                    href="https://x.com/?lang=en"
                    aria-label="Twitter"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/harsh-patadia-a677a4289/"
                    aria-label="LinkedIn"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                    </svg>
                  </a>
                  
                </div>
              </div>
            </div>
          </div>
        </footer>
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
