import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import dynamic from "next/dynamic";

const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
});


export default async function Page() {
  const accessToken = await getHumeAccessToken();

  if (!accessToken) {
    throw new Error();
  }

  return (
    <div className="flex flex-row h-screen">
      {/* Left side: Fixed Figma preview */}
      <div className="w-[800px] flex-shrink-0">
        <iframe
          className="w-full h-full"
          style={{ background: "#000000" }}
          src="https://embed.figma.com/proto/VVCNpbM14JxiWIAnCwdRUt/Coinpay-Fintech-Finance-Mobile-App-UI-kit-(Community)-(Community)?node-id=685-11773&node-type=canvas&scaling=min-zoom&content-scaling=fixed&page-id=685%3A10519&embed-host=share"
        ></iframe>
      </div>
      
      {/* Right side: Scrollable Chat component */}
      <div className="flex-grow overflow-y-auto">
        <Chat accessToken={accessToken} />
      </div>
    </div>
  );
}
