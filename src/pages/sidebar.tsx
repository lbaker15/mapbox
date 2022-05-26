import { connect, useDispatch } from 'react-redux';
import React, { Fragment, ReactNode, RefObject, useCallback, useEffect, useState } from 'react';
import { RootState } from '../store';
import { setMarkers } from './helper';

const Sidebar = ({ close, setClose, setBounds, markersSt, bounds, setMarkersSt, mapRef, features, setShowingFeatures }: any) => {
    const [searchSt, setSearchSt] = useState('')
    const [test, setTest] = useState(0)
    const [state, setState] = useState<any>([])
    const [showingResults, setShowingResults] = useState<any>([])
    const handleChange = (e: any) => {
        setSearchSt(e.target.value)
    }
    useEffect(() => {
        if (searchSt === '') {
            setShowingResults(state)
        } else {
            setValues()
        }
    }, [searchSt])
    const setValues = () => {
        const searchedObjects: any = []
        state.forEach((singleObject: any, index: any) => {
            console.log(singleObject)
            Promise.all(Object.values(singleObject).map((onlyValues: any, valIndex) => {
                if (onlyValues) {
                    if (onlyValues.toLowerCase().includes(searchSt.toLowerCase())) {
                        console.log('inc')
                        if (!searchedObjects.find((obj: any) => obj === singleObject)) {
                            console.log('not found')
                            searchedObjects.push(singleObject)
                            return;
                        }
                    }
                }
            })).then(() => {
                if (index === state.length-1) {
                    setShowingResults(searchedObjects)
                }
            })
        })
    }
    const handleClick = () => {
        let a: any = []
        setValues()
        showingResults.map((item: any, i: any) => {
            let newArr = features.filter((f: any) => {
                return f.id === item.id;
            })
            if (newArr.length) { a.push(newArr[0]) }
            if (i === showingResults.length - 1) {
                console.log(a)
                let showingFeatures = a;
                setMarkers({ close, setBounds, markersSt, showingFeatures, mapRef, setMarkersSt })
            }
        })
    }
    useEffect(() => {
        let arr = new Array;
        features.map((item: any, i: any) => {
            const { properties } = item;
            let cn = properties.companyName;
            let c = properties.contact;
            let a = properties.address;
            let date = properties.date;
            let agent = properties.agent;
            let id = item.id;
            let obj = { cn, c, a, date, agent, id }
            arr.push(obj)
            if (i === features.length - 1) {
                setState(arr)
                setShowingResults(arr)
            }
        })

    }, [features])
    const handleClose = () => {
        let cl = !close; setClose(cl);
        if (close) {
        mapRef.current.easeTo({
            padding: 300,
            duration: 1000 // In ms. This matches the CSS transition duration property.
        });
        mapRef.current.fitBounds(bounds, {padding: {left: 300, top: 75, right: 75, bottom: 75}})
        } else {
            mapRef.current.easeTo({
                padding: 0,
                duration: 1000 // In ms. This matches the CSS transition duration property.
            });
        }
    }
    return (
        <>
        <button
        style={close ? {transform: 'translateX(0)'} : {transform: 'translate(305px)'}}
        className="sidebarBtn"
        onClick={handleClose}
        >+</button>
        <div 
        style={close ? {transform: 'translateX(-325px)'}: {transform: 'translateX(0)'}}
        className="sidebar">
            <div className='top'>
                <input
                    disabled={state.length === 0}
                    onChange={handleChange}
                    value={searchSt}
                />
                <button
                    onClick={handleClick}
                >
                    Search
                </button>
            </div>
            <div className='body'>
                {showingResults.map((item: any, i: any) => {
                    const properties = item;
                    return (
                        <div
                            data-value={item.id}
                            className="body-item">
                            <h2>{properties.cn}</h2>
                            <h3>{properties.c}</h3>
                            <h4>{properties.a}</h4>
                            <h5>{properties.date} {(properties.date) ? '/' : null} Vertreter: {properties.agent}</h5>
                        </div>
                    )
                })}
            </div>
        </div>
        </>
    )
}

export default React.memo(Sidebar);