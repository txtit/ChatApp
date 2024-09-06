import React,{Suspense,lazy} from "react";
import Chats from "./Chats";

// dynamic import
const Cat = lazy(() =>import("../../components/Cat"));

const GeneralApp = () => {

  return (
    <>
    
     {/* Chat  */}
     <Chats/>
    </>
  );
};

export default GeneralApp;
