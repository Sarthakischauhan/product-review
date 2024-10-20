'use client'
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
const FigmaEmbed = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const totalSlides = 10 // Adjust this number based on your Figma prototype

    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev))
    }

    const goToPrevSlide = () => {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev))
    }
    return (
        <div className="w-1/2">
            <iframe
            src={`https://embed.figma.com/proto/VVCNpbM14JxiWIAnCwdRUt/Coinpay-Fintech-Finance-Mobile-App-UI-kit-(Community)-(Community)?node-id=685-11773&node-type=canvas&scaling=min-zoom&content-scaling=fixed&page-id=685%3A10519&embed-host=share&starting-point-node-id=${685 + currentSlide}`}
            className="w-full h-full"
            allowFullScreen
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <Button
                    onClick={goToPrevSlide}
                    disabled={currentSlide === 0}
                    className="bg-white text-black hover:bg-gray-200"
                >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button
                    onClick={goToNextSlide}
                    disabled={currentSlide === totalSlides - 1}
                    className="bg-white text-black hover:bg-gray-200"
                >
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export default FigmaEmbed