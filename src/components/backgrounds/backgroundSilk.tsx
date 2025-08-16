// components/background/BackgroundSilk.tsx
import Silk from "../../assets/backgrouds/silk";
// import silk from "../../assets/backgrouds/silk";

export default function BackgroundSilk() {
  return (
    <div className="fixed inset-0 -z-10">
      <Silk
        speed={2}
        scale={0.8}
        color="#121212" // or any hex code you like
        noiseIntensity={0}
        rotation={0}
      />
    </div>
  );
}
