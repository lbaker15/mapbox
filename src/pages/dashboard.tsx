import { connect, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { addData, getData } from '../actions/index';
import React, { Fragment, RefObject, useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { RootState } from '../store';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import img1 from '../images/1_new.png';
import img2 from '../images/2_progress.png';
import img3 from '../images/3_call.png';
import img4 from '../images/4_personall.png';
import img5 from '../images/5_mail.png';
import img6 from '../images/6_pro.png';
import img7 from '../images/7_aktiv.png';
import img8 from '../images/8_passiv.png';
import img9 from '../images/9_dead.png';
let access = 'pk.eyJ1IjoiYmxhdWVmZWRlcjYiLCJhIjoiY2wyM2xweDlsMDl4eDNqcGIxMzlldzNibSJ9.dFnmYEKtVv34_JChnYZRjA';
mapboxgl.accessToken = access;

const images:any = [img1, img2, img3, img4, img5, img6, img7, img8, img9]

type Props = {
    reducer: { items: object[] }
}
const Dashboard = ({ reducer }: Props) => {
    let dispatch = useDispatch();
    const [features, setFeatures] = useState([])
    const [showingFeatures, setShowingFeatures] = useState([])
    const [filter, setFilter] = useState<any[]>([]);
    const [filterState, showFilter] = useState(false)
    const [markersSt, setMarkersSt] = useState<any>([])
    const [imgsSt, setImgsSt] = useState<any>([])
    const [agent, setAgent] = useState('')
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [zoom, setZoom] = useState(9);
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
            mapRef.current.on('move', () => {
                setLng(mapRef.current.getCenter().lng.toFixed(4));
                setLat(mapRef.current.getCenter().lat.toFixed(4));
                setZoom(mapRef.current.getZoom().toFixed(2));
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
        setMarkers()
        }
    }, [showingFeatures])
    const setMarkers = () => {
        markersSt.map((marker:any) => {
            marker.remove()
        })


        let markers:any = [];
        let imgs:any = [];
        showingFeatures.map((feature: any, i) => {
            let image = images[feature.properties.marker-1]
            //Element creation (grab from dom D:) Could dynamically add the marker to the DOM here
            let el2 = document.querySelectorAll('.marker')
            //Cast first found marker as HTMLDivElement
            let el3 = (el2[0] as HTMLDivElement)
            let marker = new mapboxgl.Marker(el3)
            .setLngLat(feature.geometry.coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(
                        `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
                    )
            )
            .addTo(mapRef.current);
            console.log('a', marker)
            //marker.getElement().style.setProperty('background-image', `url('${img1}')`, 'important')
            // console.log(Object.values(marker)[19].children[0])
            // Object.values(marker)[19].style.setProperty('background-image', `url('${img1}')`, 'important')
            // Object.values(marker)[19].style.setProperty('background-size', `60%`, 'important')
            // Object.values(marker)[19].style.setProperty('background-position', `cover`, 'important')
            // Object.values(marker)[19].style.setProperty('width', `60px`, 'important')
            // Object.values(marker)[19].style.setProperty('height', `60px`, 'important')
            markers.push(marker)
            if (i === showingFeatures.length-1) {
                setMarkersSt(markers)
            }
        })
    }

    return (
        <Fragment>
            <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            {filterState && filter.length > 0 &&
                <div className="filter">
                    <select onChange={handleChange}>
                        <option value="blank"></option>
                        {filter.map((item, i) => {
                            return <option key={"filter" + i} value={item}>{item}</option>
                        })}
                    </select>
                </div>
            }
            <div className="map" ref={mapContainer}></div>
        </Fragment>

    )
}

const mapStateToProps = (state: RootState) => ({
    reducer: state.reducer
})

export default connect(mapStateToProps)(Dashboard)