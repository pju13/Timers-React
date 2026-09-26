import { nanoid } from "nanoid";
import { create } from "zustand";
import { convertirHMNenSecondes } from "../utils/temps";
import { Horloge, StoreHorloge } from "../types/types";

export const useHorlogeStore = create<StoreHorloge>((set, get) => ({
    horloges: [],

    addHorloge: (timer: string) => {
        const secondesTotal = convertirHMNenSecondes(timer);

        if (secondesTotal < 15) {
            alert('Merci de saisir minimum 15s');
            return;
        }

        const idNew = nanoid();

        // Chaque seconde : décompte, puis arrêt dès que le minuteur atteint 0.
        // La règle vit ici et non dans un composant, pour s'appliquer même si rien n'est affiché.
        const decompter = () => {
            set(state => ({
                horloges: state.horloges.map(horloge =>
                    horloge.id === idNew && horloge.running ? {...horloge, timerRemaining: (horloge.timerRemaining-1)} : horloge)}))

            const horloge = get().horloges.find(horloge => horloge.id === idNew);
            if (!horloge) {
                // Horloge disparue du store sans clearInterval : on coupe par sécurité
                clearInterval(interval);
            } else if (horloge.timerRemaining <= 0) {
                get().stopHorloge(idNew);
            }
        };
        const interval = setInterval(decompter, 1000);

        const newClock: Horloge = {
            id: idNew,
            timerSet: timer,
            timerRemaining: secondesTotal,
            running: true,
            interval,
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
        // Bascule chaque minuteur actif en créant une copie : les horloges terminées gardent leur référence
        set(state => ({
            horloges: state.horloges.map(horloge =>
                !horloge.stop && horloge.timerRemaining >= 1 && horloge.running ? {...horloge, running: false} : horloge)}))                
    },

    stopHorloge: (id: string) => {
        // Effet de bord hors de set() : la fonction passée à set doit seulement calculer le nouvel état
        const horlogeAStopper = get().horloges.find(horloge => horloge.id === id);
        if (horlogeAStopper) {
            clearInterval(horlogeAStopper.interval);
        }

        set(state => ({
            horloges: state.horloges.map(horloge =>
                horloge.id === id ? {...horloge, stop: true} : horloge)}))
    },

    removeHorloge: (id: string) => {
        set((state) => {
            // Nettoyer l'intervalle avant de retourner le nouvel état
            state.horloges.forEach(horloge => {
                if (horloge.id === id) {
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
