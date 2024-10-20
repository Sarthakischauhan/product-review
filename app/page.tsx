import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import dynamic from "next/dynamic";
import FigmaEmbed from "@/components/FigmaEmbed";


const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
});


export default async function Page() {
  const accessToken = await getHumeAccessToken();


  if (!accessToken) {
    throw new Error();
  }

  return (
      <div className="flex h-screen">
      {/* Left side - Figma prototype embed */}
        <FigmaEmbed />
    
      {/* Right side - Product review interface */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8 bg-white">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold">
            Thank you for taking time to take our product review. Press "start call" to begin reviewing
          </h2>
          <p className="text-sm text-gray-500">
            Don't worry, we will not be storing your audio and video feed.
          </p>
          <div className="flex-grow overflow-y-auto">
            <Chat accessToken={accessToken} />
          </div>
        </div>
      </div>
    </div>
  )

}
