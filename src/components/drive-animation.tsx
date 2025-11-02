
"use client";

import { CarState } from "@/lib/types";
import { Car } from 'lucide-react';
import { cn } from "@/lib/utils";

interface DriveAnimationProps {
    carState: CarState;
}

const DriveAnimation = ({ carState }: DriveAnimationProps) => {
    const carPositionClass = {
        left: '-translate-x-20',
        center: 'translate-x-0',
        right: 'translate-x-20',
    }[carState.position];

    return (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center overflow-hidden perspective">
            <div className={cn("absolute w-full h-full road-turn-animation", carState.speed === 'moving' ? 'road-animation' : '')}>
                {/* Road */}
                <div className="absolute w-1/2 h-full bg-gray-600 left-1/4 transform -translate-x-1/2">
                     {/* Dashed lines */}
                    <div className="absolute w-2 h-full left-1/2 -translate-x-1/2">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="absolute w-full bg-yellow-400" style={{ height: '50px', top: `${i * 100}px` }}></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Car */}
            <div className={cn("absolute bottom-10 z-10 transition-transform duration-500", carPositionClass)}>
                <Car className="w-24 h-24 text-red-500 transform -rotate-90" style={{ filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))' }}/>
            </div>
        </div>
    );
};

export default DriveAnimation;
