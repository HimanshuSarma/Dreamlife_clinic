import base_url from "../../setup/appSetup";

export const postSale = (payload, salesMessageHandler, date) => {
    return async(dispatch, getState) => {
        if(typeof payload.phone === 'number' || payload.phone === '') {
            for(let i = 0; i < payload.products.length; i++) {
                if(payload.products[i].name === '' || typeof payload.products[i].sellingPrice !== 'number' || 
                payload.products[i].sellingPrice <= 0 || typeof payload.products[i].profit !== 'number' || 
                payload.products[i].profit < 0 || typeof payload.products[i].qty !== 'number' || 
                payload.products[i].qty <= 0) {
                    return;
                }
            }
        }

        dispatch({type: 'POST_SALE_LOADING'});
        
        try {
            const postSaleReq = await fetch(`${base_url}/sale/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            const postSaleReqData = await postSaleReq.json();
            
            if(postSaleReq.ok) {
                salesMessageHandler('Sale posted successfully');

                if(postSaleReqData.payload.createdAt.year === date.year && postSaleReqData.payload.createdAt.month === date.month) {
                    dispatch({
                        type: 'POST_SALE_LOADED',
                        payload: postSaleReqData.payload
                    });
                }               
            } else {
                salesMessageHandler(postSaleReqData.message);
                dispatch({
                    type: 'POST_SALE_LOAD_FAILED'
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
} 

export const fetchSalesOfGivenYearAndMonth = (payload) => {
    return async(dispatch) => {
        dispatch({type: 'FETCH_SALES_OF_GIVEN_YEAR_AND_MONTH_LOADING'});

        try {
            const fetchSalesOfGivenYearAndMonthReq = await fetch(
                `${base_url}/sales/year-month/${payload.year}/${payload.month}`, {
                method: 'GET',
                credentials: 'include'
            });

            const fetchSalesOfGivenYearAndMonthReqData = await fetchSalesOfGivenYearAndMonthReq.json();

            if(fetchSalesOfGivenYearAndMonthReq.ok) {
                dispatch({
                    type: 'FETCH_SALES_OF_GIVEN_YEAR_AND_MONTH_LOADED',
                    payload: fetchSalesOfGivenYearAndMonthReqData.payload
                })
            } else {
                dispatch({type: 'FETCH_SALES_OF_GIVEN_YEAR_AND_MONTH_LOAD_FAILED'})
            }
        } catch (err) {
            console.log(err);
        }
    }
}

export const deleteSale = (_id, salesMessageHandler) => {
    return async(dispatch) => {
        dispatch({type: 'DELETE_SALE_LOADING'});

        const deleteSaleReq = await fetch(`${base_url}/sales/delete/${_id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const deleteSaleReqData = await deleteSaleReq.json();

        if(deleteSaleReq.ok) {
            dispatch({
                type: 'DELETE_SALE_LOADED',
                payload: deleteSaleReqData.payload
            });

            salesMessageHandler(deleteSaleReqData.message);
        } else {
            dispatch({type: 'DELETE_SALE_FAILED'});
            salesMessageHandler(deleteSaleReqData.message);
        }
    }
}