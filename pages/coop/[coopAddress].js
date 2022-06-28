import { useStarknet, useStarknetCall } from "@starknet-react/core";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { Badge, Card, Col, Container, Placeholder, Row } from "react-bootstrap";
import { toHex } from "starknet/dist/utils/number";
import { decodeShortString } from "starknet/dist/utils/shortString";
import EtherscanAddressLink from "../../components/EtherscanAddressLink";
import JoinCoop from "../../components/JoinCoop";
import Tasks from "../../components/Tasks";

import { useBlockcoopContract } from "../../hooks/blockcoop.ts"

const Coop = () => {
    const router = useRouter()
    const { coopAddress } = router.query

    const { account } = useStarknet()
    const { contract } = useBlockcoopContract(coopAddress)

    const [coop, setCoop] = useState(null)
    const [isMember, setIsMember] = useState(false)

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

    return <Container className="main-content">
        {
            coop ?
            <>
                <h2 className="fw-bold mb-5">{coop.name} <small className="text-muted">({coop.symbol})</small></h2>
                <Row className="mb-5">
                    <Col sm="6">
                        <h4 className="fw-bold mb-3">Details</h4>
                        <ul className="list-unstyled list-details">
                            <li>
                                <span>COOP Initiator</span>
                                <span className="fw-bold">
                                    <EtherscanAddressLink address={coop.initiator} showIcon={true} />
                                </span>
                            </li>
                            <li>
                                <span>Quorum</span>
                                <span className="fw-bold">{coop.quorum}%</span>
                            </li>
                            <li>
                                <span>Supermajority</span>
                                <span className="fw-bold">{coop.supermajority}%</span>
                            </li>
                        </ul>
                    </Col>
                    <Col sm="6">
                        <Members coopAddress={coopAddress} setIsMember={setIsMember} />
                    </Col>
                </Row>
                {
                    isMember ?
                    <Tasks coopAddress={coopAddress} />:
                    <JoinCoop coopAddress={coopAddress} />
                }
            </> :
            <>
                <Placeholder className="fw-bold mb-5" as={Card.Title} animation="glow">
                    <Placeholder size="lg" xs={6} />
                </Placeholder>
                <Row>
                    <Col sm="6">
                        <Placeholder className="mb-3" as='h4' animation="glow">
                            <Placeholder xs={6} />
                        </Placeholder>
                        <Placeholder as="p" animation="glow">
                            <Placeholder xs={8} />
                        </Placeholder>
                        <Placeholder as="p" animation="glow">
                            <Placeholder xs={8} />
                        </Placeholder>
                        <Placeholder as="p" animation="glow">
                            <Placeholder xs={8} />
                        </Placeholder>
                        <Placeholder as="p" animation="glow">
                            <Placeholder xs={8} />
                        </Placeholder>
                    </Col>
                </Row>
            </>
        }
    </Container>
}

const Members = ({coopAddress, setIsMember}) => {
    const { account } = useStarknet()
    const { contract } = useBlockcoopContract(coopAddress)

    const [members, setMembers] = useState([])

    const { data, loading, error } = useStarknetCall({
        contract,
        method: 'getMembers',
        args: account? account : undefined,
    })

    useMemo(() => {
        console.log(account)
        if (loading || !data?.length) {
            setMembers([])
            return
        }
    
        if (error) {
            setMembers([])
            return
        }
    
        const value = data[0]
        if(value.length > 0) {
            const addresses = []
            if(value.length > 0) {
                value.forEach((item) => {
                    addresses.push(toHex(item))
                })
                setMembers(addresses)
            }
        }
        setIsMember(members.includes(account))
        
    }, [data, loading, error, account])

    return <>
        {
            members.length > 0 && !loading &&
            <>
                <h4 className="fw-bold mb-3">Members <Badge pill bg="secondary">{members.length}</Badge></h4>
                <ul className="list-unstyled list-details">
                    {
                        members.map((member, i) => {
                            return (<li key={i}>
                                <EtherscanAddressLink address={member} showIcon={true} />
                            </li>)
                        })
                    }
                    
                </ul>
            </>
        }
        
    </>
}

export default Coop;