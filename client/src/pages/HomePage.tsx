import PageContainer from "../components/PageContainer"

export default function HomePage() {

  const testModal = () => {
    console.log('testModal')
// throw new Error("test error");

    // ModalOkCancel({
    //   message: 'test message',
    //   onOK: () => {
    //     console.log('onOK')
    //   },
    //   onCancel: () => {
    //     console.log('onCancel')
    //   },
    //   type: 'info',
    //   isDialogVisible: true
    // })


  }

  return (
    <PageContainer h1={"Home Page"}>

      <div>HomePage</div>
      <button onClick={testModal} >xxx</button>
    </PageContainer>
  )
}