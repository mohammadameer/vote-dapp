import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useConnect } from "wagmi";

const ConnectModal = ({ isOpen, onClose }) => {
  const [{ data, loading, error }, connect] = useConnect();

  return (
    <Modal motionPreset="slideInBottom" onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent pb={5}>
        <ModalHeader>Connect Your Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDir="column">
          {data.connectors.map((x) => (
            <Button
              disabled={loading}
              key={x.id}
              onClick={() => connect(x)}
              mb={4}
            >
              {x.name}
              {!x.ready && " (unsupported)"}
            </Button>
          ))}

          {error && (
            <Text color="red.500">{error?.message ?? "Failed to connect"}</Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConnectModal;
