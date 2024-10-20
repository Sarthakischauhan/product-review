'use client'
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FigmaEmbed = () => {
    return (
        <div className="w-1/2 h-[100vh]">
            <iframe className="w-full h-full aspect-video" src="https://embed.figma.com/proto/hvDCKqa4lQeYCZD1Dgy6Ap/Untitled?node-id=125-1178&node-type=canvas&scaling=scale-down&content-scaling=fixed&page-id=104%3A2&starting-point-node-id=125%3A1178&embed-host=share" ></iframe>
        </div>
    )
}

export default FigmaEmbed
