import { connect, useDispatch } from 'react-redux';
import React, { Fragment, ReactNode, RefObject, useCallback, useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Filter from './filter';
import { setMarkers, addUsers } from './helper';
import Sidebar from './sidebar';
import Zoom from './zoom';
import User from './user';
let access = 'pk.eyJ1IjoiYmxhdWVmZWRlcjYiLCJhIjoiY2wyM2xweDlsMDl4eDNqcGIxMzlldzNibSJ9.dFnmYEKtVv34_JChnYZRjA';
mapboxgl.accessToken = access;
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default; // eslint-disable-line



const Dashboard = ({ reducer }) => {
    let dispatch = useDispatch();
    const [bounds, setBounds] = useState([[6.108715050165898, 45.83010067882378], [9.863999940713143, 47.78974172714257]])
    const [close, setClose] = useState(false)
    const [features, setFeatures] = useState([])
    const [showingFeatures, setShowingFeatures] = useState([])
    const [filter, setFilter] = useState([]);
    const [filterState, showFilter] = useState(false)
    const [markersSt, setMarkersSt] = useState([])
    const [users, setUsers] = useState([])
    const [usersSt, setUsersSt] = useState([])
    const [agent, setAgent] = useState('')
    let mapContainer = React.useRef(null)
    let mapRef = React.useRef(null);
    let ref2 = React.useRef(null);
    useEffect(() => {
        if (mapRef.current) return;
        if (mapContainer) {
            const current = mapContainer.current;
            mapRef.current = new mapboxgl.Map({
                container: current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [0, 0],
                maxZoom: 20,
                minZoom: 7
            });
        }
    }, [])
    useEffect(() => {
        let username = 'blauefeder6';
        let accessToken = 'sk.eyJ1IjoiYmxhdWVmZWRlcjYiLCJhIjoiY2wzajNpN2QxMGdzdzNqcGNjNWxiMjMwMyJ9.mfJc4Y3WDDTT83gGkb8YPQ'
        fetch(`https://api.mapbox.com/datasets/v1/${username}/cl3j6sh8h0a2u27lnjadddnto/features?access_token=${accessToken}`)
            .then(res => res.json())
            .then(data => {
                fetch(`https://api.mapbox.com/datasets/v1/${username}/cl3t0e5rv039s28mzlw0ni8g5/features?access_token=${accessToken}`)
                .then(res => res.json())
                .then(data2 => {
                    let arr = data2.features;
                    setUsers(arr)
                    setFeatures(data.features)
                })
            })
            .catch(err => {
                return err;
            })
    }, [mapRef])
    useEffect(() => {
        if (filter.length === 0) {
            let arr = [];
            features.map((item, i) => {
                let agent = item.properties.agent;
                if (agent) {
                    if (!arr.find(ag => ag === agent)) {
                        arr.push(agent)
                        if (i === features.length - 1) {
                            showFilter(true)
                            setShowingFeatures(features)
                            setFilter(arr)
                        }
                    }
                }
                if (i === features.length - 1) {
                    setFilter(arr)
                    showFilter(true)
                    setShowingFeatures(features)
                }
            })
        }
    }, [features])
    const handleChange = (e) => {
        let value = e.target.value;
        setAgent(value)
    }
    useEffect(() => {
        if (agent === 'blank' && filter && features) {
            let arr = features;
            setShowingFeatures(arr)
        } else if (filter && features && agent) {
            let arr = features.filter((item, i) => {
                return item.properties.agent === agent
            });
            setShowingFeatures(arr)
        }
    }, [agent])
    useEffect(() => {
        if (ref2.current) {
        let width = ref2.current.clientWidth;
        //Tried merging users arr with feature but really weird err invalid lat lng even tho were valid?
        //call set markers within users? but remove all markers in users then add relevant user marker w no pop then go onto add other markers
        addUsers({ usersSt, setUsersSt, users, width, close, setBounds, markersSt, showingFeatures, mapRef, setMarkersSt })
        }
    }, [showingFeatures, users, ref2])

    const dashRef = React.useRef({ref2, mapRef})
    console.log(dashRef, ref2)
    return (
        <Fragment>
            {mapRef.current && 
            <Sidebar 
            ref={dashRef}
            users={users} close={close} setClose={setClose} setBounds={setBounds} bounds={bounds} markersSt={markersSt} setMarkersSt={setMarkersSt} features={features} setShowingFeatures={setShowingFeatures} />
            }
            {filterState && filter.length > 0 &&
                <Filter handleChange={handleChange} filter={filter} />
            }
            <div className="map" ref={mapContainer}></div>
            <Zoom mapRef={mapRef} />
            <User setUsers={setUsers} users={users} />
        </Fragment>

    )
}

const mapStateToProps = (state) => ({
    reducer: state.reducer
})

export default connect(mapStateToProps)(Dashboard)