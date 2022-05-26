import { connect, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import React, { Fragment, ReactNode, RefObject, useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const Filter = ({ handleChange, filter }) => {
    return (
        <div className='filter__outer'>
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

export default Filter;