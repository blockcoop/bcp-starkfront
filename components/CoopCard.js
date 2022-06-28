import { useStarknet, useStarknetCall } from "@starknet-react/core";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, Placeholder } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { toHex } from "starknet/dist/utils/number";
import { decodeShortString } from "starknet/dist/utils/shortString";
import { useBlockcoopContract } from "../hooks/blockcoop.ts";
import EtherscanAddressLink from "./EtherscanAddressLink";

const CoopCard = ({coopAddress}) => {
    const { account } = useStarknet()
    const { contract } = useBlockcoopContract(coopAddress)
    const [coop, setCoop] = useState(null)

    const { data, loading, error } = useStarknetCall({
        contract,
        method: 'getDetails',
        args: account? account : undefined,
    })

    useMemo(() => {
        if (loading || !data?.length) {
            setCoop(null)
            return
        }
    
        if (error) {
            setCoop(null)
            return
        }
    
        if(data.length > 0) {
            const obj = {
                name: decodeShortString(toHex(data['name'])),
                symbol: decodeShortString(toHex(data['symbol'])),
                initiator: toHex(data['initiator']),
                quorum: data['quorum'].toString(10),
                supermajority: data['supermajority'].toString(10)
            }
            setCoop(obj)
            console.log(data.name)
        }
        
    }, [data, loading, error])

    return <Card className="mb-4 shadow">
        { loading && <p>Loading coop</p> }
        {
            coop ?
            <Link href={`/coop/${coopAddress}`}>
                <a>
                <Card.Body style={{width: '100%'}}>
                    <Card.Title className="fw-bold mb-4">{coop.name} {""} <small className="text-muted">({coop.symbol})</small></Card.Title>
                    <ul className="list-unstyled list-details mb-0">
                        <li>
                            <span>Coop Initiator</span>
                            <span className="fw-bold ms-2">
                                <EtherscanAddressLink address={coop.initiator} />
                            </span>
                            
                        </li>
                        <li>
                            <span>Quorum</span>
                            <span className="fw-bold ms-2">{coop.quorum}%</span>
                            
                        </li>
                        <li>
                            <span>Supermajority</span>
                            <span className="fw-bold ms-2">{coop.supermajority}%</span>
                        </li>
                    </ul>
                </Card.Body>
                </a>
            </Link>
            :
            <Card.Body style={{width: '100%'}}>
                <Placeholder as={Card.Title} animation="glow">
                    <Placeholder xs={6} />
                </Placeholder>
                <Placeholder as={Card.Text} animation="glow">
                    <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                    <Placeholder xs={6} /> <Placeholder xs={8} />
                </Placeholder>
            </Card.Body>
        }
    </Card>
}

export default CoopCard;