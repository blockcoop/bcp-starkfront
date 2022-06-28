import { useStarknet, useStarknetCall } from "@starknet-react/core";
import { useMemo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { toHex } from "starknet/dist/utils/number";
import CoopCard from "../components/CoopCard";
import { useCoopFactoryContract } from "../hooks/blockcoop.ts";

const ViewCoops = () => {
    const { account } = useStarknet()
    const { contract } = useCoopFactoryContract()

    const [coopAddresses, setCoopAddresses] = useState([])

    const { data, loading, error } = useStarknetCall({
        contract,
        method: 'get_coops',
        args: account ? [account] : undefined,
    })

    useMemo(() => {
        if (loading || !data?.length) {
            setCoopAddresses([])
            return
        }
    
        if (error) {
            setCoopAddresses([])
            return
        }
    
        const value = data[0]
        if(value.length > 0) {
            const addresses = []
            if(value.length > 0) {
                value.forEach((item) => {
                    addresses.push(toHex(item))
                })
                setCoopAddresses(addresses)
            }
        }
        
    }, [data, loading, error])

    return (
        <Container className="main-content">
            {coopAddresses.length}
            { loading && <p>Loading..</p> }
            <Row className="mt-5 view-coops">
                { coopAddresses.map(function(coopAddress, i) {
                    return <Col xl="3" lg="4" md="6" key={i}>
                        <CoopCard coopAddress={coopAddress} />
                    </Col>
                }) }
            </Row>
        </Container>
    )
}

export default ViewCoops;
