import { connect, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { addData, getData } from '../actions/index';
import React, { Fragment, ReactNode, RefObject, useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { RootState } from '../store';

const Filter = ({handleChange, filter}:any) => {
    return (
        <div className="filter">
            <select onChange={handleChange}>
                <option value="blank"></option>
                {filter.map((item: any, i:number) => {
                    return <option key={"filter" + i} value={item}>{item}</option>
                })}
            </select>
        </div>
    )
}

export default Filter;