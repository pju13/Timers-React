import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useStore } from "../Store/useStore";


export const Timerform: React.FC = () => {
    const formikRef = React.useRef<FormikProps<Time>>(null);
    const addHorloge = useStore((state) => state.addHorloge);

    type Time = {
        heure: number
        minute: number
        seconde: number
    };

    const initialValues = {
        heure: 0,
        minute: 1,
        seconde: 0,
    };

    const validationSchema = Yup.object({
        heure: Yup.number()
        .min(0, 'Doit être 0 ou plus')
        .max(24, 'Doit être 24 ou moins'),
        minute: Yup.number()
        .min(0, 'Doit être 0 ou plus')
        .max(59, 'Doit être 59 ou moins'),
        seconde: Yup.number()
        .min(0, 'Doit être 0 ou plus')
        .max(59, 'Doit être 59 ou moins')
        .required('Required'),                
    });

    const onSubmit = (values: Time) => {
        addHorloge(`${values.heure}:${values.minute}:${values.seconde}`)
    }

    const remiseAxMin = (min: number) => {
        if (formikRef.current) {
            formikRef.current.setFieldValue('heure', 0);
            formikRef.current.setFieldValue('minute', min);
            formikRef.current.setFieldValue('seconde', 0);
        }
    }

    const remiseAxHr = (hr: number) => {
        if (formikRef.current) {
            formikRef.current.setFieldValue('heure', hr);
            formikRef.current.setFieldValue('minute', 0);
            formikRef.current.setFieldValue('seconde', 0);
        }
    }

    return (
        <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {() => (
                <Form>
                    <div className="flex flex-col justify-center w-[700px] m-auto">
                        <div className="flex justify-center mt-10 ">
                            <div className="grid grid-cols-1 grid-rows-1 gap-2 justify-center">                      
                                <div className="border-2 border-white rounded-lg relative bg-gray-700">
                                    <p className="absolute top-1 left-15 text-amber-50 text-xl z-10">hr</p>
                                    <p className="absolute top-1 right-55 text-amber-50 text-xl z-10">min</p>
                                    <p className="absolute top-1 right-15 text-amber-50 text-xl z-10">sec</p>                    
                                    <Field type="text" 
                                        id="heure" name="heure"
                                        placeholder="00" 
                                        className="input w-[150px] text-2xl p-15 border-0 bg-gray-700 text-white" />
                                    : <Field type="text" 
                                        id="minute" name="minute" 
                                        placeholder="00" 
                                        className="input w-[150px] text-2xl p-15 border-0 bg-gray-700 text-white" />
                                    : <Field type="text" 
                                        id="seconde" name="seconde"
                                        placeholder="00" 
                                        className="input w-[150px] text-2xl p-15 border-0 bg-gray-700 text-white" />
                                </div>
                            </div>                         
                        </div>
                        <ErrorMessage name="heure" component="div" className="error" />
                        <ErrorMessage name="minute" component="div" className="error" />
                        <ErrorMessage name="seconde" component="div" className="error" />                          
                    </div>
                    <div className="flex justify-end mt-2 w-[550px] m-auto">
                        <div className="grid grid-cols-4 gap-2">
                        <button type="button" className="btn btn-info" onClick={() => remiseAxMin(1)}>1min ⏱</button>
                        <button type="button" className="btn btn-info" onClick={() => remiseAxMin(3)}>3min ⏱</button>
                        <button type="button" className="btn btn-info" onClick={() => remiseAxMin(5)}>5min ⏱</button>
                        <button type="button" className="btn btn-info" onClick={() => remiseAxMin(10)}>10min ⏱</button>
                        <button type="button" className="btn btn-info" onClick={() => remiseAxMin(15)}>15min ⏱</button>
                        <button type="button" className="btn btn-info" onClick={() => remiseAxMin(20)}>20min ⏱</button>
                        <button type="button" className="btn btn-info" onClick={() => remiseAxMin(30)}>30min ⏱</button>
                        <button type="button" className="btn btn-info" onClick={() => remiseAxHr(1)}>1h ⏱</button>
                        <button type="button" className="btn btn-info" onClick={() => remiseAxHr(2)}>2h ⏱</button>
                        </div>
                        <button type="submit" className="btn btn-success ml-4">Ajouter ⏱</button>
                    </div> 
                </Form>
            )}
        </Formik>
    );
}
