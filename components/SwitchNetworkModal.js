import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

const SwitchNetworkModal = ({
  networkData,
  networkLoading,
  switchNetwork,
  networkError,
}) => {
  const router = useRouter();

  return (
    <Modal motionPreset="slideInBottom" isOpen={networkData?.chain?.id != 4}>
      <ModalOverlay />
      <ModalContent pb={5}>
        <ModalHeader>Chang Chain Network</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDir="column">
          <Text fontSize="xl" mb={8}>
            To use the Vote Dapp you must be in the rinkeby testnet
          </Text>

          <Button
            disabled={networkLoading}
            onClick={() => {
              router.reload();
            }}
          >
            reload page
          </Button>
          {networkError && <Text>{SwitchNetworkModal?.message}</Text>}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SwitchNetworkModal;
