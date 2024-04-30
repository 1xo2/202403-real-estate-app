import PageContainer from "../components/PageContainer";
import SigningForm from "../components/SigningForm";
import { eForms } from "../share/enums";

export default function LogInPage() {
  return (
    // <div className="mx-auto p-3 max-w-lg">
    //   <h1 className="text-center text-3xl my-10">Log-In</h1>
    // </div>
    <PageContainer h1={"Log-In Page"}>
      <SigningForm forms={eForms.login} />
    </PageContainer>
  );
}
