import { useMemo, useState } from "react"

const usePagination = (elementsPerPage: number, data: any[]) => {
    const [currentPageNumber, setCurrentPageNumber] = useState(0)

    const paginatedData = useMemo(() => {
        const pages = []
        for (let i = 0; i < data.length; i += elementsPerPage) {
            pages.push(data.slice(i, i + elementsPerPage))
        }
        return pages
    }, [data])

    const currentPage = paginatedData[currentPageNumber] || []
    const totalPages = paginatedData.length

    const goToStep = (step: number) => {
        setCurrentPageNumber(step)
    }

    const forwards = () => {
        if (currentPageNumber == totalPages - 1) return
        setCurrentPageNumber(currentPageNumber + 1)
    }

    const backwards = () => {
        if (currentPageNumber == 0) return
        setCurrentPageNumber(currentPageNumber - 1)
    }

    return {
        currentPage,
        totalPages,
        goToStep,
        currentStep: currentPage,
        currentStepNumber: currentPageNumber,
        forwards,
        backwards,
        isFirst: currentPageNumber == 0,
        isLast: currentPageNumber == totalPages - 1,
    }
}

export { usePagination }
