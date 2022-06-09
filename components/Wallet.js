import { useStarknet, InjectedConnector } from '@starknet-react/core'
import { useEffect } from 'react';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { getShortAddress } from '../hooks/utils';

const Wallet = () => {
    const { account, connect, connectors, disconnect } = useStarknet()
   
    return (
        <>
        {
            account ?
            <DropdownButton id="dropdown-item-button" align="end"
                title={"Connected: "+getShortAddress(account)}
            >
                <Dropdown.Item href={"https://goerli.voyager.online/contract/"+account} target="_blank" className="fw-bold">
                    {getShortAddress(account)} {" "} <FaExternalLinkAlt />
                </Dropdown.Item>
            </DropdownButton> :
            <Button onClick={() => connect(new InjectedConnector())}>Connect Wallet</Button>
        }
        </>
    )
}

export default Wallet;