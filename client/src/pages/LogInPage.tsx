import SigningForm from "../components/SigningForm";

export default function LogInPage() {
  return (
    <div className="mx-auto p-3 max-w-lg">
      <h1 className="text-center text-3xl my-10">Log-In</h1>

      <SigningForm isRegister={false} />
    </div>
  );
}
