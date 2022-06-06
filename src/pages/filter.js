import { connect, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import React, { Fragment, ReactNode, RefObject, useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const Filter = ({ handleChange, filter }) => {
    // console.log('filter', filter)
    return (
        <div className='filter__outer'>
            <label>Filter via agent</label>
            <div className="filter">
                <select onChange={handleChange}>
                    <option value="blank"></option>
                    {filter.map((item, i) => {
                        return <option key={"filter" + i} value={item}>{item}</option>
                    })}
                </select>
            </div>
        </div>
    )
}

export default React.memo(Filter);