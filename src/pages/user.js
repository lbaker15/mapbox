import { useEffect, useState } from "react";
import { setMarkers } from "./helper";


const User = ({ users, setUsers, setShowingFeatures, setAgent, bounds, width, close, setBounds, markersSt, showingFeatures, mapRef, setMarkersSt }) => {
    const [status, setStatus] = useState(7)
    const [lat, setLat] = useState(null)
    const [lng, setLng] = useState(null)
    const [value, setValue] = useState()
    const [id, setId] = useState()
    const handleCh = (event) => {
        const index = event.target.selectedIndex;
        const optionElement = event.target.childNodes[index];
        const optionElementId = optionElement.getAttribute('id');
        setId(optionElementId)
        setValue(event.target.value)
    }
    const handleClick = (e) => {
        if (value) {
        if (!navigator.geolocation) {
            setStatus('Geolocation is not supported by your browser');
        } else {
            setStatus('Locating...');
            navigator.geolocation.getCurrentPosition((position) => {
                setStatus(null);
                let lat = position.coords.latitude;
                let lng = position.coords.longitude;
                setLat(lat);
                setLng(lng);
                console.log(position.coords.latitude)
                fetch(`https://api.mapbox.com/datasets/v1/blauefeder6/cl3t0e5rv039s28mzlw0ni8g5/features/${id}?access_token=sk.eyJ1IjoiYmxhdWVmZWRlcjYiLCJhIjoiY2wzajNpN2QxMGdzdzNqcGNjNWxiMjMwMyJ9.mfJc4Y3WDDTT83gGkb8YPQ`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "type": "Feature",
                        "properties": {
                            "name": String(value)
                        },
                        "id": String(id),
                            "geometry": {
                                "type": "Point",
                                "coordinates": [lng, lat]
                            }
                        
                    })
                }).then(res => res.json())
                .then(data => {
                    fetch(`https://api.mapbox.com/datasets/v1/blauefeder6/cl3t0e5rv039s28mzlw0ni8g5/features?access_token=sk.eyJ1IjoiYmxhdWVmZWRlcjYiLCJhIjoiY2wzajNpN2QxMGdzdzNqcGNjNWxiMjMwMyJ9.mfJc4Y3WDDTT83gGkb8YPQ`)
                    .then(res => res.json())
                    .then(data2 => {
                        let arr = data2.features;
                        //filter arr and make sure the current user (locate with id) is set to coords lat lng
                        let arr2 = data2.features.map(user => {
                            if (user.id === id) {
                                user.geometry.coordinates = [lng,lat]
                            }
                            return user;
                        })
                        setUsers(arr2)
                    })
                })
            }, () => {
                setStatus('Unable to retrieve your location');
            });
        }
    } else {
        console.log('no')
    }
    }

    if (users.length > 0) {
        return (
            <div className="user">
                <select onChange={handleCh}>
                    <option></option>
                    {users.map((item, i) => {
                        if (item.id && item.properties.name) {
                            return <option key={"name" + i} id={item.id}>{item.properties.name}</option>
                        }
                    })}
                </select>
                <button
                    onClick={handleClick}
                >Locate</button>
            </div>
        )
    } else {
        return <div>loading</div>
    }
}

export default User;