import { Modal } from "antd";
import ReactPlayer from "react-player";

const PreviewModal = ({ showModal, setShowModal, preview }) => {
  return (
    <>
      <Modal
        title="Basic Modal"
        visible={showModal}
        onCancel={() => {
          setShowModal(!showModal);
        }}
      >
        <div className="wrapper">
          <ReactPlayer
            url={preview}
            playing={showModal}
            width="410px"
            height="240px"
            controls
          />
        </div>
      </Modal>

      <Modal
        title="Course Preview"
        visble={true}
        width={720}
        footer={null}
      ></Modal>
    </>
  );
};

export default PreviewModal;
