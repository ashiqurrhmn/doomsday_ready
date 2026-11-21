import ViewPlaceholder from "@/components/view-placeholder";

export const metadata = {
  title: "Booking",
};

export default function BookingPage() {
  return (
    <ViewPlaceholder
      eyebrow="Cinema booking"
      title="Booking"
      description="Choose a cinema and group size to calculate an exact minimum-bundle booking."
    />
  );
}
