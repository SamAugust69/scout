import { useState } from "react"

const useMultiForm = (formSteps: Array<React.ReactElement>) => {
    const [formStep, setFormStep] = useState(0)

    const forwards = () => {
        setFormStep((prevStep) => {
            if (prevStep < formSteps.length - 1) {
                return prevStep + 1
            }
            return prevStep
        })
    }

    const backwards = () => {
        setFormStep((prevStep) => {
            if (prevStep > 0) {
                return prevStep - 1
            }
            return prevStep
        })
    }

    const goToStep = (step: number) => {
        setFormStep(step)
    }

    return {
        formSteps,
        currentStep: formSteps[formStep],
        currentStepNumber: formStep,
        length: formSteps.length,
        forwards,
        backwards,
        goToStep,
        isFirstStep: formStep === 0,
        isLastStep: formStep === formSteps.length - 1,
    }
}

export default useMultiForm
