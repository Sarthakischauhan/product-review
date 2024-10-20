'use client'
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FigmaEmbed = () => {
    return (
        <div className="w-1/2 h-[100vh]">
            <iframe className="w-full h-full aspect-video" src="https://embed.figma.com/proto/XCes61wZ9PlOuY6p50vV51/Simple-calhacks?node-id=0-1428&node-type=frame&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=0%3A1422&embed-host=share" ></iframe>
            {/* <iframe className="w-full h-full aspect-video" src="https://www.sarchauhan.dev" sandbox=""></iframe> */}

        </div>
    )
}

export default FigmaEmbed
