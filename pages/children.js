import { useStarknet, useStarknetCall, useStarknetInvoke } from "@starknet-react/core"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap"
import { toBN, toHex } from "starknet/dist/utils/number"
import { decodeShortString, encodeShortString } from "starknet/dist/utils/shortString"
import EtherscanAddressLink from "../components/EtherscanAddressLink"
import { useParentContract, useChildContract } from "../hooks/blockcoop.ts"

const CreateChild = () => {
    const { account } = useStarknet()
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [amountError, setAmountError] = useState('')
    const [nameError, setNameError] = useState('')

    const { contract } = useParentContract()

    const { loading, error, reset, invoke } = useStarknetInvoke({ contract, method: 'create_child' })

    const updateAmount = useCallback(
        (newAmount) => {
            setAmount(newAmount)
            try {
                setAmount(toBN(newAmount))
                setAmountError(undefined)
            } catch (err) {
                console.error(err)
                setAmountError('Please input a valid balance')
            }
        },
        [setAmount]
    )

    const updateName = useCallback(
        (_name) => {
            setName(_name)
            try {
                setName(encodeShortString(_name))
                setNameError(undefined)
            } catch (err) {
                console.error(err)
                setNameError('Please input a valid name')
            }
        },
        [setName]
    )

    const handleUpdate = useCallback(() => {
        reset()
        if (account) {
            const message = `Creating child with name ${name.toString()} by ${account}`
            invoke({ args: [name, amount], metadata: { method: 'create_child', message } })
        }
    }, [account, name, amount, invoke, reset])

    const updateButtonDisabled = useMemo(() => {
        if (loading) return true
        return !account
    }, [loading, account])

    return (
        <div className="mb-4">
            <h5>Create Child</h5>
            <Form>
                <Row className="align-items-center">
                    <Col xs="auto">
                        <Form.Label htmlFor="inlineFormInput" visuallyHidden>
                            Name
                        </Form.Label>
                        <Form.Control
                            className="mb-2"
                            id="inlineFormInput"
                            placeholder="Name"
                            onChange={(evt) => updateName(evt.target.value)}
                        />
                    </Col>
                    <Col xs="auto">
                        <Form.Label htmlFor="inlineFormInput1" visuallyHidden>
                            Balance
                        </Form.Label>
                        <Form.Control
                            type="number"
                            className="mb-2"
                            id="inlineFormInput1"
                            placeholder="Balance"
                            onChange={(evt) => updateAmount(evt.target.value)}
                        />
                    </Col>
                    <Col xs="auto">
                        <Button className="mb-2" disabled={updateButtonDisabled} onClick={handleUpdate}>
                            {loading ? 'Waiting for wallet' : 'Submit'}
                        </Button>
                    </Col>
                </Row>
                {error && <p className="text-danger">Error: {error}</p>}
                {amountError && <p className="text-danger">Error: {amountError}</p>}
                {nameError && <p className="text-danger">Error: {nameError}</p>}
            </Form>
        </div>
    )
}

const ChildList = (props) => {
    const { account } = useStarknet()
    const { contract } = useParentContract()

    const [childAddresses, setChildAddresses] = useState([])

    const { data, loading, error } = useStarknetCall({
        contract,
        method: 'getChildren',
        args: account ? [account] : undefined,
    })

    useMemo(() => {
        if (loading || !data?.length) {
            setChildAddresses([])
            return
        }
    
        if (error) {
            setChildAddresses([])
            return
        }
    
        const value = data[0]
        if(childAddresses.length != props.count && value.length > 0) {
            const addresses = []
            if(value.length > 0) {
                value.forEach((item) => {
                    addresses.push(toHex(item))
                })
                console.log(addresses)
                setChildAddresses(addresses)
            }
        }
        
    }, [data, loading, error, props.count])

    return (
        <Row>
            { loading && <p className="text-info">Loading ...</p> }
            {childAddresses.map((address, i) => {
                return (
                    <Col key={i} sm="4">
                        <Child address={address} />
                    </Col>
                )
            })}
        </Row>
    )
}

const Child = (props) => {
    return <Card>
        <Card.Body>
            <div>
                <b>Address: </b><EtherscanAddressLink address={props.address} showIcon={true} />
            </div>
            <ChildName address={props.address} />
            <ChildBalance address={props.address} />
        </Card.Body>
    </Card>
}

const ChildName = (props) => {
    const { account } = useStarknet()
    const { contract } = useChildContract(props.address)

    const { data, loading, error } = useStarknetCall({
        contract,
        method: 'get_name',
        args: account ? [account] : undefined,
    })

    const content = useMemo(() => {
        if (loading || !data?.length) {
          return <>Loading name</>
        }
        if (error) {
          return <>Error: {error}</>
        }
        const name = decodeShortString(toHex(data[0]))
        return <>{name}</>
    }, [data, loading, error])
    
    return (
        <div>
            <b>Name: </b>{content}
        </div>
    )
}

const ChildBalance = (props) => {
    const { account } = useStarknet()
    const { contract } = useChildContract(props.address)

    const { data, loading, error } = useStarknetCall({
        contract,
        method: 'get_balance',
        args: account ? [account] : undefined,
    })

    const content = useMemo(() => {
        if (loading || !data?.length) {
          return <>Loading balance</>
        }
        if (error) {
          return <>Error: {error}</>
        }
        const balance = data[0]
        return <>{balance.toString(10)}</>
    }, [data, loading, error])
    
    return (
        <div>
            <b>Balance: </b>{content}
        </div>
    )
}

const Children = () => {
    const { account } = useStarknet()
    const { contract } = useParentContract()

    const [count, setCount] = useState('-')

    const { data, loading, error } = useStarknetCall({
        contract,
        method: 'childCount',
        args: account ? [account] : undefined,
    })

    useEffect(() => {
        if (loading || !data?.length) {
            setCount('.')
            return
        }
    
        if (error) {
            setCount('!')
            return
        }
    
        const value = data[0]
        setCount(value.toString(10))
    }, [data, loading, error])

    return (
        <Container className="main-content">
            <h2 className="mb-4">Children <small>({count})</small></h2>
            <CreateChild />
            { count > 0 && <ChildList count={count} /> }
        </Container>
    )
}

export default Children