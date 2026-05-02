import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Container,
} from "@mui/material";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Review from "./components/Review";

const steps = ["Thông tin", "Sở thích", "Cam kết", "Review"];

const SurveyContainer = () => {
  const [activeStep, setActiveStep] = useState(0);

  const next = () => setActiveStep((s) => s + 1);
  const back = () => setActiveStep((s) => s - 1);

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 5 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && <Step1 next={next} />}
        {activeStep === 1 && <Step2 next={next} back={back} />}
        {activeStep === 2 && <Step3 next={next} back={back} />}
        {activeStep === 3 && <Review back={back} />}
      </Paper>
    </Container>
  );
};

export default SurveyContainer;