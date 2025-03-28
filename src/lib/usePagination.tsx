import { useEffect, useState } from "react"

const usePagination = (elementsPerPage: number, data: any[]) => {
    const [currentPage, setCurrentPage] = useState(0)
    const [splitData, setSplitData] = useState<any[][]>([])

    const updatePagination = () => {
        var arr = []

        for (var i = 0; i < data.length; i += elementsPerPage) {
            arr.push(data.slice(i, i + elementsPerPage))
        }

        setSplitData(arr)
    }

    useEffect(() => {
        updatePagination()
    }, [data])

    const goToStep = (step: number) => {
        setCurrentPage(step)
    }

    const forwards = () => {
        if (currentPage == splitData.length - 1) return
        setCurrentPage(currentPage + 1)
    }

    const backwards = () => {
        if (currentPage == 0) return
        setCurrentPage(currentPage - 1)
    }

    return {
        currentPage: splitData[currentPage],
        numButtons: splitData.length,
        goToStep,
        currentStep: currentPage,
        forwards,
        backwards,
        isFirst: currentPage == 0,
        isLast: currentPage == splitData.length,
        updatePagination,
    }
}

export { usePagination }
