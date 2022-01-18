import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

const NewPoliticalPartyModal = ({ contract, isOpen, onClose }) => {
  const [partyName, setPartyName] = useState("");
  const [presidentName, setPresidentName] = useState("");
  const [loading, setLoading] = useState(false);

  const addNewParty = async () => {
    setLoading(true);
    const newPoliticalPartyTxn = await contract.addPoliticalParty(
      partyName,
      presidentName
    );

    await newPoliticalPartyTxn.wait();

    setLoading(false);

    onClose();
  };

  return (
    <Modal motionPreset="slideInBottom" onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent pb={5}>
        <ModalHeader>New Political Party</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDir="column">
          <Text mb={2}>Party Name:</Text>
          <Input
            value={partyName}
            onChange={(event) => setPartyName(event.target.value)}
            mb={4}
          />
          <Text mb={2}>President Name:</Text>
          <Input
            value={presidentName}
            onChange={(event) => setPresidentName(event.target.value)}
            mb={8}
          />

          <Button
            isLoading={loading}
            disabled={!partyName || !presidentName || loading}
            onClick={addNewParty}
          >
            Add
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NewPoliticalPartyModal;
