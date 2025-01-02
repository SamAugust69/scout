import { useState } from "react"

const useMultiForm = (formSteps: Array<React.ComponentType<any>>) => {
    const [currentStep, setCurrentStep] = useState<number>(0)
    const forwards = () => {
        setCurrentStep((prevStep) =>
            Math.min(prevStep + 1, formSteps.length - 1)
        )
    }

    const backwards = () => {
        setCurrentStep((prevStep) => Math.max(prevStep - 1, 0))
    }

    const goToStep = (step: number) => {
        if (step >= 0 && step < formSteps.length) {
            setCurrentStep(step)
        }
    }

    return {
        CurrentComponent: formSteps[currentStep],
        currentStepNumber: currentStep,
        length: formSteps.length,
        forwards,
        backwards,
        goToStep,
        isFirstStep: currentStep === 0,
        isLastStep: currentStep === formSteps.length - 1,
    }
}

export default useMultiForm
