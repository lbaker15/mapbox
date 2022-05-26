import { connect, useDispatch } from 'react-redux';
import React, { Fragment, ReactNode, RefObject, useCallback, useEffect, useState } from 'react';
import { RootState } from '../store';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Filter from './filter';
import {setMarkers} from './helper';
import Sidebar from './sidebar';
let access = 'pk.eyJ1IjoiYmxhdWVmZWRlcjYiLCJhIjoiY2wyM2xweDlsMDl4eDNqcGIxMzlldzNibSJ9.dFnmYEKtVv34_JChnYZRjA';
mapboxgl.accessToken = access;


type Props = {
    reducer: { items: object[] }
}
const Dashboard = ({ reducer }: Props) => {
    let dispatch = useDispatch();
    const [bounds, setBounds] = useState<any>([])
    const [close, setClose] = useState(true)
    const [features, setFeatures] = useState([])
    const [showingFeatures, setShowingFeatures] = useState([])
    const [filter, setFilter] = useState<any[]>([]);
    const [filterState, showFilter] = useState(false)
    const [markersSt, setMarkersSt] = useState<any>([])
    const [agent, setAgent] = useState('')
    let mapContainer: RefObject<HTMLDivElement> = React.useRef(null)
    let mapRef: any = React.useRef(null);
    let ref = React.useRef(null);
    useEffect(() => {
        if (mapRef.current) return;
        if (mapContainer) {
            const current: any = mapContainer.current;
            mapRef.current = new mapboxgl.Map({
                container: current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [0, 0],
                zoom: 1
            });
        }
    }, [])
    useEffect(() => {
        let username = 'blauefeder6';
        let accessToken = 'sk.eyJ1IjoiYmxhdWVmZWRlcjYiLCJhIjoiY2wzajNpN2QxMGdzdzNqcGNjNWxiMjMwMyJ9.mfJc4Y3WDDTT83gGkb8YPQ'
        fetch(`https://api.mapbox.com/datasets/v1/${username}/cl3j6sh8h0a2u27lnjadddnto/features?access_token=${accessToken}`)
            .then(res => res.json())
            .then(data => {
                setFeatures(data.features)
                //setTimeout(() => initialFeatures(), 500)
            })
            .catch(err => {
                return err;
            })
    }, [mapRef])
    useEffect(() => {
        if (filter.length === 0) {
            let arr:any = [];
            features.map((item: any, i: number) => {
                let agent = item.properties.agent;
                console.log('ag', agent)
                if (agent) {
                    arr.push(agent)
                    if (i === features.length - 1) {
                        showFilter(true)
                        setShowingFeatures(features)
                        setFilter(arr)
                    }
                }
                if (i === features.length - 1) {
                    showFilter(true)
                    setShowingFeatures(features)
                }
            })
        }
    }, [features])
    const handleChange = (e: any) => {
        let value = e.target.value;
        setAgent(value)
    }
    useEffect(() => {
        if (agent === 'blank' && filter && features) {
            let arr = features;
            console.log(arr)
            setShowingFeatures(arr)
        } else if (filter && features && agent) {
            let arr = features.filter((item: any, i) => {
                return item.properties.agent === agent
            });
            setShowingFeatures(arr)
        }
    }, [agent])
    useEffect(() => {
        if (agent) {
            //markerSt, showingFeatures, mapRef, setMarkersSt
            setMarkers({close, setBounds, markersSt, showingFeatures, mapRef, setMarkersSt})
        }
    }, [showingFeatures])


    return (
        <Fragment>
            <Sidebar close={close} setClose={setClose} setBounds={setBounds} bounds={bounds} markersSt={markersSt} mapRef={mapRef} setMarkersSt={setMarkersSt} features={features} setShowingFeatures={setShowingFeatures} />
            {filterState && filter.length > 0 &&
                <Filter handleChange={handleChange} filter={filter} />
            }
            <div className="map" ref={mapContainer}></div>
        </Fragment>

    )
}

const mapStateToProps = (state: RootState) => ({
    reducer: state.reducer
})

export default connect(mapStateToProps)(Dashboard)