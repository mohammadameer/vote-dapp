import { Box, Button, Icon, Text } from "@chakra-ui/react";
import { useState } from "react";
import { FaSignOutAlt as SignOutIcon } from "react-icons/fa";
import NewPoliticalPartyModal from "./NewPoliticalPartyModal";

const Header = ({
  accountData,
  disconnect,
  setConnectModalOpen,
  isOwner,
  userVotes,
  contract,
}) => {
  const [newPoliticalPartyModalOpen, setNewPoliticalPartyModalOpen] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const resetVote = async () => {
    setLoading(true);
    const resetVoteTxn = await contract.resetUserVotes();
    await resetVoteTxn.wait();
    setLoading(false);
  };

  console.log("userVotes", userVotes);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexDirection="row"
      mt={4}
    >
      <Text fontSize="3xl">Vote Dapp</Text>

      {accountData ? (
        <Box>
          {userVotes > 0 ? (
            <Button mr={4} disabled={loading} onClick={resetVote}>
              reset my vote
            </Button>
          ) : null}
          {isOwner ? (
            <Button mr={4} onClick={() => setNewPoliticalPartyModalOpen(true)}>
              Add Political Party
            </Button>
          ) : null}
          <Button onClick={disconnect} rightIcon={<Icon as={SignOutIcon} />}>
            {accountData.ens?.name
              ? accountData.ens?.name
              : `${accountData.address.slice(
                  0,
                  6
                )}...${accountData.address.slice(-6, -1)}`}
          </Button>
        </Box>
      ) : (
        <Button onClick={() => setConnectModalOpen(true)}>Connect</Button>
      )}
      <NewPoliticalPartyModal
        isOpen={newPoliticalPartyModalOpen}
        onClose={setNewPoliticalPartyModalOpen}
        contract={contract}
      />
    </Box>
  );
};

export default Header;
