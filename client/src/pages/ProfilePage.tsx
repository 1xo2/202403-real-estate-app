
import Avatar from "../components/Avatar";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import PageContainer from "../components/PageContainer";
import SigningForm from "../components/SigningForm";
import { eForms } from "../share/enums";
import { useRef } from "react";


export default function ProfilePage() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const refFile = useRef(null)

  return (


    <PageContainer h1={"Profile Page"}>
      <div className="flex flex-col">
        <Avatar user={currentUser}
          cssClass="rounded-full self-center h-24 w-24 object-cover cursor-pointer mb-4 " />
        <SigningForm forms={eForms.profile} />
      </div>
      <input type="file" ref={refFile} ></input>
    </PageContainer>



  )
}