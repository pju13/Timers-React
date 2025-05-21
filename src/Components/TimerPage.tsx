import { DisplayHorloge } from "./DisplayHorloges";
import { Timerform } from "./Formulaire/TimerForm";
import { ViewTimers } from "./ViewTimers";

export const TimerPage: React.FC = () => {
    return (
        <div className="relative">
            <ViewTimers />
            <Timerform />
            <div className="flex flex-none flex-row justify-between w-[1000px] mt-10 m-auto gap-2">
                <DisplayHorloge />
            </div>
        </div>
    );
}
