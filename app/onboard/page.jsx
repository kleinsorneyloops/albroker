import { OnboardFlow } from 'components/onboard/onboard-flow';

export const metadata = {
  title: 'Get Started',
};

export default function OnboardPage() {
  return (
    <div className="py-8">
      <OnboardFlow />
    </div>
  );
}
