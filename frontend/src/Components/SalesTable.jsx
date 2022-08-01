import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {AiFillEdit, AiFillDelete} from "react-icons/ai";

import {deleteSale} from '../Redux/ActionCreators/salesActions';

const SalesTable = ({comp, setShowSales, salesMessageHandler}) => {

  const {salesOfGivenYearAndMonth} = useSelector(store => store.salesOfGivenYearAndMonth);

  const salesArray = comp === 'sales-list' ? salesOfGivenYearAndMonth : [];

  const dispatch = useDispatch();

  return (
    <>
    {(salesArray && salesArray.length > 0) && 
    <div className="layout-container">
        <table className='layout-table'>
        <tbody className='layout-tablebody'>
        {salesArray.map((currentSaleObj, currentSaleIndex) => {
            return (
                <React.Fragment key={currentSaleIndex}>
                <tr className='layout-tableheading'>
                    <th className="layout-tableheader">Sl.No</th>
                    <th className="layout-tableheader">Product Name</th>
                    <th className="layout-tableheader">Selling Price</th>
                    <th className="layout-tableheader">Profit</th>
                    <th className="layout-tableheader">Discount</th>
                    <th className="layout-tableheader">Sold at</th>
                    <th className="layout-tableheader">Total Units</th>
                    {comp !== 'search-results' && 
                    <th className="layout-tableheader">Edit</th>}
                    {comp !== 'search-results' && 
                    <th className="layout-tableheader">Delete</th>}
                </tr>

                {currentSaleObj.products.map((currentProductObj, currentProductIndex) => {
                    const discount = parseFloat(currentProductObj.discount.$numberDecimal);
                    return (
                        <tr key={currentProductIndex}>
                        <td className="layout-tabledata">{currentProductIndex + 1}</td>
                        <td className="layout-tabledata">{currentProductObj.name}</td>
                        <td className="layout-tabledata">{currentProductObj.sellingPrice}</td>
                        <td className="layout-tabledata">{currentProductObj.profit}</td>
                        <td className="layout-tabledata">{discount.toFixed(2)}</td>
                        <td className="layout-tabledata">{currentProductIndex === 0 ? `${currentSaleObj.createdAt.date}/${
                            currentSaleObj.createdAt.month}/${currentSaleObj.createdAt.year}` : '-'}</td>
                        <td className="layout-tabledata">{currentProductObj.qty}</td>
                        <td className="layout-tabledata">
                        {comp !== 'search-results' && 
                        <Link style={{cursor: 'pointer'}} to={'/edit/sales'}>
                            <AiFillEdit />
                        </Link>}
                        </td>
                        {comp !== 'search-results' && 
                        <td style={{cursor: 'pointer'}} className="layout-tabledata">
                            <AiFillDelete onClick={()=> {
                                dispatch(deleteSale(currentSaleObj._id, salesMessageHandler));
                            }} />
                        </td>}
                        </tr>
                    )
                })}
                </React.Fragment>
            )})}
        </tbody>
        </table>

        <div onClick={() => {setShowSales(false)}} className='layout-close-wrapper'>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z" opacity=".87"></path><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z"></path></svg>
        </div>
    </div>}

    {salesArray && salesArray.length === 0 && 
    <h2 style={{marginBottom: '2rem'}}>No results found.</h2>}
    </>
  )
}

export default SalesTable;