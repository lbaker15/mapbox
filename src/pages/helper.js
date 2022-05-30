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
let userImage = img2;

export const addUsers = ({usersSt, setUsersSt, users, width, close, setBounds, markersSt, showingFeatures, mapRef, setMarkersSt}) => {
    markersSt.map((marker) => {
        marker.remove()
    })
    usersSt.map((marker) => {
        marker.remove()
    })
    let markers = []; let bounds = []; let usersArr = [];
    users.map((user, i) => {
        let element = document.createElement('div')
        //Set style for each user here... ie if user.properties.name == 'Noah' class[0]
        element.classList.add('user-marker')
        let marker = new mapboxgl.Marker(element)
        .setLngLat(user.geometry.coordinates)
        .addTo(mapRef.current);
        usersArr.push(marker)
        if (i === users.length-1) {
            setUsersSt(usersArr)
            setMarkers({ bounds, markers, width, close, setBounds, markersSt, showingFeatures, mapRef, setMarkersSt })
        }
    })
}

export const setMarkers = ({ bounds, markers, width, close, setBounds, markersSt, showingFeatures, mapRef, setMarkersSt }) => {
    showingFeatures.map((feature, i) => {
        let image = images[feature.properties.marker - 1]
        //Element creation (grab from dom D:) Could dynamically add the marker to the DOM here
        let element = document.createElement('div')
        element.classList.add('my-class')
        element.style.backgroundImage = `url(${image})`;
        let lat = feature.geometry.coordinates[0];
        let lng = feature.geometry.coordinates[1];

        let besuchInitial = (feature.properties.besuchInitial) ? (feature.properties.besuchInitial) ? feature.properties.besuchInitial[0] + feature.properties.besuchInitial[1] : feature.properties.besuchInitial : '';
        let orderInitial = (feature.properties.orderInitial) ? (feature.properties.orderInitial) ? feature.properties.orderInitial[0] + feature.properties.orderInitial[1] : feature.properties.orderInitial : '';
        console.log(besuchInitial, orderInitial)
        let marker = new mapboxgl.Marker(element)
            .setLngLat(feature.geometry.coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(
                        `
                        <div id="header">${feature.properties.companyName}</div>
                        <div class="w-90">
                        <div class="flex">
                    
                            <div class="w-80">
                                <h2>${feature.properties.subject}</h2>
                                <h5>${!feature.properties.date ? 'undefined' : new Date(Number(feature.properties.date)).toUTCString()}</h5>
                            </div>
                            <div class="w-20">
                                <button
                                onclick="window.location.href = 'http://maps.google.com/maps?z=12&t=m&q=loc:${lng}+${lat}'"
                                ></button>
                            </div>
                        </div>
                        <h3>${feature.properties.description}</h3>
                        <h4>${feature.properties.agent}</h4>
                        <p id="contact">${feature.properties.contact}</p>
                        </div>
                        <div id="footer">
                           <div class="col1">
                                <div>
                                    <h2>Besuch</h2>
                                    <h4>${feature.properties.besuch ? new Date(Number(feature.properties.besuch)).getDate() + '.' + new Date(Number(feature.properties.besuch)).getMonth() + besuchInitial : '<span>keiner</span>'}</h4>
                                </div>
                                <div>
                                    <h2>Karte</h2>
                                    <h4>${feature.properties.karte ? 'Aktiv' : '<span>Passiv</span>'}</h4>
                                </div>
                           </div>
                           <div class="col2">
                                <div>
                                    <h2>Sample</h2>
                                    <h4>${feature.properties.sampleDate ? new Date(Number(feature.properties.sampleDate)).getDate() + '.' + new Date(Number(feature.properties.sampleDate)).getMonth()  + feature.properties.sample[0] + feature.properties.sample[1] : '<span>keine</span>'}</h4>
                                </div>
                                <div>
                                    <h2>Order</h2>
                                    <h4>${feature.properties.order ? new Date(Number(feature.properties.order)).getDate() + '.' + new Date(Number(feature.properties.order)).getMonth() + orderInitial : '<span>keine</span>'}</h4>
                                </div>
                           </div>
                           <div class="col3">
                                <div id="pop-up">
                                    <div onclick="let pop = document.querySelector('#pop-up'); pop.style.display = 'none';" id="pop-close">X</div>
                                    <a
                                    style="color: white; text-decoration: none; font-size: 14px; text-align: center;"
                                    href="tel:${feature.properties.phone}"
                                    >${feature.properties.phone}</a>
                                    <a
                                    style="color: white; text-decoration: none;  font-size: 14px; text-align: center;"
                                    href="tel:${feature.properties.phone2}"
                                    >${feature.properties.phone2}</a>
                                </div>
                                <script>
                   
                                </script>
                                <button class="green" onclick="let pop = document.querySelector('#pop-up'); pop.style.display = 'flex';">Anrufen</button>
                                <button class="blue"><a href=${feature.properties.kunde_url}>Kunde</a></button>
                                <button class="orange">New</button>
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
                bounds = (bounds === 0) ? [[6.108715050165898, 45.83010067882378], [9.863999940713143, 47.78974172714257]] : [bounds.flat(), bounds.flat()]
                setBounds(bounds)
                if (close) {
                    mapRef.current.fitBounds(bounds, { padding: { top: 75, left: 75, right: 75, bottom: 75 }, duration: 500})
                } else {
                    mapRef.current.fitBounds(bounds, { padding: { top: 75, left: width, right: 75, bottom: 75 }, duration: 500 })
                }
                setMarkersSt(markers)
            } else {
                let highLat = 47.78974172714257; let lowLat = 45.83010067882378;
                let lowLng = 6.108715050165898; let highLng = 9.863999940713143;
                console.log(bounds)
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
                    if (i === bounds.length - 1) {
                        bounds = [[lowLng, lowLat], [highLng, highLat]]
                        console.log('here new', bounds)
                        setBounds(bounds)
                        if (close) {
                            mapRef.current.fitBounds(bounds, { padding: { top: 75, left: 75, right: 75, bottom: 75 }, duration: 500 })
                        } else {
                            console.log('check', bounds)
                            mapRef.current.fitBounds(bounds, { padding: { top: 75, left: width, right: 75, bottom: 75 }, duration: 500 })
                        }
                        setMarkersSt(markers)
                    }
                })


            }



        }
    })
}