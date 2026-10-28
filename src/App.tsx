import { Modal } from "./components/Modal/Modal";
import { UpdateForm } from "./components/UpdateForm/UpdateForm";

export default function App() {
  return (
    <Modal title="Neues Update erstellen">
      <UpdateForm />
    </Modal>
  );
}
