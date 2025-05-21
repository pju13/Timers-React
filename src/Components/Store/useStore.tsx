import { nanoid } from "nanoid";
import { create } from "zustand";
import { convertirHMNenSecondes } from "../../assets/Utils/Utils";
import { Horloge, StoreHorloge } from "../../Types/types";

export const useStore = create<StoreHorloge>((set) => ({
    horloges: [],

    addHorloge: (timer: string) => {
        const secondesTotal = convertirHMNenSecondes(timer);

        if (secondesTotal < 15) {
            alert('Merci de saisir minimum 15s');
            return;
        }

        const idNew = nanoid();
        const newClock: Horloge = {
            id: idNew,
            timerSet: timer,
            timerRemaining: secondesTotal,
            running: true,
            interval: setInterval(() => {
                set(state => ({
                    horloges: state.horloges.map(horloge =>
                        horloge.id === idNew && horloge.running ? {...horloge, timerRemaining: (horloge.timerRemaining-1)} : horloge)}))
            }, 1000),
            stop: false
        }

        set(state => ({ horloges: [...state.horloges, newClock] }));
    },

    pauseHorloge: (id: string) => {
        set(state => ({
            horloges: state.horloges.map(horloge =>
                horloge.id === id ? {...horloge, running: !horloge.running} : horloge)}))
    },

    pauseAllHorloges: () => {
        set((state) => {
            // Mets en pause tous les minuteurs actifs
            state.horloges.forEach(horloge => {
                if (!horloge.stop && horloge.timerRemaining >= 1) {
                    horloge.running = !horloge.running;
                }
            });
            
            // Retourner le nouvel état avec le minuteur stoppé
            return {
                horloges: [...state.horloges]
            };
        }); 
    },

    stopHorloge: (id: string) => {
        set((state) => {
            // Nettoyer l'intervalle avant de retourner le nouvel état
            state.horloges.forEach(horloge => {
                if (horloge.id === id) {
                    //console.log("# Clear Interval et stop, id: ", id);
                    clearInterval(horloge.interval);
                    horloge.stop = true;
                }
            });
            
            // Retourner le nouvel état avec le minuteur stoppé
            return {
                horloges: [...state.horloges]
            };
        });        
    },

    removeHorloge: (id: string) => {
        set((state) => {
            // Nettoyer l'intervalle avant de retourner le nouvel état
            state.horloges.forEach(horloge => {
                if (horloge.id === id) {
                    //console.log("# Clear Interval, id: ", id);
                    clearInterval(horloge.interval);
                }
            });
            
            // Retourner le nouvel état sans le minuteur supprimée
            return {
                horloges: state.horloges.filter(horloge => horloge.id !== id)
            };
        });
    },


    removeOnlyStop: () => {
        set((state) => {          
            // Retourner le nouvel état sans la ou les minuteurs terminées
            return {
                horloges: state.horloges.filter(horloge => horloge.stop === false)
            };
        });        
    },   

    removeAll: () => {
        set((state) => {
            // Nettoyer les intervalles avant de retourner le nouvel état
            state.horloges.forEach(horloge => {
                if (!horloge.stop) {
                    //console.log("# Clear Interval, id: ", horloge.id);
                    clearInterval(horloge.interval);
                }
            });
            
            // Retourner le nouvel état
            return {
                horloges: []
            };
        });        
    },    
}));
