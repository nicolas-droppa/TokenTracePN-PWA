import { ARC_TYPE } from '../../../constants/net';

const ArrowMarker = ({ id, color }) => (
    <marker id={id} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
    </marker>
);

const InhibitorMarker = ({ id, color, backgroundColor }) => ( 
    <marker id={id} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <circle cx="5" cy="5" r="4" fill={backgroundColor} stroke={color} strokeWidth="1.5" />
    </marker>    
);

const ReadMarker = ({ id, color }) => ( 
    <marker id={id} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <circle cx="5" cy="5" r="4" fill={color} />
    </marker>
);

const ResetMarker = ({ id, color }) => ( 
    <marker id={id} viewBox="0 0 20 10" refX="20" refY="5" markerWidth="12" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z M 10 0 L 20 5 L 10 10 z" fill={color} />
    </marker>
);

export const ARC_MARKERS = {
    [ARC_TYPE.REGULAR]: ArrowMarker,
    [ARC_TYPE.INHIBITOR]: InhibitorMarker,
    [ARC_TYPE.READ]: ReadMarker,
    [ARC_TYPE.RESET]: ResetMarker,
};