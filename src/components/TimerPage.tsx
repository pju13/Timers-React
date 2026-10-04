import { DisplayHorloge } from "./DisplayHorloge";
import { TimerForm } from "./formulaire/TimerForm";
import { ViewTimers } from "./ViewTimers";

export function TimerPage() {
    return (
        <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8 sm:py-12">
            <header>
                <h1 className="text-2xl font-extrabold tracking-tight [font-stretch:125%]">Minuteurs</h1>
                <p className="text-encre-douce">Plusieurs comptes à rebours en parallèle, chacun sur son cadran.</p>
            </header>
            <TimerForm />
            <ViewTimers />
            <DisplayHorloge />
        </main>
    );
}
