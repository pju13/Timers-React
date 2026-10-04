import { Fragment, FocusEvent } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useHorlogeStore } from "../../store/useHorlogeStore";

// Les champs restent des chaînes : « 05 » s'affiche comme sur un minuteur, Yup se charge de la conversion
type Time = {
    heure: string
    minute: string
    seconde: string
};

const deuxChiffres = (valeur: number) => String(valeur).padStart(2, '0');

const CHAMPS = [
    { nom: 'heure', court: 'h', long: 'Heures' },
    { nom: 'minute', court: 'min', long: 'Minutes' },
    { nom: 'seconde', court: 's', long: 'Secondes' },
] as const;

const DUREES_COURANTES = [
    { libelle: '1 min', heure: 0, minute: 1 },
    { libelle: '3 min', heure: 0, minute: 3 },
    { libelle: '5 min', heure: 0, minute: 5 },
    { libelle: '10 min', heure: 0, minute: 10 },
    { libelle: '15 min', heure: 0, minute: 15 },
    { libelle: '20 min', heure: 0, minute: 20 },
    { libelle: '30 min', heure: 0, minute: 30 },
    { libelle: '1 h', heure: 1, minute: 0 },
    { libelle: '2 h', heure: 2, minute: 0 },
];

const DUREE_MINIMUM = 15;

const champ = (max: number, unite: string) => Yup.number()
    .typeError(`Les ${unite} doivent être un nombre.`)
    .integer(`Les ${unite} doivent être un nombre entier.`)
    .min(0, `Les ${unite} vont de 0 à ${max}.`)
    .max(max, `Les ${unite} vont de 0 à ${max}.`);

const validationSchema = Yup.object({
    heure: champ(24, 'heures'),
    minute: champ(59, 'minutes'),
    // La durée minimum est vérifiée ici pour afficher l'erreur dans le formulaire plutôt qu'en alert()
    seconde: champ(59, 'secondes').test('duree-minimum', `Un minuteur dure au moins ${DUREE_MINIMUM} s.`, function (seconde) {
        const { heure, minute } = this.parent;
        return Number(heure ?? 0) * 3600 + Number(minute ?? 0) * 60 + Number(seconde ?? 0) >= DUREE_MINIMUM;
    }),
});

const initialValues: Time = {
    heure: '00',
    minute: '01',
    seconde: '00',
};

export function TimerForm() {
    const addHorloge = useHorlogeStore((state) => state.addHorloge);

    const onSubmit = (values: Time) => {
        // Un champ vidé arrive sous forme de chaîne vide : on le compte comme 0
        const [heure, minute, seconde] = [values.heure, values.minute, values.seconde].map((valeur) => Number(valeur) || 0);
        addHorloge(`${heure}:${minute}:${seconde}`);
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ setValues, setFieldValue, handleBlur }) => (
                <Form noValidate className="flex flex-wrap items-start gap-x-10 gap-y-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-start rounded-2xl bg-graphite px-5 pt-4 pb-3 text-craie">
                            {CHAMPS.map((champ, index) => (
                                <Fragment key={champ.nom}>
                                    {index > 0 ? <span aria-hidden="true" className="px-1 text-5xl font-bold leading-tight text-ardoise">:</span> : null}
                                    <div className="flex flex-col items-center">
                                        <Field type="text"
                                            id={champ.nom} name={champ.nom}
                                            inputMode="numeric" maxLength={2} autoComplete="off"
                                            aria-describedby="erreurs-duree"
                                            onFocus={(e: FocusEvent<HTMLInputElement>) => e.currentTarget.select()}
                                            onBlur={(e: FocusEvent<HTMLInputElement>) => {
                                                handleBlur(e);
                                                if (/^\d$/.test(e.target.value)) setFieldValue(champ.nom, deuxChiffres(Number(e.target.value)));
                                            }}
                                            className="w-[2.6ch] rounded-md bg-transparent text-center text-5xl font-bold leading-tight tabular-nums [font-stretch:75%] focus-visible:outline-signal" />
                                        <label htmlFor={champ.nom} className="text-sm text-ardoise">
                                            <span aria-hidden="true">{champ.court}</span>
                                            <span className="sr-only">{champ.long}</span>
                                        </label>
                                    </div>
                                </Fragment>
                            ))}
                        </div>
                        <div id="erreurs-duree" className="text-sm text-alarme-texte">
                            {CHAMPS.map((champ) => <ErrorMessage key={champ.nom} name={champ.nom} component="p" />)}
                        </div>
                    </div>

                    <div className="flex max-w-md flex-col gap-4">
                        <div role="group" aria-label="Durées courantes" className="flex flex-wrap gap-2">
                            {DUREES_COURANTES.map((duree) => (
                                <button type="button" key={duree.libelle} className="touche"
                                    onClick={() => setValues({ heure: deuxChiffres(duree.heure), minute: deuxChiffres(duree.minute), seconde: '00' })}>
                                    {duree.libelle}
                                </button>
                            ))}
                        </div>
                        <button type="submit" className="touche touche-signal self-start px-6 py-3 text-lg">
                            Lancer le minuteur
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
