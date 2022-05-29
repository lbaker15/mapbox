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
const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9]

export const setMarkers = ({ width, close, setBounds, markersSt, showingFeatures, mapRef, setMarkersSt }) => {
    markersSt.map((marker) => {
        marker.remove()
    })

    let markers = []; let bounds = [];
    showingFeatures.map((feature, i) => {
        let image = images[feature.properties.marker - 1]
        //Element creation (grab from dom D:) Could dynamically add the marker to the DOM here
        let element = document.createElement('div')
        element.classList.add('my-class')
        element.style.backgroundImage = `url(${image})`;
        let lat = feature.geometry.coordinates[0];
        let lng = feature.geometry.coordinates[1];
        console.log(feature.geometry.coordinates)
        let marker = new mapboxgl.Marker(element)
            .setLngLat(feature.geometry.coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(
                        `
                    <div id="header">${feature.properties.companyName}</div>
                    <div class="w-90">
                    <h2>${feature.properties.subject}</h2>
                    <hr />
                    <h3>${feature.properties.description}</h3>
                    <p id="contact">${feature.properties.contact}</p>
                    </div>
                    <div id="footer">
                        <button
                        onclick="window.location.href = 'http://maps.google.com/maps?z=12&t=m&q=loc:${lng}+${lat}'"
                        ></button>
                        <button
                        onclick='document.location.href = "tel:+${feature.properties.phone}"'
                        ></button>
                        <div id="dets">
                            <p>Date: ${feature.properties.time}</p>
                            <p>AGENT: ${feature.properties.agent}</p>
                        </div>
                    </div>
  
                    `
                    )
            )
            .addTo(mapRef.current);
        bounds.push(feature.geometry.coordinates)
        markers.push(marker)
        if (i === showingFeatures.length - 1) {
            // BOUNDS SW NE - LOW TO HIGH LNG LAT
            if (bounds.length < 2) {
                bounds = (bounds === 0) ? [[6.108715050165898,45.83010067882378], [9.863999940713143,47.78974172714257]] : [bounds.flat(), bounds.flat()]
                setBounds(bounds)
                if (close) {
                    mapRef.current.fitBounds(bounds, { padding: { top: 75, left: 75, right: 75, bottom: 75 }, duration: 500, maxZoom:12 })
                } else {
                    mapRef.current.fitBounds(bounds, { padding: { top: 75, left: width, right: 75, bottom: 75 }, duration: 500, maxZoom:12 })
                }
                setMarkersSt(markers)
            } else {
                let highLat = 47.78974172714257; let lowLat = 45.83010067882378;
                let lowLng = 6.108715050165898; let highLng = 9.863999940713143;
                bounds.map((b, i) => {
                    let theLat = b[1]; let theLng = b[0];
                    if (theLat < lowLat) {
                        lowLat = theLat
                        if (theLng < highLng) {
                            highLng = theLng
                        } else if (theLng > lowLng) {
                            lowLng = theLng
                        }
                    } else if (theLat > highLat) {
                        highLat = theLat
                        if (theLng < highLng) {
                            highLng = theLng
                        } else if (theLng > lowLng) {
                            lowLng = theLng
                        } 
                    }
                    if (i===bounds.length-1) {
                        bounds = [[lowLng, lowLat], [highLng, highLat]]
                        console.log('here new', bounds)
                        setBounds(bounds)
                        if (close) {
                            mapRef.current.fitBounds(bounds, { padding: { top: 75, left: 75, right: 75, bottom: 75 }, duration: 500, maxZoom:12 })
                        } else {
                            mapRef.current.fitBounds(bounds, { padding: { top: 75, left: width, right: 75, bottom: 75 }, duration: 500, maxZoom:12 })
                        }
                        setMarkersSt(markers)
                    }
                })
                    
             
            }



        }
    })
}