import { Stepper, Step, StepLabel, StepIcon } from "@mui/material";
import styled from "@emotion/styled";

const MyStepIcon = styled(StepIcon)({
  fontSize: "2rem",
});

const BookingStepper = ({ activeStep, tripType }) => {
  let steps;
  if (tripType === "roundtrip") {
    steps = [
      "Select Departure Flight",
      "Select Returning Flight",
      "Select Bundle",
      "Select Add-Ons",
      "Enter Information",
      "Confirmation",
      "CheckOut",
    ];
  } else {
    steps = [
      "Select Flight",
      "Select Bundle",
      "Select Add-Ons",
      "Enter Information",
      "Confirmation",
      "CheckOut",
    ];
  }
  const adjustedActiveStep = Math.max(
    tripType === "roundtrip" ? activeStep : activeStep - 1,
    0
  );

  return (
    <Stepper activeStep={adjustedActiveStep} alternativeLabel>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel StepIconComponent={MyStepIcon}>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default BookingStepper;
