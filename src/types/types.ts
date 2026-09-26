export type Horloge = {
    id: string
    timerSet: string
    timerRemaining: number
    running: boolean
    interval: number
    stop: boolean
};

export type StoreHorloge = {
    horloges: Horloge[]
    addHorloge: (timer: string) => void
    pauseHorloge: (id: string) => void
    pauseAllHorloges: () => void
    stopHorloge: (id: string) => void
    removeHorloge: (id: string) => void
    removeOnlyStop: () => void
    removeAll: () => void
};
