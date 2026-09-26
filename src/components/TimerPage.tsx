import { DisplayHorloge } from "./DisplayHorloge";
import { TimerForm } from "./formulaire/TimerForm";
import { ViewTimers } from "./ViewTimers";

export function TimerPage() {
    return (
        <div className="relative">
            <ViewTimers />
            <TimerForm />
            <div className="flex flex-none flex-row justify-between w-[1000px] mt-10 m-auto gap-2">
                <DisplayHorloge />
            </div>
        </div>
    );
}
