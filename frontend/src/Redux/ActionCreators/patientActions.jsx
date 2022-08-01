import base_url from '../../setup/appSetup.jsx';

export const fetchPatients = () => {
    return async(dispatch) => {
        dispatch({type: 'FETCH_PATIENTS_LOADING'});

        try {
            const fetchPatientsReq = await fetch(`${base_url}/patient/all`, {
                method: 'GET',
                credentials: 'include'
            });

            const fetchPatientsReqData = await fetchPatientsReq.json();

            if(fetchPatientsReq.ok) {
                dispatch({
                    type: 'FETCH_PATIENTS_LOADED',
                    payload: fetchPatientsReqData.payload
                })
            } else {

            }
        } catch (err) {
            console.log(err);
        }
    }
}

export const postPatient = (index, patientsMessageHandler) => {
    return async(dispatch, getState) => {

        const patient = getState().patientForm[index];

        if(patient.name !== '' && patient.category !== '' && patient.complain !== '' && 
            patient.visitDate !== ''  && patient.medPrescribed !== '') {
            
            dispatch({type: 'POST_PATIENT_LOADING'});

            try {
                const postPatientReq = await fetch(`${base_url}/patient/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(patient)
                });

                const postPatientReqData = await postPatientReq.json();

                if(postPatientReq.ok) {
                    patientsMessageHandler(postPatientReqData.message);
                    dispatch({
                        type: 'POST_PATIENT_LOADED',
                        payload: postPatientReqData.payload
                    })
                } else {
                    patientsMessageHandler(postPatientReqData.message);
                }
            } catch (err) {
                console.log(err);
            }
            
        } else {
            console.log('Please fill out the details correctly.');
        }
    }
}

export const editPatient = (payload) => {
    return async(dispatch) => {
        const {editData} = payload;
        dispatch({type: 'EDIT_PATIENT_LOADING'});

        try {
            const editPatientReq = await fetch(`${base_url}/patient/update/${payload._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(editData)
            })
        } catch(err) {
            console.log(err);
        }
    }
}

export const deletePatient = (_id, patientsMessageHandler) => {
    return async(dispatch) => {
        dispatch({
            type: 'DELETE_PATIENT_LOADING'
        });

        try {
            const deletePatientReq = await fetch(`${base_url}/patient/delete/${_id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const deletePatientReqData = await deletePatientReq.json();

            if(deletePatientReq.ok) {
                dispatch({
                    type: 'DELETE_PATIENT_LOADED',
                    payload: deletePatientReqData.payload
                });

                patientsMessageHandler(deletePatientReqData.message);
            } else {
                patientsMessageHandler(deletePatientReqData.message);
            }
        } catch (err) {
            console.log(err);
        }
    }
}
 