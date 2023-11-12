import React from 'react';
import { 
  Center, 
  Modal,
} from 'native-base';

interface AppModalProps {
  showModal: boolean,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  modalButton: React.ReactNode,
  headerTitle?: string,
  closeButton?: boolean,
  children?: React.ReactNode,
  backgroundColor?: string,
}

const AppModal = ({
  showModal,
  setShowModal,
  modalButton,
  headerTitle,
  closeButton = false,
  children,
  backgroundColor,
}: AppModalProps) => {
  return (
    <Center>
      { modalButton }
      <Modal 
        isOpen={showModal} onClose={() => setShowModal(false)}
      >
        <Modal.Content 
          maxWidth={'600px'}
          borderRadius={'0px'}
          borderWidth={'2px'}
          backgroundColor={backgroundColor}
        >
          {
            closeButton && 
              <Modal.CloseButton 
                left={'5px'}
                top={'5px'}
              />
          }
          {
            headerTitle && <Modal.Header>{ headerTitle }</Modal.Header>
          }
          <Modal.Body width={'100%'}>
            { children }
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

export default AppModal;