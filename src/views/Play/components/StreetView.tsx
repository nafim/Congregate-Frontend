import React, {useRef, useState, useEffect} from 'react';
import { Loader } from "@googlemaps/js-api-loader";

interface StreetViewProps {
    apiKey: string;
    position: google.maps.LatLngLiteral;
    markerPosition: google.maps.LatLngLiteral;
    onPositionChanged: (position: google.maps.LatLngLiteral) => void;
};

function StreetView(props: StreetViewProps) {
    const ref = useRef<HTMLDivElement>(null);
    const loader = new Loader({
        apiKey: props.apiKey,
        version: "weekly"
    });
    const [streetView, setStreetView] = useState<google.maps.StreetViewPanorama>();
    const [marker, setMarker] = useState<google.maps.Marker>();

    useEffect(() => {
        createView(ref);
        if (streetView) {
            streetView!.addListener('position_changed', () => {
                props.onPositionChanged(streetView!.getPosition().toJSON());
            })
            // if marker already exists
            if (marker) {
                marker.setMap(streetView);
            // else create a new marker
            } else {
                setMarker(new google.maps.Marker({
                    position: props.markerPosition,
                    map: streetView,
                    icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=wc-male|FFFF00',
                    // icon: 'http://maps.google.com/mapfiles/ms/micons/man.png',
                    title: 'Other Player'
                }))
            }
            return () => {
                google.maps.event.clearInstanceListeners(streetView!);
            }
        }
    },[streetView])

    // if streetView has been created, then upon position change, update streetView
    useEffect(() => {
        if (streetView) {
            streetView.setPosition(props.position);
        }
    }, [props.position])

    // if marker has been created, then upon position change, update marker
    useEffect(() => {
        if (marker) {
            marker.setPosition(props.markerPosition);
        }
    }, [props.markerPosition])

    const createView = (ref: React.RefObject<HTMLDivElement>) => {
        if (!streetView) {
            loader
            .load()
            .then(() => {
                setStreetView(new google.maps.StreetViewPanorama(ref.current!, {
                    position: props.position,
                    pov: { heading: 165, pitch: 0 },
                    motionTracking: false,
                    motionTrackingControl: false,
                    addressControl: false,
                }));
            })
            .catch(e => {
                console.error(e);
            });
        }
    }

    return (
        <div style={{ height: '100%', width: "100%" }} ref={ref}/>
    );

}

export default StreetView;