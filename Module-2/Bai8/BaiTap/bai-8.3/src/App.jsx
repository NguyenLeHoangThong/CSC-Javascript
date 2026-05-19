import React from "react";
import { SurveyProvider } from "./contexts/SurveyContext";
import SurveyContainer from "./SurveyContainer";

const App = () => {
  return (
    <SurveyProvider>
      <SurveyContainer />
    </SurveyProvider>
  );
};

export default App;