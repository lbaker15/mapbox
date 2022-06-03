import { connect, useDispatch } from 'react-redux';
import React, { Fragment, ReactNode, RefObject, useCallback, useEffect, useState } from 'react';
import { RootState } from '../store';
import { setMarkers, addUsers } from './helper';
import { gsap } from 'gsap';

const Sidebar = React.forwardRef(({ users, close, setClose, setBounds, markersSt, bounds, setMarkersSt, features }, ref) => {
    const {mapRef, ref2} = ref.current;
    const [searchSt, setSearchSt] = useState('')
    const [state, setState] = useState([])
    const [resize, setResize] = useState(Date.now())
    const [showingResults, setShowingResults] = useState([])

    const handleChange = (e) => {
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
        const searchedObjects = []
        state.forEach((singleObject, index) => {
            Promise.all(Object.values(singleObject).map((onlyValues, valIndex) => {
                if (onlyValues) {
                    if (onlyValues.toLowerCase().includes(searchSt.toLowerCase())) {
                        console.log('inc')
                        if (!searchedObjects.find((obj) => obj === singleObject)) {
                            console.log('not found')
                            searchedObjects.push(singleObject)
                            return;
                        }
                    }
                }
            })).then(() => {
                if (index === state.length - 1) {
                    setShowingResults(searchedObjects)
                }
            })
        })
    }
    const handleClick = () => {
        let a = []
        setValues()
        showingResults.map((item, i) => {
            let newArr = features.filter((f) => {
                return f.id === item.id;
            })
            if (newArr.length) { a.push(newArr[0]) }
            if (i === showingResults.length - 1) {
                console.log(a)
                let showingFeatures = a;
                let width = ref2.current.clientWidth;
                setMarkers({ width, close, setBounds, markersSt, showingFeatures, mapRef, setMarkersSt })
                addUsers({ users, width, close, setBounds, markersSt, showingFeatures, mapRef, setMarkersSt })
            }
        })
    }
    useEffect(() => {
        let arr = new Array;
        features.map((item, i) => {
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
    const setMapMenu = () => {
        if (ref2.current) {
            let width = ref2.current.clientWidth;
            if (close) {
                let margin = 15;
                gsap.to(ref2.current, { transform: `translateX(-${width - (width/5 - margin)}px)` })
               
                mapRef.current.fitBounds(bounds, { padding: { left: 75, top: 75, right: 75, bottom: 75 }, duration: 500 })
            } else {
                gsap.to(ref2.current, { transform: 'translateX(0px)' })
   
                mapRef.current.fitBounds(bounds, { padding: { left: width, top: 75, right: 75, bottom: 75 }, duration: 500 })
            }
        }
    }
    const handleClose = () => {
        let cl = !close; setClose(cl);
    }
    useEffect(() => {
        if (ref.current && mapRef.current) {
            setMapMenu()
        }
    }, [resize, close])

    useEffect(() => {
        window.addEventListener('resize', () => {
            if (ref2.current && mapRef.current) {
                setResize(Date.now())
            }
        })
        return () => {
            window.removeEventListener('resize', () => { })
        }
    }, [])

    return (
        <div
            ref={ref2}
            className="sidebar__outer">
            <button
                className="sidebarBtn"
                onClick={handleClose}
            >+</button>
            <div
                className="sidebar">
                <div className='top'>
                    <input
                        // disabled={state.length === 0}
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
                    {showingResults.map((item, i) => {
                        const properties = item;
                        let date = (properties.date) ? new Date(Number(properties.date)).toDateString() : null;
                        return (
                            <div
                                key={Math.random()}
                                data-value={item.id}
                                className="body-item">
                                <h2>{properties.cn}</h2>
                                <h3>{properties.c}</h3>
                                <h4>{properties.a}</h4>

                                <h5>
                                    {(properties.date) ?
                                        date + ' / '
                                        : ''
                                    }
                                    Vertreter: {properties.agent}</h5>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
})

export default React.memo(Sidebar);