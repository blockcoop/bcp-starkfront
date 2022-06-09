import { FaExternalLinkAlt } from 'react-icons/fa'
import { getShortAddress } from "../hooks/utils";

const EtherscanAddressLink = ({address, showIcon}) => {
    return <a href={"https://goerli.voyager.online/contract/"+address} target="_blank" rel="noreferrer">
        { getShortAddress(address) }
        { showIcon && <FaExternalLinkAlt /> }
    </a>
}

export default EtherscanAddressLink;