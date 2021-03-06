import Head from "next/head";
import { useEffect, useState } from "react";
import { useAccount, useContract, useNetwork, useSigner } from "wagmi";
import styles from "../styles/Home.module.css";
import contractABI from "../contractABI.json";

// components
import Header from "../components/Header";
import ConnectModal from "../components/ConnectModal";
import PoliticalParties from "../components/PoliticalParties";
import SwitchNetworkModal from "../components/SwitchNetworkModal";

export default function Home() {
  const [owner, setOwner] = useState(null);
  const [userVotes, setUserVotes] = useState(null);
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  const [
    { data: networkData, loading: networkLoading, error: networkError },
    switchNetwork,
  ] = useNetwork();

  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });
  const [{ data: signer }] = useSigner();
  const contract = useContract({
    addressOrName: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    contractInterface: contractABI.abi,
    signerOrProvider: signer,
  });

  useEffect(() => {
    if (accountData) {
      setConnectModalOpen(false);
    }
  }, [accountData]);

  useEffect(() => {
    if (contract && signer && networkData?.chain?.id == 4) {
      contract.owner().then((owner) => setOwner(owner));
      contract
        .userVotes(signer?._address)
        .then((userVotes) => setUserVotes(userVotes.toNumber()));
    }
  }, [contract, signer]);

  const isOwner = owner === accountData?.address;

  console.log("networkData", networkData);

  return (
    <div className={styles.container}>
      <Head>
        <title>Vote Dapp</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {networkData?.chain?.id == 4 || !accountData ? (
        <>
          <Header
            accountData={accountData}
            disconnect={disconnect}
            setConnectModalOpen={setConnectModalOpen}
            isOwner={isOwner}
            contract={contract}
            userVotes={userVotes}
          />

          <PoliticalParties contract={contract} accountData={accountData} />

          <ConnectModal
            isOpen={connectModalOpen}
            onClose={() => setConnectModalOpen(false)}
          />
        </>
      ) : (
        <SwitchNetworkModal
          networkData={networkData}
          networkLoading={networkLoading}
          switchNetwork={switchNetwork}
          networkError={networkError}
        />
      )}
    </div>
  );
}
