import React ,{useEffect} from "react";
import ReactDOM from "react-dom/client";

const App = () => {
  
  return (
    <>
      <div className="bg-black w-full text-white">
        <h1 className="text-red-800">hello from new repo</h1>
      </div>
    </>
  );
};



const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(<App />);