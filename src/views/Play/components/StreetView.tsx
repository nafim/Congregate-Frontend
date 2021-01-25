import React, {useRef, useState, useEffect} from 'react';
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
    const [streetView, setStreetView] = useState<google.maps.StreetViewPanorama>();

    useEffect(() => {
        createView(ref);
        return () => {
            google.maps.event.clearInstanceListeners(streetView!);
        }
    },[props.streetViewOptions.position])

    useEffect(() => {
        if (streetView) {
            streetView!.addListener('position_changed', () => {
                props.onPositionChanged(streetView!.getPosition().toJSON());
            })
        }
    })

    const createView = (ref: React.RefObject<HTMLDivElement>) => {
        if (!streetView) {
            loader
            .load()
            .then(() => {
                setStreetView(new google.maps.StreetViewPanorama(ref.current!, props.streetViewOptions));
                streetView!.addListener('position_changed', () => {
                    props.onPositionChanged(streetView!.getPosition().toJSON());
                })
            })
            .catch(e => {
                console.error(e);
            });
        } else {
            streetView.setPosition(props.streetViewOptions.position!);
        }
    }

    return (
        <div style={{ height: '100%', width: "100%" }} ref={ref}/>
    );

}

export default StreetView;