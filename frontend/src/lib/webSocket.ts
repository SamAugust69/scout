const ConnectToWebsocket = (
    address: string,
    onOpen?: () => void,
    onMessage?: (e: MessageEvent<any>) => void,
    onError?: () => void
) => {
    const socket = new WebSocket(`wss://${address}`)

    socket.addEventListener("open", () => {
        if (onOpen) onOpen()
        console.log("Connected")
    })

    socket.addEventListener("error", () => {
        if (onError) onError()
        console.log("Error")
    })

    socket.addEventListener("message", (e) => {
        if (onMessage) onMessage(e)
    })

    return socket
}

export { ConnectToWebsocket }
