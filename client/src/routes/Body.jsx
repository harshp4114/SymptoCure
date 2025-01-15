import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

const Body = () => {

  const words=["manageable","easy","personalized",];
  const [newWord, setNewWord] = useState(words[0]);
  const intervalId=setInterval(() => {

    if(newWord==words[0]){
      setNewWord(words[1]);
    }else if(newWord==words[1]){
      setNewWord(words[2]);
    }else if(newWord==words[2]){
      setNewWord(words[0]);
    }
  }, 3000);

  useEffect(()=>{
    return ()=>clearInterval(intervalId);
  })
  useAuth();
  return (
    <div className="w-full h-full bg-[#403CD5] absolute ">
      <div className="w-full h-full flex">
        <div className="w-5/12 h-full"></div>
        <div className="w-7/12 h-full mt-20">
          <h2 className="text-[#FFFFFF] text-8xl font-Gilroy font-extrabold ">
            Making at home
          </h2>
          <h2 className="text-[#FFFFFF] text-8xl font-Gilroy font-extrabold ">
            healthcare
          </h2>
          <div className="w-fit border-dotted flex items-center h-40 p-8 mt-4 border-[3px] border-opacity-50 rounded-2xl border-white ">
            <h2 id="heroHeading" className="text-[#2EE9FF] text-8xl font-Gilroy transition-all duration-700 ease-in-out font-extrabold mb-6">
              {newWord}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
