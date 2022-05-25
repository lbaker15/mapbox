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
const images:any = [img1, img2, img3, img4, img5, img6, img7, img8, img9]

export const setMarkers = ({markersSt, showingFeatures, mapRef, setMarkersSt}: any) => {
    markersSt.map((marker:any) => {
        marker.remove()
    })

    let markers:any = [];
    showingFeatures.map((feature: any, i:any) => {
        let image = images[feature.properties.marker-1]
        //Element creation (grab from dom D:) Could dynamically add the marker to the DOM here
        let element = document.createElement('div')
        element.classList.add('my-class')
        element.style.backgroundImage = `url(${image})`;
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
                        <button></button>
                        <button></button>
                        <div id="dets">
                            <p>Date: ${feature.properties.time}</p>
                            <p>AGENT: ${feature.properties.agent}</p>
                        </div>
                    </div>
  
                    `
                )
        )
        .addTo(mapRef.current);
        markers.push(marker)
        if (i === showingFeatures.length-1) {
            setMarkersSt(markers)
        }
    })
}