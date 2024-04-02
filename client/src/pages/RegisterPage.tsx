
import SigningForm from "../components/SigningForm";

export default function RegisterPage() {


  return (
    <div className="mx-auto p-3 max-w-lg">
      <h1 className="text-center text-3xl my-10">Register</h1>

      <SigningForm isRegister={true} />      
    </div>
  );
}
