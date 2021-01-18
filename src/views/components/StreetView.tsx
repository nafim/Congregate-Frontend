import React, {useRef, useEffect} from 'react';
import { Loader } from "@googlemaps/js-api-loader";

interface StreetViewProps {
    apiKey: string;
    streetViewOptions: google.maps.StreetViewPanoramaOptions;
    onPositionChanged: (position: google.maps.LatLngLiteral) => void;
};

function StreetView(props: StreetViewProps) {
    const ref = useRef<HTMLDivElement>(null);
    const loader = new Loader({
        apiKey: props.apiKey,
        version: "weekly"
    })
    var streetView: google.maps.StreetViewPanorama;

    useEffect(() => {
        createView(ref);
        return () => {
            google.maps.event.clearInstanceListeners(streetView);
        }
    },)

    const createView = (ref: React.RefObject<HTMLDivElement>) => {
        if (!streetView) {
            loader
            .load()
            .then(() => {
                streetView = new google.maps.StreetViewPanorama(ref.current!, props.streetViewOptions);
                streetView.addListener('position_changed', () => {
                    props.onPositionChanged(streetView.getPosition().toJSON());
                })
            })
            .catch(e => {
                console.error(e);
            });
        }
    }

    return (
        <div style={{ height: '100%' }} ref={ref}/>
    );

}

export default StreetView;